import React, { useContext, useState, useEffect } from 'react'
import { auth, database, db } from '../helpers/firebase';

type Props = {
  children: React.ReactNode;
};

type Context = {
  currentUser: {}
  // login: () => {},
  // logout: () => {},
  // signup: () => {},
  // resetPassword: () => {},
  // updateEmail: () => {},
  // updateUserProfile: () => {},
  // updatePassword: () => {},
  // updateProfilePicture: () => {},
  // checkUsername: () => {},
  // addPost: () => {},
  // addReply: () => {},
  // deletePost: () => {}
};

const defaultState = {
  currentUser: {},
  // login: () => void,
  // logout: () => void,
  // signup: () => void,
  // resetPassword: () => void,
  // updateEmail: () => void,
  // updateUserProfile: () => void,
  // updatePassword: () => void,
  // updateProfilePicture: () => void,
  // checkUsername: () => void,
  // addPost: () => void,
  // addReply: () => void,
  // deletePost: () => void
};

const AuthContext = React.createContext<Context>(defaultState);


export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true)

  function signup(email: string, password: string, username: string) {
    return auth.createUserWithEmailAndPassword(email, password).then(({ user }) => updateUsername(username, user));
  }

  async function updateUsername(username: String, createUser: firebase.User | null) {
    await database.ref("users").child(createUser.uid).set({
      username,
      email: createUser.email,
    });

    let data = {};
    data[username] = createUser.uid

    await database.ref("usernames").update(data)

  }

  async function checkUsername(username: string) {
    return database.ref(`usernames/${username}`).once("value").then((snapshot) => {
      return snapshot.exists();
    });
  }

  async function login(email: string, password: string) {
    return await auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email: string) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password: string) {
    return currentUser.updatePassword(password)
  }

  async function updateUserProfile(displayName: String) {
    if (displayName) {
      try {
        await currentUser.updateProfile({
          displayName
        })

        await database.ref("users").child(currentUser.uid).update({
          displayName,
        });
      } catch (error) {
        return 'something wrong happened'
      }
    }
  }

  async function updateProfilePicture(photoURL: string) {
    try {
      await currentUser.updateProfile({
        photoURL
      })

      await database.ref("users").child(currentUser.uid).update({
        photoURL,
      });
    } catch (error) {
      return 'something wrong happened'
    }
  }

  async function addPost(postText: String) {
    await db.collection("posts").add({
      text: postText,
      date: Date.now(),
      uid: currentUser.uid,
      parentId: null,
      postID: `${Math.round(Date.now() + Math.random())}`
    });
  }

  async function addReply(postText: String, parentId: String) {
    await db.collection("posts").add({
      text: postText,
      date: Date.now(),
      uid: currentUser.uid,
      parentId: parentId,
      postID: `${Math.round(Date.now() + Math.random())}`
    });
  }

  async function deletePost(postId: string) {
    const doc = await db.collection("posts").where("postID", "==", postId).get();

    if (doc.docs && doc.docs.length === 1) {
      await doc.docs[0].ref.delete();
    }

    return;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
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
    deletePost
  };

  return (
    <AuthContext.Provider value={value} >
      {!loading && children}
    </AuthContext.Provider>
  )
}
