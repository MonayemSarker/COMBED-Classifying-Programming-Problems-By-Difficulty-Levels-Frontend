import { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Basic login logic (this would normally involve some API call)
    if (username === 'user' && password === 'pass') {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect username or password');
    }
  };

  return (
    <div>
      <Header />
      <main>{isLoggedIn ? <HomePage /> : <Login onLogin={handleLogin} />}
      </main>
    </div>
  );
}

export default App;
