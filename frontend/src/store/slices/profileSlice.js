import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../utils/api-handler";

// Featch Profile.
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',

  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get('profile/');
      return response.data;
    }
    catch (error){
      const err = error.response ? error.response.data : "Server is not connected."
      return rejectWithValue(err);
    }
  }
);

// Create Profile.

export const createProfile = createAsyncThunk(
  'profile/createProfile', 

  async (profileData, { rejectWithValue }) => {
    
    try {

      const response = await AxiosInstance.post('profile/',profileData )
      return response.data;
      
    } catch (error) {
      const err = error.response ? error.response.data : "Server is not connected."
      return rejectWithValue(err);
    }

  }
);


// Update Profile.

export const updateProfile = createAsyncThunk(
  'profilr/updateProfile', 

  async (profileData, { rejectWithValue}) => {

    try {
      
      const response = await AxiosInstance.patch('profile/', profileData)

      return response.data;

    } catch (error) {
      
      const err = error.response ? error.response.data : "Server is not connected."
      return rejectWithValue(err)

    }

  }

);


const profileSlice = createSlice({

  name : 'profile', 

  initialState : {
    profile : {

      user : null,
      is_patient : false,
      is_doctor : false,
      first_name : '',
      last_name : '',
      phone_number : '',
      profile_image : null,
      gender : '',
      language : null,

    },

    loading: false,
    error : null,
    message : '',
  },

  reducers : {
    setProfileData: (state, action ) => {
      state.profile = {...state.profile, ...action.payload};
    },
  },

  extraReducers: (builder) => {

    builder

    // Fetch Profile.
    .addCase(fetchProfile.pending, (state) => {

      state.loading = true;
      state.error = null;

    })
    
    .addCase(fetchProfile.fullfilled, (state, action) => {

      state.loading = false;
      state.error = action.payload || 'Failed to fetch profile.';

    })

    // Create profile.
    .addCase(createProfile.pending, (state) => {

      state.loading = true;
      state.error = null;

    })

    .addCase(createProfile.fulfilled, (state, action) => {

      state.loading = false;
      state.profile = action.payload.profile;
      state.message = 'Profile Created Successfully.';

    })

    .addCase(createProfile.rejected, (state, action) => {
      
      state.loading = false;
      state.error = action.payload || 'Failde to create profile.';

    })

    // Update Profile.
    .addCase(updateProfile.pending, (state) => {
      
      state.loading = true;
      state.error = null;

    })

    .addCase(updateProfile.fulfilled, (state, action) => {

      state.loading = false;
      state.profile = action.payload.profile;
      state.message = 'Profile updated successfully.';

    })

    .addCase(updateProfile.rejected, (state, action) => {

      state.loading = false;
      state.error = action.payload || 'Failed to update profile.';

    });
  },

});

export const { setProfileData } = profileSlice.actions;
export default profileSlice.reducer;