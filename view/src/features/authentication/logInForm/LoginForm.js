import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Navigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { selectEmail, selectPassword, setEmail, setPassword, /* isSending, */ submitLoginForm } from './loginFormSlice';
import { selectLoginState } from '../../../features/authentication/session/sessionSlice';

function LoginForm() {
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  const loggedIn = useSelector(selectLoginState);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(submitLoginForm({
      email,
      password,
    }));

  };

  //TODO: use this variable for something...
  // const formIsBeingSubmitted = useSelector(isSending);

  if (loggedIn) {
    return <Navigate to="/my/account" />
  }

  return (
    <Form data-testid="auth--login" onSubmit={handleSubmit} >
      <Form.Group className="mb-3" controlId="formLoginEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formLoginPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Log In
      </Button>
    </Form>
  );
}

export default LoginForm;
