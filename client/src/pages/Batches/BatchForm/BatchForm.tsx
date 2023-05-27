import React from "react";

import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';

import './BatchForm.css';

export default function BatchForm() {
    const params = useParams();
    const batchId = parseInt(params.batchId || '0');

    const [selectedDate, setSelectedDate] = React.useState(null);

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    return (
        <div className="batch-content">
            <div className='content-header'>
                <div className='header-left'>
                    <h1>Batch</h1>
                </div>
            </div>
            <hr />
            
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

                <div className="form-actions">
                    <Button variant="danger" type="button" href='/Batches'>
                        Cancel
                    </Button>
                    <Button variant="success" type="submit">
                        Add
                    </Button>
                    
                </div>
            </Form>
        </div>
    );
}