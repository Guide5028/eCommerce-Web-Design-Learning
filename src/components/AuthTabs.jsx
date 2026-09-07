import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Form, Input, Tabs, message } from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import styles from '../styles/components/AuthTabs.module.css';
import LargeFieldsTheme from './LargeFieldsTheme.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { register as apiRegister } from '../services/authService.js';

// Login/Register tabs, plus Google/Facebook links straight to the backend's OAuth routes.
const API_ORIGIN = import.meta.env.VITE_API_URL;

function SocialLoginButtons() {
  return (
    <>
      <Divider className={styles.authDivider}>or continue with</Divider>
      <div className={styles.socialButtons}>
        <Button
          icon={<GoogleOutlined />}
          block
          href={`${API_ORIGIN}/auth/google`}
        >
          Google
        </Button>
        <Button
          icon={<FacebookOutlined />}
          block
          href={`${API_ORIGIN}/auth/facebook`}
        >
          Facebook
        </Button>
      </div>
    </>
  );
}

function LoginForm({ onSwitchToRegister }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [label, setLabel] = useState('Log In');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleFinish({ email, password }) {
    setSubmitting(true);
    setLabel('Logging in...');
    try {
      const profile = await login(email, password);
      setLabel('Logged in!');
      message.success(`Welcome back, ${profile.name}`);
      window.setTimeout(() => navigate('/'), 600); // give the "Logged in!" label a beat to show
    } catch (err) {
      message.error(err.message);
      setLabel('Log In');
      setSubmitting(false);
    }
  }

  return (
    <LargeFieldsTheme>
      <Form form={form} layout="vertical" className="auth-form" requiredMark={false} onFinish={handleFinish}>
        <Form.Item label="Email address" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="Abc@def.com" disabled={submitting} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
        >
          <Input.Password placeholder="Enter your password" disabled={submitting} />
        </Form.Item>
        <Button type="primary" htmlType="submit" className={styles.authSubmit} disabled={submitting} block>
          {label}
        </Button>
        <p className={styles.authSwitchHint}>
          Don&apos;t have an account?{' '}
          <button type="button" className={styles.authSwitchLink} onClick={onSwitchToRegister}>Register</button>
        </p>
      </Form>
      <SocialLoginButtons />
    </LargeFieldsTheme>
  );
}

function RegisterForm({ onSwitchToLogin }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  async function handleFinish({ name, email, password }) {
    setSubmitting(true);
    try {
      await apiRegister(email, password, name);
      message.success('Account created — log in to continue.');
      form.resetFields();
      onSwitchToLogin();
    } catch (err) {
      // e.g. "Email already registered" -- pos-api's own message, shown as-is
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LargeFieldsTheme>
      <Form form={form} layout="vertical" className="auth-form" requiredMark={false} onFinish={handleFinish}>
        <Form.Item label="Full name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Abc" disabled={submitting} />
        </Form.Item>
        <Form.Item label="Email address" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="Abc@def.com" disabled={submitting} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
        >
          <Input.Password placeholder="At least 6 characters" disabled={submitting} />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, min: 6, message: 'Password must be at least 6 characters' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Re-enter your password" disabled={submitting} />
        </Form.Item>
        <Button type="primary" htmlType="submit" className={styles.authSubmit} disabled={submitting} block>
          {submitting ? 'Creating account...' : 'Create Account'}
        </Button>
        <p className={styles.authSwitchHint}>
          Already have an account?{' '}
          <button type="button" className={styles.authSwitchLink} onClick={onSwitchToLogin}>Log In</button>
        </p>
      </Form>
      <SocialLoginButtons />
    </LargeFieldsTheme>
  );
}

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState('login');

  const items = [
    { key: 'login', label: 'Login', children: <LoginForm onSwitchToRegister={() => setActiveTab('register')} /> },
    { key: 'register', label: 'Register', children: <RegisterForm onSwitchToLogin={() => setActiveTab('login')} /> },
  ];

  return (
    <section className={styles.authSection}>
      <Tabs
        centered
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </section>
  );
}
