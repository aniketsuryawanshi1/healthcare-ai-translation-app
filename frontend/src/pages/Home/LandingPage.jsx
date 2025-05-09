import { useEffect } from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { LoginOutlined, UserAddOutlined, SoundOutlined, GlobalOutlined } from '@ant-design/icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './style.css';
import { useNavigate } from 'react-router-dom';

import translateSVG from '../../assets/one.svg';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <Row className="hero-section" align="middle" justify="center">
        {/* Image - First on mobile, second on desktop */}
        <Col xs={{ span: 24, order: 1 }} md={{ span: 12, order: 2 }} data-aos="fade-left">
          <img src={translateSVG} alt="Healthcare Translation" className="hero-svg" />
        </Col>

        {/* Text - Second on mobile, first on desktop */}
        <Col xs={{ span: 24, order: 2 }} md={{ span: 12, order: 1 }} className="hero-content" data-aos="fade-right">
          <Title level={1} className="gradient-title">Breaking Language Barriers in Healthcare</Title>
          <Paragraph className="hero-description">
            Our web app enables real-time multilingual communication between patients and providers.
            With speech-to-text, AI-powered translation, and text-to-speech, we ensure accurate,
            efficient, and accessible conversations in medical settings.
          </Paragraph>
          <div className="hero-icons">
            <GlobalOutlined className="icon" />
            <SoundOutlined className="icon" />
          </div>
          <div className="auth-btns">
            <Button type="primary" icon={<LoginOutlined />} className="btn-login"  onClick={() => navigate('/login')}>Login</Button>
            <Button type="default" icon={<UserAddOutlined />} className="btn-register" onClick={() => navigate('/register')}>Register</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LandingPage;
