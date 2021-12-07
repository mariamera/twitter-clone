import React, { useContext, useState, useEffect, useCallback } from "react";
import { auth, database, db } from "../helpers/firebase";

type Props = {
  children: React.ReactNode;
};

type AuthContext = {
  currentUser: firebase.User | undefined;
  addPost: (post: string) => void;
  resetPassword: (email: string) => void;
  addReply: (postText: string, parentId: string) => void;
  login: (email: string, password: string) => void;
  deletePost: (postId: string) => void;
  logout: () => void;
  updateProfilePicture: (photoURL: string) => void;
  updateUserProfile: (displayName: string) => void;
  checkUsername?: (username: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => void;
};

const defaultState = {
  currentUser: undefined,
  addPost: (post: string) => {},
  resetPassword: (email: string) => {},
  addReply: (postText: string, parentId: string) => {},
  login: (email: string, password: string) => {},
  deletePost: (postId: string) => {},
  logout: () => {},
  updateProfilePicture: (photoURL: string) => {},
  updateUserProfile: (displayName: string) => {},
  signup: (email: string, password: string, username: string) => {},
  getUserName: () => {},
};

const AuthContext = React.createContext<AuthContext>(defaultState);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<firebase.User>();
  const [loading, setLoading] = useState(true);

  function signup(email: string, password: string, username: string) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        if (user) {
          return updateUsername(username, user);
        }
      })
      .catch((error: Error) => {
        throw new Error(error.message);
      });
  }

  async function updateUsername(username: string, createUser: firebase.User) {
    await database.ref("users").child(createUser.uid).set({
      username,
      email: createUser.email,
    });

    await database.ref("usernames").update({ [username]: createUser.uid });
  }

  async function checkUsername(username: string) {
    return database
      .ref(`usernames/${username}`)
      .once("value")
      .then((snapshot) => {
        return snapshot.exists();
      })
      .catch((error: Error) => {
        throw new Error(error.message);
      });
  }

  async function login(email: string, password: string) {
    return await auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email: string) {
    return currentUser!.updateEmail(email);
  }

  function updatePassword(password: string) {
    return currentUser!.updatePassword(password);
  }

  async function updateUserProfile(displayName: string) {
    if (displayName && currentUser) {
      try {
        await currentUser.updateProfile({
          displayName,
        });

        await database.ref("users").child(currentUser.uid).update({
          displayName,
        });
      } catch (error) {
        return "something wrong happened";
      }
    }
  }

  async function updateProfilePicture(photoURL: string) {
    if (!currentUser) {
      return;
    }

    try {
      await currentUser.updateProfile({
        photoURL,
      });

      await database.ref("users").child(currentUser.uid).update({
        photoURL,
      });
    } catch (error) {
      return "something wrong happened";
    }
  }

  async function addPost(postText: String) {
    await db.collection("posts").add({
      text: postText,
      date: Date.now(),
      uid: currentUser!.uid,
      parentId: null,
      postID: `${Math.round(Date.now() + Math.random())}`,
    });
  }

  async function addReply(postText: String, parentId: String) {
    await db.collection("posts").add({
      text: postText,
      date: Date.now(),
      uid: currentUser!.uid,
      parentId: parentId,
      postID: `${Math.round(Date.now() + Math.random())}`,
    });
  }

  async function deletePost(postId: string) {
    const doc = await db
      .collection("posts")
      .where("postID", "==", postId)
      .get();

    if (doc.docs.length === 1) {
      await doc.docs[0].ref.delete();
    }

    return;
  }

  const getUserName = () => {
    if (currentUser) {
      return database
        .ref(`users/${currentUser.uid}`)
        .once("value", (snapshot) => snapshot)
        .then((val) => {
          return val.val();
        })
    }

    return Promise.resolve()
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user || undefined);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    signup,
    resetPassword,
    updateEmail,
    updateUserProfile,
    updatePassword,
    updateProfilePicture,
    checkUsername,
    addPost,
    addReply,
    deletePost,
    getUserName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
