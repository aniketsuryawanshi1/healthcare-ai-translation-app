import { useState } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  Select,
  Upload,
  Row,
  Col,
  Typography,
  Image,
  Avatar,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  ManOutlined,
  WomanOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { first, second, third, forth, fifth } from "../../assets/index";
import "./ProfileForm.css";

const { Title } = Typography;
const { Option } = Select;

const dummyImages = [first, second, third, forth, fifth];

const ProfileForm = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileList, setFileList] = useState([]);

  const handleNext = () => {
    form.validateFields().then((values) => {
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
      form.resetFields();
    });
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    form.setFieldsValue(formData);
  };

  const handleSkip = () => setCurrentStep(currentStep + 1);

  const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleSubmit = () => {
    console.log("Final Profile Data:", { ...formData, profile_image: fileList[0] });
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  const renderFormFields = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "Please enter your first name" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter First Name" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Please enter your last name" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter Last Name" />
            </Form.Item>
          </>
        );
      case 1:
        return (
          <>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter Phone Number" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Select gender" }]}
            >
              <Radio.Group>
                <Radio value="M">
                  <ManOutlined /> Male
                </Radio>
                <Radio value="F">
                  <WomanOutlined /> Female
                </Radio>
                <Radio value="O">Other</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        );
      case 2:
        return (
          <>
            <Form.Item
              name="language"
              label="Language Preference"
              rules={[{ required: true, message: "Select language" }]}
            >
              <Select placeholder="Select language">
                <Option value="en">English</Option>
                <Option value="hi">Hindi</Option>
                <Option value="es">Spanish</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="is_patient"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject("Confirm patient status"),
                },
              ]}
            >
              <Checkbox>I confirm that I am a patient</Checkbox>
            </Form.Item>
          </>
        );
      case 3:
        return (
          <Form.Item name="profile_image" label="Upload Profile Picture">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        );
      case 4:
        return (
          <div>
            <Title level={4}>Profile Preview</Title>
            <Row gutter={16} align="middle">
              <Col span={8} style={{ textAlign: "center" }}>
                {fileList.length > 0 ? (
                  <Image
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    width={120}
                    height={120}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <Avatar size={120} style={{ backgroundColor: "#1890ff" }}>
                    {getInitials(formData.first_name, formData.last_name)}
                  </Avatar>
                )}
              </Col>
              <Col span={16}>
                <p><strong>First Name:</strong> {formData.first_name}</p>
                <p><strong>Last Name:</strong> {formData.last_name}</p>
                <p><strong>Phone:</strong> {formData.phone_number}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>Language:</strong> {formData.language}</p>
                <p><strong>Patient:</strong> {formData.is_patient ? "Yes" : "No"}</p>
              </Col>
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: "900px",
        height: "464px", 
        background: "linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Row style={{ height: "100%" }}>
        <Col span={12}>
          <Image
            src={dummyImages[currentStep]}
            width="100%"
            height="100%"
            preview={false}
          />
        </Col>
        <Col span={12} style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
          <Title level={3} style={{ marginBottom: "16px", textAlign: "center" }}>
            User Profile Form
          </Title>
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 16 }}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              {renderFormFields()}
            </Form>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #eee",
              paddingTop: 16,
              marginTop: "auto",
            }}
          >
            {currentStep > 0 && (
              <Button onClick={handleBack}>Back</Button>
            )}
            {currentStep < 3 && (
              <Button type="primary" onClick={handleNext}>Next</Button>
            )}
            {currentStep === 3 && (
              fileList.length > 0 ? (
                <Button type="primary" onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSkip}>Skip</Button>
              )
            )}
            {currentStep === 4 && (
              <Button type="primary" onClick={handleSubmit}>Create Profile</Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileForm;