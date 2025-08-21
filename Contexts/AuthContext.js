"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { ref, set, get, update, child } from "firebase/database";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Initialize Google Auth Provider
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });

  // Email sign up function
  async function signup(email, password, displayName, role = "patient") {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Store additional user data in Realtime Database
    await set(ref(db, `users/${user.uid}`), {
      email: user.email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
      isActive: true,
      authProvider: "email",
    });

    return userCredential;
  }

  // Email login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google sign in function
  async function signInWithGoogle(role = "patient") {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists in Realtime Database
      const userSnapshot = await get(ref(db, `users/${user.uid}`));

      if (!userSnapshot.exists()) {
        // New user - create their document
        await set(ref(db, `users/${user.uid}`), {
          email: user.email,
          displayName: user.displayName,
          role,
          createdAt: new Date().toISOString(),
          isActive: true,
          authProvider: "google",
          photoURL: user.photoURL,
        });
      } else {
        // Existing user - update their last login
        await update(ref(db, `users/${user.uid}`), {
          lastLoginAt: new Date().toISOString(),
        });
      }

      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Get user role from Realtime Database
  async function getUserRole(uid) {
    try {
      const userSnapshot = await get(ref(db, `users/${uid}`));
      if (userSnapshot.exists()) {
        return userSnapshot.val().role;
      }
      return "patient"; // default role
    } catch (error) {
      console.error("Error getting user role:", error);
      return "patient";
    }
  }

  // Get user data from Realtime Database
  async function getUserData(uid) {
    try {
      const userSnapshot = await get(ref(db, `users/${uid}`));
      if (userSnapshot.exists()) {
        return userSnapshot.val();
      }
      return null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Update user profile
  async function updateUserProfile(updates) {
    if (!currentUser) throw new Error("No user logged in");

    try {
      // Update Firebase Auth profile if display name is being changed
      if (updates.displayName) {
        await updateProfile(currentUser, { displayName: updates.displayName });
      }

      // Update Realtime Database
      await update(ref(db, `users/${currentUser.uid}`), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Update user role (admin function)
  async function updateUserRole(uid, newRole) {
    if (!currentUser) throw new Error("No user logged in");

    try {
      await update(ref(db, `users/${uid}`), {
        role: newRole,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid,
      });

      // Update local state if updating current user's role
      if (uid === currentUser.uid) {
        setUserRole(newRole);
      }

      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }

  // Get all users (admin function)
  async function getAllUsers() {
    try {
      const usersSnapshot = await get(ref(db, "users"));
      if (usersSnapshot.exists()) {
        const usersData = usersSnapshot.val();
        return Object.keys(usersData).map((uid) => ({
          uid,
          ...usersData[uid],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    signup,
    signInWithGoogle,
    logout,
    updateUserProfile,
    updateUserRole,
    getUserData,
    getAllUsers,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
