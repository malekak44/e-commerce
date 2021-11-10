import React, { useState } from 'react';
const url = 'http://localhost:5000'

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      const user = { email, password };

      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        setEmail('');
        setPassword('');
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h4>login form</h4>
      <div className='form-row'>
        <label htmlFor='email' className='form-label'>
          Email
        </label>
        <input
          type='email'
          className='form-input email-input'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='form-row'>
        <label htmlFor='password' className='form-label'>
          Password
        </label>
        <input
          type='password'
          name='password'
          className='form-input password-input'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type='submit' className='btn btn-block submit-btn'>
        submit
      </button>
    </form>
  )
}