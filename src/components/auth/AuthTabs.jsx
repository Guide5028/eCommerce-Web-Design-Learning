import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Tabs, message } from 'antd';
import styles from '../../styles/components/auth/AuthTabs.module.css';
import LargeFieldsTheme from '../common/LargeFieldsTheme.jsx';
import { login } from '../../lib/authApi.js';
import { tokens } from '../../lib/tokens.js';

// Ported from legacy/js/app.js:1168-1243 (login / register page).
// LoginForm now hits the real pos-api backend (see lib/authApi.js) -- RegisterForm
// below is still the original fake simulation, out of scope for this pass since
// registering a real employee would mean matching pos-api's own register schema.

function LoginForm({ onSwitchToRegister }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [label, setLabel] = useState('Log In');
  const navigate = useNavigate();

  async function handleFinish({ email, password }) {
    setSubmitting(true);
    setLabel('Logging in...');
    try {
      const { accessToken, refreshToken, profile } = await login(email, password);
      tokens.set(accessToken, refreshToken);
      setLabel('Logged in!');
      message.success(`Welcome back, ${profile.name}`);
      window.setTimeout(() => navigate('/'), 600);
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
    </LargeFieldsTheme>
  );
}

function RegisterForm({ onSwitchToLogin }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  function handleFinish() {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      form.resetFields();
      onSwitchToLogin();
    }, 800);
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
