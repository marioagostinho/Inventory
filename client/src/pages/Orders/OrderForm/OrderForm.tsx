import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import ProductService from '../../../services/ProductService';
import BatchService from '../../../services/BatchService';
import BatchHistoryService from '../../../services/BatchHistoryService';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';
import NotFound from '../../NotFound/NotFoundPage';


interface BatchFormInfo {
    id: number;
    productId: number;
    quantity: number;
    expirationDate: Date;
    isDeleted: boolean;
}

interface BatchHistoryFormInfo {
    id: number;
    batchId: number;
    quantity: number;
    date: Date;
    type: string;
    comment: string;
}

interface OrderFormState {
    products: any[];
    batchForm: BatchFormInfo;
    batchHistoryForm: BatchHistoryFormInfo;
}

interface OrderFormProps {
    id: any;
    handleNavigation: () => void;
}

class OrderFormComponent extends Component<OrderFormProps, OrderFormState> {
    private productService: ProductService;
    private batchService: BatchService;
    private batchHistoryService: BatchHistoryService

    private batchForm: BatchFormInfo;
    private batchHistoryForm: BatchHistoryFormInfo;
    
    constructor(props: OrderFormProps) {
        super(props);

        this.batchForm = {
            id: 0,
            productId: 0,
            quantity: 0,
            expirationDate: new Date() || null,
            isDeleted: false
        };

        this.batchHistoryForm = {
            id: 0,
            batchId: 0,
            quantity: 0,
            date: new Date() || null,
            type: 'ORDER_IN',
            comment: ''
        };

        this.state = {
            products: [],
            batchForm: this.batchForm,
            batchHistoryForm: this.batchHistoryForm
        };

        this.productService = new ProductService();
        this.batchService = new BatchService();
        this.batchHistoryService = new BatchHistoryService();  
    }

    componentDidMount() {
        this.fetchProducts();
    }

    private fetchProducts = () => {
        this.productService.GetProducts()
            .then((data) => {
                if(data && data.products) {

                    this.batchForm.productId = data.products[0].id;

                    this.setState({
                        products: data.products
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    private AddOrUpdateBatchById = (batch: BatchFormInfo, batchHistory: BatchHistoryFormInfo) => {

        batchHistory.quantity = batch.quantity;
        batchHistory.date = new Date();

        this.batchService.AddOrUpdateBatch(batch, batchHistory)
             .then((data) => {
                this.props.handleNavigation();
             })
             .catch((error) => {
                 console.error(error);
             });
    };

    private AddBatchOrderOut = (productId: number, batchHistory: BatchHistoryFormInfo) => {

        batchHistory.quantity = this.batchForm.quantity;
        batchHistory.date = new Date();

        this.batchService.AddBatchOrderOut(productId, batchHistory)
             .then((data) => {
                if(data.addBatchOrderOut) {
                    this.props.handleNavigation();
                }
             })
             .catch((error) => {
                 console.error(error);
             });
    };

    private HandleAddAction = () => {
        if(this.batchHistoryForm.type === "ORDER_IN") {
            this.AddOrUpdateBatchById(this.batchForm, this.batchHistoryForm);
        } else {
            this.AddBatchOrderOut(this.batchForm.productId, this.batchHistoryForm);
        }
    }

    handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.batchForm.productId = parseInt(event.target.value);
        this.setState({
            batchForm: this.batchForm
        });
    };

    handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numericInput = event.target.value.replace(/[^0-9]/g, '');
        this.batchForm.quantity = parseInt(numericInput);

        if(isNaN(this.batchForm.quantity)) {
            this.batchForm.quantity = 0;
        }

        this.setState({
            batchForm: this.batchForm
        });
    };

    handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.batchHistoryForm.type = event.target.value;

        this.setState({
            batchHistoryForm: this.batchHistoryForm
        });
    };

    handleDateChange = (date: Date) => {
        this.batchForm.expirationDate = date;

        this.setState({
            batchForm: this.batchForm
        });
    };

    handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.batchHistoryForm.comment = event.target.value;

        this.setState({
            batchHistoryForm: this.batchHistoryForm
        });
    };

    render() {
        
        return (
            <div className="order-content">
                <ContentTitle Title={'New Order'} />

                <Form>
                    <Card>
                        <Card.Body>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Type</Form.Label>
                                <Form.Select 
                                    onChange={this.handleReasonChange}
                                    value={this.batchHistoryForm.type} >
                                    <option value='ORDER_IN'>Order In</option>
                                    <option value='ORDER_OUT'>Order Out</option>
                                </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Product</Form.Label>
                                <Form.Select 
                                    onChange={this.handleProductChange}
                                    value={this.batchForm.productId} >
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
                                        value={this.batchForm.quantity} />
                                </Form.Group>

                                {
                                    this.batchHistoryForm.type === "ORDER_IN" &&
                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Expiration Date</Form.Label>
                                        <DatePicker
                                            selected={this.batchForm.expirationDate}
                                            onChange={this.handleDateChange}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control"
                                            popperPlacement="bottom-end"
                                        />
                                    </Form.Group>
                                }
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    style={{ height: '200px' }} 
                                    onChange={this.handleCommentChange}
                                    value={this.batchHistoryForm.comment} />
                                </Form.Group>
                            </Row>
                        </Card.Body>

                        <Card.Footer className="text-muted">
                            <div className="form-actions">
                                <Button variant="danger" type="button" href="/Orders">
                                    Cancel
                                </Button>
                                <Button 
                                    variant="success" 
                                    type="button"
                                    onClick={this.HandleAddAction}>
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

function OrderForm() {
    const params = useParams<{ orderId?: string }>();
    const orderId = parseInt(params.orderId || '0');
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/orders');
    }

    if(orderId !== 0 || isNaN(Number(orderId)))
    {
        return <NotFound />
    }

    return <OrderFormComponent 
                id={orderId}
                handleNavigation={handleNavigation}/>
}

export default OrderForm;