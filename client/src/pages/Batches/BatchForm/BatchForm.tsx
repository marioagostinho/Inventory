import React, { Component, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Form from 'react-bootstrap/esm/Form';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/esm/Button';
import DatePicker from 'react-datepicker';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';
import ProductService from '../../../services/ProductService';
import NotFound from '../../NotFound/NotFound';
import BatchService from '../../../services/BatchService';
import moment from 'moment';
import { Card } from 'react-bootstrap';

interface Form {
    productId: number,
    quantity: number,
    expirationDate: Date,
    type: string,
    comment: string
}

interface BatchFormState {
    products: any[];
    form: Form;
}

interface BatchFormProps {
    id: any;
}

class BatchFormComponent extends Component<BatchFormProps, BatchFormState> {
    private productService: ProductService;
    private BatchService: BatchService;

    private form: Form;
    
    constructor(props: BatchFormProps) {
        super(props);

        this.state = {
            products: [],
            form: {
                productId: 1,
                quantity: 0,
                expirationDate: new Date || null,
                type: '',
                comment: ''
            }
        };

        this.form = {
            productId: 1,
            quantity: 0,
            expirationDate: new Date || null,
            type: '',
            comment: ''
        }

        this.productService = new ProductService();
        this.BatchService = new BatchService();
    }

    componentDidMount() {
        this.fetchProducts();
        this.fetchBatchById(this.props.id);
    }

    private fetchProducts = () => {
        this.productService.GetProducts()
            .then((data) => {
                if(data && data.products) {
                    this.setState({
                        products: data.products
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    private fetchBatchById = (id: number) => {
        this.BatchService.GetBatcById(id)
            .then((data) => {
                if(data && data.batches) {
                    this.form = {
                        productId: data.batches[0].product.id,
                        quantity: data.batches[0].quantity,
                        expirationDate: moment(data.batches[0].expirationDate).toDate(),
                        type: '',
                        comment: ''
                    }

                    this.setState({
                        form: this.form
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.form.productId = parseInt(event.target.value);
        this.setState({
            form: this.form
        });
    };

    handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numericInput = event.target.value.replace(/[^0-9]/g, '');
        this.form.quantity = parseInt(numericInput);

        this.setState({
            form: this.form
        });
    };

    handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.form.type = event.target.value;

        this.setState({
            form: this.form
        });
    };

    handleDateChange = (date: Date) => {
        this.form.expirationDate = date;

        this.setState({
            form: this.form
        });
    };

    handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.form.comment = event.target.value;

        this.setState({
            form: this.form
        });
    };

    render() {
        
        return (
            <div className="batch-content">
                <ContentTitle
                    Title={`Edit Batch #${this.props.id}`} />
                
                <Form>
                    <Card>
                        <Card.Body>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Product</Form.Label>
                                <Form.Select 
                                    onChange={this.handleProductChange}
                                    value={this.form.productId}>
                                    <option key='0' value='' disabled>Choose product...</option>
                                    {
                                        this.state.products.map((product: any) => {
                                            return <option key={product.id} value={product.id}>{product.name}</option>
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control 
                                    placeholder="Ex: 100"
                                    onChange={this.handleQuantityChange}
                                    value={this.form.quantity}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Expiration Date</Form.Label>
                                <DatePicker
                                    selected={this.form.expirationDate}
                                    onChange={this.handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Ex: 31/02/2012"
                                    className="form-control"
                                    popperPlacement="bottom-end"
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Reason</Form.Label>
                                <Form.Select 
                                    onChange={this.handleReasonChange}
                                    value={this.form.type}>
                                    <option key="" value="">Choose a reason...</option>
                                    <option key="Defect" value="Defect">Defect</option>
                                    <option key="Lost" value="Lost">Lost</option>
                                    <option key="Other" value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    style={{ height: '200px' }}
                                    onChange={this.handleCommentChange}
                                    value={this.form.comment} />
                            </Form.Group>
                        </Row>

                        </Card.Body>

                        <Card.Footer className="text-muted">
                            <div className="form-actions">
                                <Button variant="danger" type="button" href="/Batches">
                                    Cancel
                                </Button>
                                <Button variant="success" type="submit">
                                    Add
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </Form>
            </div>
        );
    }
}

function BatchForm() {
    const params = useParams<{ batchId?: string }>();
    const batchId = parseInt(params.batchId || '0');

    if(batchId === 0)
    {
        return <NotFound />
    }

    return <BatchFormComponent id={batchId}/>
}

export default BatchForm;