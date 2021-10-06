import React, { useContext, useState, useEffect } from 'react'
import { auth, database , db } from '../helpers/firebase';

const AuthContext = React.createContext(null)

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true)

  function signup(email, password, username) {
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

  async function login(email, password) {
    return await auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
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

  async function updateProfilePicture(photoURL) {
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
      comments: [],
      postID: `${Math.round(Date.now() + Math.random())}`
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
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
    addPost
  };

  return (
    <AuthContext.Provider value={value} >
      {!loading && children}
    </AuthContext.Provider>
  )
}
