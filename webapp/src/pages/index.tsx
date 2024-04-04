import React, { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure that 'auth' is exported from your firebase.js/ts file

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Use 'signInWithEmailAndPassword' with the 'auth' object and credentials
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the quiz management page after login
      window.location.href = '/quiz-management';
    } catch (err) {
      // Make sure to handle the error here
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={signIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
