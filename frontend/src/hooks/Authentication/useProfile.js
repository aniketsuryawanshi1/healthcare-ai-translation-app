import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, createProfile, updateProfile } from '../../store/slices/profileSlice';

const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile || {});
  

  // Fetch the profile on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Create a new profile
  const handleCreateProfile = (profileData) => {
    dispatch(createProfile(profileData));
  };

  // Update the existing profile
  const handleUpdateProfile = (profileData) => {
    dispatch(updateProfile(profileData));
  };

  return { profile, loading, error, handleCreateProfile, handleUpdateProfile };
};

export default useProfile;