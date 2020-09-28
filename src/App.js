import React, { useState } from 'react';
import post from './post';

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(evt) {
    evt.preventDefault();
    console.log(`Name: ${username}, password: ${password}`);

    const res = await post('/login', { username, password });
    console.log(res);
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
        <button type="submit">log in</button>
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
      alert('username is already taken');
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
        <button type="submit">register</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>SC</h1>
      <Login />
      <Register />
    </div>
  );
}

export default App;
