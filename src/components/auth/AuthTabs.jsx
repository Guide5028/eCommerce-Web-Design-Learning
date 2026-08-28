import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Tabs } from 'antd';

// Ported from legacy/js/app.js:1168-1243 (login / register page)

function LoginForm({ onSwitchToRegister }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [label, setLabel] = useState('Log In');
  const navigate = useNavigate();

  function handleFinish() {
    setSubmitting(true);
    setLabel('Logging in...');
    window.setTimeout(() => {
      setLabel('Logged in!');
      window.setTimeout(() => navigate('/'), 600);
    }, 600);
  }

  return (
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
      <Button type="primary" htmlType="submit" className="btn btn-primary auth-submit" disabled={submitting} block>
        {label}
      </Button>
      <p className="auth-switch-hint">
        Don&apos;t have an account?{' '}
        <button type="button" className="auth-switch-link" onClick={onSwitchToRegister}>Register</button>
      </p>
    </Form>
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
      <Button type="primary" htmlType="submit" className="btn btn-primary auth-submit" disabled={submitting} block>
        {submitting ? 'Creating account...' : 'Create Account'}
      </Button>
      <p className="auth-switch-hint">
        Already have an account?{' '}
        <button type="button" className="auth-switch-link" onClick={onSwitchToLogin}>Log In</button>
      </p>
    </Form>
  );
}

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState('login');

  const items = [
    { key: 'login', label: 'Login', children: <LoginForm onSwitchToRegister={() => setActiveTab('register')} /> },
    { key: 'register', label: 'Register', children: <RegisterForm onSwitchToLogin={() => setActiveTab('login')} /> },
  ];

  return (
    <section className="auth-section">
      <Tabs
        centered
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        className="auth-tabs-wrap"
      />
    </section>
  );
}
