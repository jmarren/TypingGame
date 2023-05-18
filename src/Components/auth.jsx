import { useState, useEffect, useContext } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { AppContext } from "../../AppContext";

export const Auth = () => {
  // const [signedIn, setSignedIn] = useState(false);
  const { signedIn, signUserIn, signUserOut } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");

  console.log(auth?.currentUser?.email);

  useEffect(() => {
    console.log("signedIn changed");
    if (signedIn) {
      setUserEmail(auth?.currentUser?.email);
    } else {
      setUserEmail("");
    }
  }, [signedIn]);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      signUserIn();
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      signUserIn();
      // setUserEmail(currentUser?)
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      signUserOut();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {auth?.currentUser?.uid != null ? (
        <div>
          {userEmail}
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
