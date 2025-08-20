    const $ = (sel) => document.querySelector(sel);
    const historyEl = $('#history');
    let lastConfirmed = '';

    function pushHistory(text) {
      const row = document.createElement('div');
      row.textContent = `${new Date().toLocaleTimeString()} — ${text}`;
      historyEl.prepend(row);
      while (historyEl.children.length > 50) historyEl.removeChild(historyEl.lastChild);
    }

    function download(filename, text) {
      const el = document.createElement('a');
      el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      el.setAttribute('download', filename);
      el.style.display = 'none';
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    }

    const TIP = { THUMB: 4, INDEX: 8, MIDDLE: 12, RING: 16, PINKY: 20 };
    const PIP = { THUMB: 3, INDEX: 6, MIDDLE: 10, RING: 14, PINKY: 18 };

    function dist(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return Math.hypot(dx, dy); }

    function fingerOpen(landmarks, tipIdx, pipIdx, handedness) {
      if (tipIdx !== TIP.THUMB) return landmarks[tipIdx].y < landmarks[pipIdx].y;
      if (handedness === 'Right') return landmarks[TIP.THUMB].x < landmarks[PIP.THUMB].x;
      return landmarks[TIP.THUMB].x > landmarks[PIP.THUMB].x;
    }

    function isFist(openFingers) { return openFingers.filter(Boolean).length === 0; }

    function classifyGesture(landmarks, handedness) {
      if (!landmarks) return { label: '—', conf: 0 };

      const open = [
        fingerOpen(landmarks, TIP.THUMB, PIP.THUMB, handedness),
        fingerOpen(landmarks, TIP.INDEX, PIP.INDEX, handedness),
        fingerOpen(landmarks, TIP.MIDDLE, PIP.MIDDLE, handedness),
        fingerOpen(landmarks, TIP.RING, PIP.RING, handedness),
        fingerOpen(landmarks, TIP.PINKY, PIP.PINKY, handedness)
      ];

      const pinch = dist(landmarks[TIP.THUMB], landmarks[TIP.INDEX]) < 0.06;
      const openCount = open.filter(Boolean).length;

      if (pinch && open[0] && !open[2] && !open[3] && !open[4])
        return { label: 'ALLERGY', conf: 0.92 };

      if (open[1] && !open[2] && !open[3] && !open[4] && !open[0])
        return { label: 'FEVER', conf: 0.88 };

      if (open[1] && open[2] && !open[3] && !open[4] && !open[0])
        return { label: 'WATER', conf: 0.88 };

      if (open[0] && openCount <= 2 && !open[1] && !open[2])
        return { label: 'MEDICINE', conf: 0.86 };

      if (openCount === 5)
        return { label: 'HELP', conf: 0.90 };

      if (isFist(open))
        return { label: 'PAIN', conf: 0.90 };

      return { label: '—', conf: 0.0 };
    }

    const WINDOW = 12;
    const queue = [];
    function smooth(label) {
      queue.push(label);
      if (queue.length > WINDOW) queue.shift();
      const counts = {};
      for (const l of queue) counts[l] = (counts[l] || 0) + 1;
      let best = '—', bestN = 0;
      for (const [k, v] of Object.entries(counts)) if (v > bestN) { best = k; bestN = v; }
      const conf = bestN / queue.length;
      return { label: best, conf };
    }

    const videoEl = document.getElementById('video');
    const canvasEl = document.getElementById('canvas');
    const ctx = canvasEl.getContext('2d');

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    let _camera = null;
    let lastTime = performance.now();

    hands.onResults((results) => {
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;

      ctx.save();
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      ctx.globalAlpha = 0.9;
      ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height);
      ctx.globalAlpha = 1;

      let label = '—', conf = 0.0, handed = '–', lmCount = 0;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
          const landmarks = results.multiHandLandmarks[i];
          const hClass = results.multiHandedness?.[i]?.label || 'Right';
          handed = hClass;
          lmCount = landmarks.length;

          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { lineWidth: 3 });
          drawLandmarks(ctx, landmarks, { radius: 3 });

          const pred = classifyGesture(landmarks, hClass);
          const smoothPred = smooth(pred.label);
          label = smoothPred.label;
          conf = smoothPred.conf.toFixed(2);
        }
      } else {
        smooth('—');
      }

      document.getElementById('current').textContent = label;
      document.getElementById('conf').textContent = conf;
      document.getElementById('handed').textContent = handed;
      document.getElementById('lm').textContent = lmCount;

      const now = performance.now();
      const fps = 1000 / (now - lastTime);
      lastTime = now;
      document.getElementById('fps').textContent = fps.toFixed(1);

      if (label !== '—' && Number(conf) > 0.7 && label !== lastConfirmed) {
        pushHistory(label);
        lastConfirmed = label;
      }

      ctx.restore();
    });

    async function start() {
      if (_camera) return;
      _camera = new Camera(videoEl, {
        onFrame: async () => { await hands.send({ image: videoEl }); },
        width: 960,
        height: 540
      });
      await _camera.start();
    }

    function stop() {
      if (_camera) { _camera.stop(); _camera = null; }
      const stream = videoEl.srcObject;
      if (stream) stream.getTracks().forEach(t => t.stop());
    }

    document.getElementById('btnStart').addEventListener('click', start);
    document.getElementById('btnStop').addEventListener('click', stop);
    document.getElementById('btnClear').addEventListener('click', () => historyEl.innerHTML = '');
    document.getElementById('btnExport').addEventListener('click', () => {
      const lines = Array.from(historyEl.children).map(n => n.textContent).reverse();
      download(`translator_transcript_${Date.now()}.txt`, lines.join('\n'));
    });