import React, { SetStateAction, useState } from 'react';
import './App.css';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';

const App = () => {
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState<string>('');

  const handleEmailInput = (e: { target: { value: SetStateAction<string> } }) => {
    setEmailInput(e.target.value);
  };
  const handlePasswordInput = (e: { target: { value: SetStateAction<string> } }) => {
    setPasswordInput(e.target.value);
  };
  const handleUsernameInput = (e: { target: { value: SetStateAction<string> } }) => {
    setUsernameInput(e.target.value);
  };

  const handleSubmit = async () => {
    const credentials = {
      email: emailInput,
      password: passwordInput,
      username: usernameInput,
    };

    // Send a POST request
    await axios
      .post('http://localhost:8080/auth/register', { ...credentials })
      .then(res => {
        const { status, data } = res;
        status === 200 && console.log('response', data);
      })
      .catch(err => {
        console.log('...error from axios post:', err);
      });
  };

  return (
    <Box className="App" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <TextField
        id="outlined-basic"
        multiline
        value={emailInput}
        onChange={handleEmailInput}
        label="Email"
        variant="outlined"
        maxRows={4}
        InputProps={{ sx: { color: 'white', border: '1px solid white', '& #outlined-basic': { borderColor: 'white' } } }}
        InputLabelProps={{ sx: { color: 'white' } }}
        sx={{ width: '30rem' }}
      />
      <TextField
        id="outlined-basic"
        multiline
        value={passwordInput}
        onChange={handlePasswordInput}
        label="Password"
        variant="outlined"
        maxRows={4}
        InputProps={{ sx: { color: 'white', border: '1px solid white', '& #outlined-basic': { borderColor: 'white' } } }}
        InputLabelProps={{ sx: { color: 'white' } }}
        sx={{ width: '30rem' }}
      />
      <TextField
        id="outlined-basic"
        multiline
        value={usernameInput}
        onChange={handleUsernameInput}
        label="Username"
        variant="outlined"
        maxRows={4}
        InputProps={{ sx: { color: 'white', border: '1px solid white', '& #outlined-basic': { borderColor: 'white' } } }}
        InputLabelProps={{ sx: { color: 'white' } }}
        sx={{ width: '30rem' }}
      />

      <Button onClick={handleSubmit}>Create</Button>
    </Box>
  );
};

export default App;
