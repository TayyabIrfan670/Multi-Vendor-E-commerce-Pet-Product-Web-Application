import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

interface OrderFormProps {
  onSubmit: (orderData: OrderData) => void;
  isLoading: boolean;
}

export interface OrderData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'cod' | 'card';
  additionalNotes?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<OrderData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
    additionalNotes: ''
  });

  const [validated, setValidated] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter your full name.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid email address.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter your phone number.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Delivery Address</Form.Label>
        <Form.Control
          as="textarea"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter your delivery address.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter your city.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Postal Code</Form.Label>
        <Form.Control
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter your postal code.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Payment Method</Form.Label>
        <Form.Select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="cod">Cash on Delivery</option>
          <option value="card">Credit/Debit Card</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Additional Notes (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
        />
      </Form.Group>

      <Button 
        type="submit" 
        variant="primary" 
        className="w-100"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Place Order'}
      </Button>
    </Form>
  );
};

export default OrderForm; 