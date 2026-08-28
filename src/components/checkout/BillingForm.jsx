import { Form, Input, Select } from 'antd';

// Ported from legacy/checkout_page.html billing-form fields.

export default function BillingForm() {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" className="billing-form" requiredMark={false}>
      <h2>Billing details</h2>

      <div className="form-row">
        <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </div>

      <Form.Item label="Company Name (Optional)" name="companyName">
        <Input />
      </Form.Item>

      <Form.Item label="Country / Region" name="country" initialValue="Sri Lanka">
        <Select
          options={['Sri Lanka', 'Thailand', 'United States', 'United Kingdom'].map((c) => ({ value: c, label: c }))}
        />
      </Form.Item>

      <Form.Item label="Street address" name="streetAddress" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Town / City" name="townCity" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Province" name="province" initialValue="Western Province">
        <Select
          options={['Western Province', 'Central Province', 'Southern Province'].map((p) => ({ value: p, label: p }))}
        />
      </Form.Item>

      <Form.Item label="ZIP code" name="zipCode" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Email address" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>

      <Form.Item label={<span className="sr-only">Additional information</span>} name="additionalInfo">
        <Input.TextArea rows={4} placeholder="Additional information" />
      </Form.Item>
    </Form>
  );
}
