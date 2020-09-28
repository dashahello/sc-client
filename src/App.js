import React, { useState, useEffect } from 'react';
import post from './post';
import get from './get.js';

function Login({ setCurrentUser }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(evt) {
    evt.preventDefault();
    setLoading(true);
    const res = await post('/login', { username, password });
    setLoading(false);
    if (res.success) {
      setCurrentUser(res.user);
    } else {
      alert(res.message);
    }
  }

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={onSubmit}>
        <input
          value={username}
          onChange={(evt) => setUserName(evt.target.value)}
          type="text"
          placeholder="username"
        />
        <input
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          type="password"
          placeholder="password"
        />
        <button type="submit" disabled={loading}>
          log in
        </button>
      </form>
    </div>
  );
}

function Register() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(evt) {
    evt.preventDefault();
    setLoading(true);
    const res = await post('/register', { username, password });
    setLoading(false);
    if (res.success) {
      alert('registered');
    } else {
      alert(res.message);
    }
  }
  return (
    <div>
      <h3>Register</h3>
      <form onSubmit={onSubmit}>
        <input
          value={username}
          onChange={(evt) => setUserName(evt.target.value)}
          type="text"
          placeholder="username"
        />
        <input
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          type="password"
          placeholder="password"
        />
        <button type="submit" disabled={loading}>
          register
        </button>
      </form>
    </div>
  );
}

function Logout({ setCurrentUser }) {
  const [loading, setLoading] = useState(false);

  async function onLogoutClick() {
    setLoading(true);
    const res = await post('/logout');
    setLoading(false);
    if (res.success) {
      setCurrentUser(null);
    }
  }
  return (
    <button onClick={onLogoutClick} disabled={loading}>
      Log out
    </button>
  );
}

function LoggedInApp({ currentUser }) {
  return <div>Logged in {currentUser.username}</div>;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const user = await get('/currentUser');
      if (user.username) setCurrentUser(user);
      setCurrentUserLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>SC</h1>
      {currentUserLoading ? (
        <div>Loading...</div>
      ) : currentUser ? (
        <>
          <Logout setCurrentUser={setCurrentUser} />

          <LoggedInApp currentUser={currentUser} />
        </>
      ) : (
        <>
          <Login setCurrentUser={setCurrentUser} />
          <Register />
        </>
      )}
    </div>
  );
}

export default App;
