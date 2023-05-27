import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import Form from 'react-bootstrap/esm/Form';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/esm/Button';
import DatePicker from 'react-datepicker';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';

import './OrderForm.css';

export default function OrderForm() {
    const params = useParams();
    const orderId = parseInt(params.orderId || '0');

    //DatePicker state and function
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    return (
        <div className='order-content'>
            <ContentTitle
                Title={'New Order'} />
            
            <Form>
                <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Product</Form.Label>
                        <Form.Select defaultValue="Choose...">
                            <option>Choose a product...</option>
                            <option>...</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control placeholder="Ex: 100" />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Expiration Date</Form.Label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Ex: 31/02/2012"
                            className="form-control"
                            popperPlacement="bottom-end"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control 
                            as="textarea"
                            style={{ height: '200px' }} />
                    </Form.Group>
                </Row>

                <div className="form-actions">
                    <Button variant="danger" type="button" href='/Orders'>
                        Cancel
                    </Button>
                    <Button variant="success" type="submit">
                        Add
                    </Button>
                </div>
            </Form>
        </div>
    )
}