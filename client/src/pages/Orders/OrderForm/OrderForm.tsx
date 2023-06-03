import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import ProductService from '../../../services/ProductService';
import BatchService from '../../../services/BatchService';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';
import NotFound from '../../NotFound/NotFoundPage';

interface BatchFormInfo {
    id: number;
    productId: number;
    quantity: number;
    expirationDate: Date;
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

//Component
class OrderFormComponent extends Component<OrderFormProps, OrderFormState> {
    private productService: ProductService;
    private batchService: BatchService;
    
    //CONSTRUCTOR
    constructor(props: OrderFormProps) {
        super(props);

        this.state = {
            products: [],
            batchForm: {
                id: 0,
                productId: 0,
                quantity: 0,
                expirationDate: new Date() || null
            },
            batchHistoryForm: {
                id: 0,
                batchId: 0,
                quantity: 0,
                date: new Date() || null,
                type: 'ORDER_IN',
                comment: ''
            }
        };

        this.productService = new ProductService();
        this.batchService = new BatchService();
    }

    //AFTER THE COMPONENT IS LOAD
    componentDidMount() {
        this.fetchProducts();
    }

    //SERVICES

    //Fecth all the products
    private fetchProducts = () => {
        this.productService.GetProducts()
            .then((data) => {
                if(data && data.products) {

                    const newBatchForm = this.state.batchForm;
                    newBatchForm.productId = data.products[0].id;

                    //Set products array and batchForm product id state
                    this.setState({
                        products: data.products,
                        batchForm: newBatchForm
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Add or Update batch by Id
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

    //Add order out by Id
    private AddBatchOrderOut = (productId: number, batchHistory: BatchHistoryFormInfo) => {
        batchHistory.quantity = this.state.batchForm.quantity;
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

    //ACTIONS

    //Selected AddOrUpdateBatchById or AddBatchOrderOut based on the type
    private HandleAddAction = () => {
        if(this.state.batchHistoryForm.type === "ORDER_IN") {
            this.AddOrUpdateBatchById(this.state.batchForm, this.state.batchHistoryForm);
        } else {
            this.AddBatchOrderOut(this.state.batchForm.productId, this.state.batchHistoryForm);
        }
    }

    //Change Form state when field reason changes
    handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newBatchHistoryForm: BatchHistoryFormInfo = this.state.batchHistoryForm;
        newBatchHistoryForm.type = event.target.value;

        this.setState({
            batchHistoryForm: newBatchHistoryForm
        });
    };

    //Change Form state when field product changes
    handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newBatchForm: BatchFormInfo = this.state.batchForm;
        newBatchForm.productId = parseInt(event.target.value);
        
        this.setState({
            batchForm: newBatchForm
        });
    };

    //Change Form state when field quantity changes
    handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numericInput = event.target.value.replace(/[^0-9]/g, '');

        const newBatchForm: BatchFormInfo = this.state.batchForm;
        newBatchForm.quantity = parseInt(numericInput);

        if(isNaN(newBatchForm.quantity)) {
            newBatchForm.quantity = 0;
        }

        this.setState({
            batchForm: newBatchForm
        });
    };

    //Change Form state when field date changes
    handleDateChange = (date: Date) => {
        const newBatchForm: BatchFormInfo = this.state.batchForm;
        newBatchForm.expirationDate = date;

        this.setState({
            batchForm: newBatchForm
        });
    };

    //Change Form state when field cooment changes
    handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newBatchHistoryForm: BatchHistoryFormInfo = this.state.batchHistoryForm;
        newBatchHistoryForm.comment = event.target.value;

        this.setState({
            batchHistoryForm: newBatchHistoryForm
        });
    };

    render() {
        
        return (
            <div className="order-content">
                {/* Page Title */}
                <ContentTitle 
                    Title={'New Order'} />

                {/* Form */}
                <Form>
                    <Card>
                        <Card.Body>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Type</Form.Label>
                                <Form.Select 
                                    onChange={this.handleReasonChange}
                                    value={this.state.batchHistoryForm.type} >
                                    <option value='ORDER_IN'>Order In</option>
                                    <option value='ORDER_OUT'>Order Out</option>
                                </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Product</Form.Label>
                                <Form.Select 
                                    onChange={this.handleProductChange}
                                    value={this.state.batchForm.productId} >
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
                                        value={this.state.batchForm.quantity} />
                                </Form.Group>

                                {
                                    this.state.batchHistoryForm.type === "ORDER_IN" &&
                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Expiration Date</Form.Label>
                                        <DatePicker
                                            selected={this.state.batchForm.expirationDate}
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
                                    value={this.state.batchHistoryForm.comment} />
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

//Function
function OrderForm() {
    //Hooks
    const params = useParams<{ orderId?: string }>();
    const orderId = parseInt(params.orderId || '0');
    const navigate = useNavigate();

    //Redirect to /orders
    const handleNavigation = () => {
        navigate('/orders');
    }

    //If orders id isn't a number or is smaller than zero return NotFound page
    if(orderId !== 0 || isNaN(Number(orderId)))
    {
        return <NotFound />
    }

    return <OrderFormComponent 
                id={orderId}
                handleNavigation={handleNavigation}/>
}

export default OrderForm;