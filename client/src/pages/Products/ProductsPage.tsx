import React, { useState } from 'react'

import './ProductsPage.css';
import ItemList from '../../components/ItemList/ItemList';
import { Button, Card, Collapse, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { redirect } from 'react-router-dom';

export default function Products() {
    const [open, setOpen] = useState(false);

    const Header: String[] = [
        'Name',
        'Quantity'
    ];

    const Items: any[] = [
        {'id': 1, 'name': 'Rice', 'quantity': 1000},
        {'id': 2, 'name': 'Lettuce', 'quantity': 100},
        {'id': 3, 'name': 'Tomato', 'quantity': 500},
        {'id': 4, 'name': 'Pasta', 'quantity': 750}
    ];

    const EditClick =  (id: any) => {
        setOpen(true);
    }

    return (
        <div className='products-content'>
            
            <div className='content-header'>
                <div className='header-left'>
                    <h1>Products</h1>
                </div>
                <div className='header-right'>
                    {/* To open and close the Product Form */}
                    <Button variant="success"
                        onClick={() => setOpen(!open)}
                        aria-controls="collapse-product"
                        aria-expanded={open}
                    >
                        {
                            open === false &&
                            <FontAwesomeIcon icon={faPlus} />
                        }
                        {
                            open === true &&
                            <FontAwesomeIcon icon={faMinus} />
                        }
                        Add
                    </Button>
                </div>
            </div>
            <hr />

            {/* Product Form */}
            <div className='product-item'>
                <Collapse in={open}>
                    <div id="collapse-product">
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
                                            onClick={() => setOpen(!open)}
                                            aria-controls="collapse-product"
                                            aria-expanded={open}>
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </Collapse>
            </div>

            {/* Products Table */}
            <ItemList
                CanAction={true}
                Header={Header} 
                Items={Items}
                EditClick={EditClick}
            />
        </div>
    );
}