import React, { useEffect, useState } from 'react';
import Home from '../components/home.jsx';

export default function HomePage() {
  const [ , setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  return (
    <main style={{ flex: 1, padding: '20px' }}>
      <Home />
    </main>
  );
}
