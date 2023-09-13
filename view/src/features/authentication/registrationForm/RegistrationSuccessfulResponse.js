import React, { useEffect }  from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { selectLoginState } from '../../../features/authentication/session/sessionSlice';
import { resetForm } from './registrationFormSlice';

function RegistrationSuccessfulResponse() {

  const loggedIn = useSelector(selectLoginState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetForm());
  },[dispatch]);

  return (
    <div data-testid="auth--registration-successful">Registration Successful</div>
  );
}

export default RegistrationSuccessfulResponse;
