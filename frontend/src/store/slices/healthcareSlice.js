import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../utils/api-handler';

// create async think for fetching languages dropdown options
export const fetchLanguages = createAsyncThunk(
  'healthcare/fetchLanguages',
  async (_, {rejectWithValue}) => {
    try {
        const response = await AxiosInstance.get('languages/');
        return response.data;
    } catch (err) {
      const error = err.response ? err.response.data : "Error fetching languages";
      return rejectWithValue(error);
    }
  } 
);


// Translation session form submission.
export const submitTranslationSession = createAsyncThunk(
  'healthcare/submitTranslationSession',
  async (formData, {rejectWithValue}) => {
    try {
      const response = await AxiosInstance.post('translation-sessions/', formData);
      return response.data;
    } catch (err) {
      const error = err.response ? err.response.data : "Error submitting translation session.";
      return rejectWithValue(error);
    }
  }
);


// Getting the list of translation sessions.
export const fetchTranslationSessions = createAsyncThunk(
  'healthcare/fetchTranslationSessions',
  async (_, {rejectWithValue}) => {
    try {
      const response = await AxiosInstance.get('translation-sessions/');
      return response.data;
    } catch (err) {
      const error = err.response ? err.response.data : "Error fetching translation sessions.";
      return rejectWithValue(error);
    }
  }
);

const healthcareSlice = createSlice({
    name: 'healthcare',
    initialState: {
        languages_dropdown: {
            language: [],
        },
        formData : {
            patient: "",
            provider : "",
            orignal_language: "",
            translated_language: "",
            original_text: "",
            translated_text: "",
            transcription_error: "",
        },
        data: {
            patient: "",
            provider : "",
            orignal_language: "",
            translated_language: "",
            original_text: "",
            translated_text: "",
            transcription_error: "",
        },    
    loading: false,
    error: null,
    message: "",
    },
    reducers: {
        setFormData : (state, action) => {
            state.formData = {...state.formData, ...action.payload};
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchLanguages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLanguages.fulfilled, (state, action) => {
                state.loading = false;
                state.languages_dropdown.language = action.payload;
            })
            .addCase(fetchLanguages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error fetching languages";
            })
            .addCase(submitTranslationSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitTranslationSession.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.data = action.payload.data;
            })
            .addCase(submitTranslationSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error submitting translation session.";
            })
            .addCase(fetchTranslationSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTranslationSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTranslationSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error fetching translation sessions.";
            });

    },
});

export const { setFormData } = healthcareSlice.actions;
export default healthcareSlice.reducer;