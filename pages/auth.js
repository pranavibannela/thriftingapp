import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase'; // Ensure these functions are properly exported from firebase.js
import { useRouter } from 'next/router';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(true); // Toggles between Signup and Login
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (username) {
          await updateProfile(user, { displayName: username });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      router.push('/products');
    } catch (error) {
      handleAuthError(error.code);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setErrorMessage('');

    try {
      await signInWithGoogle();
      router.push('/products');
    } catch (error) {
      handleAuthError(error.code);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleAuthError = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please log in.',
      'auth/invalid-email': 'Invalid email format. Please check your email.',
      'auth/weak-password': 'Password is too weak. Please use a stronger password.',
      'auth/user-not-found': 'No user found with this email. Please sign up first.',
      'auth/wrong-password': 'Invalid password. Please try again.',
      'auth/network-request-failed': 'Network error. Please check your connection and try again.',
      'auth/popup-closed-by-user': 'Google sign-in was canceled. Please try again.',
    };

    setErrorMessage(errorMessages[errorCode] || 'An unexpected error occurred. Please try again.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gray-800 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <button
            className="py-2 px-4 bg-gray-700 text-white rounded-lg"
            onClick={handleGoogleSignIn}
            disabled={loading || loadingGoogle}
          >
            {loadingGoogle ? 'Processing...' : isSignUp ? 'Sign Up with Google' : 'Login with Google'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <span
              className="text-gray-800 cursor-pointer ml-2 font-medium"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? ' Login' : ' Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
