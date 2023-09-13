import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Navigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { selectName, selectEmail, selectPassword, selectAddress, setName, setEmail, setPassword, setAddress, isSending, registrationSuccessful, submitRegistrationForm } from './registrationFormSlice';


function RegistrationForm() {

  const name = useSelector(selectName);
  const address = useSelector(selectAddress);
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(submitRegistrationForm({
      name,
      address,
      email,
      password,
    }));

  };

  const formIsBeingSubmitted = useSelector(isSending);
  const successfulSubmission = useSelector(registrationSuccessful);

  if (successfulSubmission) {
    return <Navigate to="/auth/registrationSuccessful" />
  }

  return (
    <Form data-testid="auth--register" onSubmit={handleSubmit} >
      <Form.Group className="mb-3" controlId="formRegistrationName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          value={name}
          onChange={(e) => dispatch(setName(e.target.value))}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRegistrationEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRegistrationPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRegistrationAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={address}
          onChange={(e) => dispatch(setAddress(e.target.value))}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
}

export default RegistrationForm;
