// import React, { useEffect, useState } from 'react';

// import {
//   UserOutlined,
//   PhoneOutlined,
//   ManOutlined,
//   WomanOutlined,
// } from '@ant-design/icons';
// import {Form} from "antd";
// import {InputField, CustomButton} from "../components/CreateProfileModal";
// import { setProfileData, createProfile, updateProfile, fetchProfile } from '../store/slices/profileSlice';
// import { useDispatch,useSelector } from 'react-redux';

// const CreateProfileModal = () => {

//   const dispatch = useDispatch();
//   const [form] = Form.useForm();

//   const { profile , loading, error, message } = useSelector(
//     (state) => state.profile
// );

//   const handleChange = (name, value) => {
//     dispatch(setProfileData({[name]: value} ));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDeffault();

//     const result = await dispatch(createProfile(profile));
//     console.log("form submit result : ", result)
//   };

//   return (
//     <>
//     <Form 
//     form={form}
//     layoout="vertical"
//     onFinish={handleSubmit}>

//     <InputField 
//     name="first_name"
//     label="First Name"
//     placeholder="Enter First Name"
//     type="text"
//     prefixIcon={<UserOutlined />}
//     rules={
//       [
//         {
//           required: true,
//           message:"please enter your first name."
//         }
//       ]
//     }
//     onChange={(value) => handleChange("year", value)}

//     />
//         <InputField 
//     name="first_name"
//     label="First Name"
//     placeholder="Enter First Name"
//     type="text"
//     prefixIcon={<UserOutlined />}
//     rules={
//       [
//         {
//           required: true,
//           message:"please enter your first name."
//         }
//       ]
//     }
//     />
//     </Form>

//     </>
//   );
// };

// export default CreateProfileModal;


import React from 'react'

const CreateProfileModal = () => {
  return (
    <div>CreateProfileModal</div>
  )
}

export default CreateProfileModal