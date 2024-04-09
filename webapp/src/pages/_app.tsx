// pages/quiz/_app.tsx
import React from 'react';
import '../styles/global.css'; // Import global.css
import { AppProps } from 'next/app'; // Import the type for AppProps
import { FirebaseProvider } from '../context/FirebaseContext';
import 'tailwindcss/tailwind.css';

// Type annotate the function parameter with AppProps
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <Component {...pageProps} />
    </FirebaseProvider>
  );
}

export default MyApp;