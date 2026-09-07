import { useState } from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import FeaturesBar from '../components/FeaturesBar.jsx';
import PageHero from '../components/PageHero.jsx';
import LargeFieldsTheme from '../components/LargeFieldsTheme.jsx';

// Contact page: info blocks plus a contact form with a transient success state.

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
      <PageHero title="Contact" />

      <section className="contact-section">
        <div className="contact-intro">
          <h2>Get In Touch With Us</h2>
          <p>
            For more information about our product &amp; services, please feel free to drop us an email. Our staff
            will always be there to help you out. Do not hesitate!
          </p>
        </div>

        <div className="contact-info">
          <Row gutter={[24, 24]}>
            {CONTACT_INFO.map((item) => (
              <Col xs={24} sm={12} md={8} key={item.title}>
                <div className="contact-info-item">
                  <span className="contact-icon" aria-hidden="true">{item.icon}</span>
                  <div className="contact-info-text">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <LargeFieldsTheme>
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

            <Button type="primary" htmlType="submit" className="contact-submit" disabled={submitting}>
              {submitting ? 'Message sent!' : 'Submit'}
            </Button>
          </Form>
        </LargeFieldsTheme>
      </section>

      <FeaturesBar />
    </main>
  );
}
