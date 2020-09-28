import React, { useState, useEffect } from 'react';
import post from './post';
import get from './get.js';
import CryptoJS from 'crypto-js';

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

function MessageForm() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');

  async function onMessageSubmit(evt) {
    evt.preventDefault();
    const res = await post('/message', {
      message: CryptoJS.AES.encrypt(message, key).toString()
    });
    setMessage('');
  }

  return (
    <form onSubmit={onMessageSubmit}>
      <input
        type="text"
        placeholder="message"
        onChange={(evt) => setMessage(evt.target.value)}
        value={message}
      />
      <input
        type="text"
        placeholder="key"
        onChange={(evt) => setKey(evt.target.value)}
        value={key}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function getTimeString(timestamp) {
  const time = new Date(timestamp);

  return (
    `${(time.getMonth() + 1)
      .toString()
      .padStart(2, '0')} ${time.getDate().toString().padStart(2, '0')}` +
    ` @ ${time
      .getHours()
      .toString()
      .padStart(2, '0')}:${time
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`
  );
}

function Message({ message, decryptionKey }) {
  // console.log(message.message);

  const [decryptedMessage, setDecryptedMessage] = useState(null);

  useEffect(() => {
    try {
      var code = CryptoJS.AES.decrypt(message.message, decryptionKey);
      console.log(code);
      const msg = code.toString(CryptoJS.enc.Utf8);
      setDecryptedMessage(msg);
    } catch (err) {}
  }, [decryptionKey]);

  // const decryptedMessage = 'asd';

  return decryptedMessage ? (
    <div>
      <div>
        {getTimeString(message.timestamp)} from: {message.username}
      </div>
      <div>{decryptedMessage}</div>
    </div>
  ) : null;
}

function Messages() {
  const [messages, setMessages] = useState([]);
  const [key, setKey] = useState('');

  useEffect(() => {
    async function getMessages() {
      const res = await get('/message');
      if (res.success) setMessages(res.messages);
    }
    getMessages();

    const interval = setInterval(getMessages, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h4>Messages</h4>
      <input
        type="text"
        placeholder="key"
        value={key}
        onChange={(evt) => setKey(evt.target.value)}
      />
      {messages.map((message) => (
        <Message key={message._id} message={message} decryptionKey={key} />
      ))}
    </div>
  );
}

function LoggedInApp({ currentUser }) {
  return (
    <div>
      <div>Logged in {currentUser.username}</div>
      <Messages />
      <MessageForm />
    </div>
  );
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
