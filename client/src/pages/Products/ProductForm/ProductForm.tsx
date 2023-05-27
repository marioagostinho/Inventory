import React from 'react';

import Card from 'react-bootstrap/esm/Card';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';

import './ProductForm.css';

interface ProductFormProps {
    CancelClick?: () => void;
}

export default function ProductForm({CancelClick}:ProductFormProps) {

    //Handle cancel click using it's parent click function
    const handleCancelClick = () => {
        if(CancelClick)
        {
            CancelClick();
        }
    }
    
    return (
        <div>
            <Card>
                <Card.Header>
                    New Product
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formGridAddress1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder="Ex: Rice" />
                        </Form.Group>

                        <div className='form-button'>
                            <Button variant="success" type="submit">
                                Add
                            </Button>
                            <Button variant="danger"
                                onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}