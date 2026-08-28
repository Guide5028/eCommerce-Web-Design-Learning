import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';

// Ported from legacy/js/app.js:581-606 (contact form submit -> transient success state)

const CONTACT_INFO = [
  {
    icon: <EnvironmentOutlined />,
    title: 'Address',
    text: (
      <>
        400 University Drive Suite 200 Coral Gables,
        <br />
        FL 33134 USA
      </>
    ),
  },
  {
    icon: <PhoneOutlined />,
    title: 'Phone',
    text: (
      <>
        Mobile: +(84) 546-6789
        <br />
        Hotline: +(84) 456-6789
      </>
    ),
  },
  {
    icon: <ClockCircleOutlined />,
    title: 'Working Time',
    text: (
      <>
        Monday-Friday: 9:00 - 22:00
        <br />
        Saturday-Sunday: 9:00 - 21:00
      </>
    ),
  },
];

export default function ContactPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  function handleFinish() {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      form.resetFields();
    }, 1500);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-content">
          <img src="/images/logo-furniro.svg" alt="" className="page-hero-icon" />
          <h1>Contact</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <span aria-current="page">Contact</span>
          </nav>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-intro">
          <h2>Get In Touch With Us</h2>
          <p>
            For more information about our product &amp; services, please feel free to drop us an email. Our staff
            will always be there to help you out. Do not hesitate!
          </p>
        </div>

        <div className="contact-info">
          {CONTACT_INFO.map((item) => (
            <div className="contact-info-item" key={item.title}>
              <span className="contact-icon" aria-hidden="true">{item.icon}</span>
              <div className="contact-info-text">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Form form={form} layout="vertical" className="contact-form" requiredMark={false} onFinish={handleFinish}>
          <div className="form-row">
            <Form.Item label="Your name" name="name" rules={[{ required: true }]}>
              <Input placeholder="Abc" disabled={submitting} />
            </Form.Item>
            <Form.Item label="Email address" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Abc@def.com" disabled={submitting} />
            </Form.Item>
          </div>

          <Form.Item label="Subject" name="subject">
            <Input placeholder="This is an optional" disabled={submitting} />
          </Form.Item>

          <Form.Item label="Message" name="message" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="Hi! I'd like to ask about" disabled={submitting} />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="btn btn-primary contact-submit" disabled={submitting}>
            {submitting ? 'Message sent!' : 'Submit'}
          </Button>
        </Form>
      </section>

      <FeaturesBar />
    </main>
  );
}
