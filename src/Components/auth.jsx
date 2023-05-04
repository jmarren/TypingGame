import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const Auth = () => {
  const [signedIn, setSignedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSignedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setSignedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setSignedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {auth?.currentUser?.uid != null ? (
        <div>
          {auth.currentUser.email}
          <br />
          <button onClick={logOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          {/* <input
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          /> */}
          Sign In to Track Your Progress
          <br />
          {/* <button onClick={signIn}>Sign In</button> */}
          <button onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
