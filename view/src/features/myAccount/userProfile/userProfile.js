import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserProfile, selectUserProfile, isLoading } from './userProfileSlice';
import { selectUserId } from '../../authentication/session/sessionSlice';

function UserProfile() {
  const userId = useSelector(selectUserId);
  const userProfile = useSelector(selectUserProfile);
  const profileIsLoading = useSelector(isLoading);
  const dispatch = useDispatch();

  console.log(userProfile);

  useEffect(() => {
    if (userId) {
      dispatch(loadUserProfile(userId));
    }
  },[dispatch,userId]);

  const output = (data) => (
    <div data-testid="my-account--user-profile">
      { data }
    </div>
  )

  if (profileIsLoading) {
    const message = <p>User Profile Is Loading</p>
    return output(message)
  } else {
    const message = (
      <div>
        <p>Welcome {userProfile.name}</p>
      </div>
    )
    return output(message)
  }
}

export default UserProfile;