import { useDispatch, useSelector } from "react-redux";

import { 
    fetchProfile, 
    createProfile,
    updateProfile,
    setProfileData,
} from "../../store/slices/profileSlice";


const useProfile = () => {

    const dispatch = useDispatch()

    const { profile , loading, error, message } = useSelector(
        (state) => state.profile
    );

    // Get Profile data.
    const loadProfile = () => {
        dispatch(fetchProfile());
    };

    // Create profile.
    const handleCreateProfile = (data) => {
        return dispatch(createProfile(data));
    };


    // Update Prfofile.
    const handleUpdateProfile = (data) => {
        return dispatch(updateProfile(data));
    };


    const updateProfileField = (field, value) => {
        dispatch(setProfileData({ [field] : value}));
    };

  return {

    profile,
    loading,
    error,
    message,
    loadProfile,
    createProfile : handleCreateProfile,
    updateProfile : handleUpdateProfile,
    updateProfileField,

  };
};

export default useProfile