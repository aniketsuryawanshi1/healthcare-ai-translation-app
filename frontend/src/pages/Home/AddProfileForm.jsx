import React, { useState, useEffect } from 'react';
import useProfile from '../../hooks/Authentication/useProfile';
import {useLanguages} from "../../hooks/Healthcare/index";

const AddProfileForm = () => {
  const { profile, loading, error, handleCreateProfile, handleUpdateProfile } = useProfile();
  const { languages, loading: languageLoading, error: languageError } = useLanguages();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: '',
    language: '',
    profile_image: null,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        gender: profile.gender || '',
        language: profile.language?.id || '',
        profile_image: null,
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profile_image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    if (profile) {
      handleUpdateProfile(formDataToSend);
    } else {
      handleCreateProfile(formDataToSend);
    }
  };

  return (
    <div>
      <h2>{profile ? 'Update Profile' : 'Create Profile'}</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        <div>
          <label>Language:</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            disabled={languageLoading}
            required
          >
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.language_name}
              </option>
            ))}
          </select>
          {languageError && <p style={{ color: 'red' }}>{languageError}</p>}
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" name="profile_image" onChange={handleFileChange} />
        </div>
        <button type="submit">{profile ? 'Update Profile' : 'Create Profile'}</button>
      </form>
    </div>
  );
};

export default AddProfileForm;