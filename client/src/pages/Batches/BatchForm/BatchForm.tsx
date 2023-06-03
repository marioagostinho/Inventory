import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

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

interface BatchFormState {
    products: any[];
    batchForm: BatchFormInfo;
    batchHistoryForm: BatchHistoryFormInfo;
}

interface BatchFormProps {
    id: any;
    handleNavigation: () => void;
}

//Component
class BatchFormComponent extends Component<BatchFormProps, BatchFormState> {
    private productService: ProductService;
    private BatchService: BatchService;

    private OriginalQuantity: number;
    
    //CONSTRUCTOR
    constructor(props: BatchFormProps) {
        super(props);

        this.OriginalQuantity = 0;

        this.state = {
            products: [],
            batchForm: {
                id: props.id,
                productId: 0,
                quantity: 0,
                expirationDate: new Date() || null
            },
            batchHistoryForm: {
                id: 0,
                batchId: props.id,
                quantity: 0,
                date: new Date() || null,
                type: 'DEFECT',
                comment: ''
            }
        };

        this.productService = new ProductService();
        this.BatchService = new BatchService();
    }

    //AFTER THE COMPONENT IS LOAD
    componentDidMount() {
        this.fetchProducts();
        this.fetchBatchById(this.props.id);
    }

    //SERVICES

    //Fecth all the products
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

    //Fetch batch by Id
    private fetchBatchById = (id: number) => {
        this.BatchService.GetBatchById(id)
            .then((data) => {
                if(data && data.batches) {
                    this.OriginalQuantity = data.batches[0].quantity;

                    //Set batchForm state
                    this.setState({
                        batchForm: {
                            id: this.props.id,
                            productId: data.batches[0].product.id,
                            quantity: data.batches[0].quantity,
                            expirationDate: moment(data.batches[0].expirationDate).toDate()
                        }
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Add or Update batch by Id
    private AddOrUpdateBatchById = (batch: BatchFormInfo, batchHistory: BatchHistoryFormInfo) => {
        batchHistory.quantity = batch.quantity - this.OriginalQuantity;
        batchHistory.date = new Date();

        this.BatchService.AddOrUpdateBatch(batch, batchHistory)
            .then((data) => {
                this.props.handleNavigation();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Change Form state when field product changes
    handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newBatchForm : BatchFormInfo = this.state.batchForm;
        newBatchForm.productId = parseInt(event.target.value);

        this.setState({
            batchForm: newBatchForm
        });
    };

    //Change Form state when field quantity changes
    handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numericInput = event.target.value.replace(/[^0-9]/g, '');

        const newBatchForm : BatchFormInfo = this.state.batchForm;
        newBatchForm.quantity = parseInt(numericInput);

        if(isNaN(newBatchForm.quantity)) {
            newBatchForm.quantity = 0;
        }

        this.setState({
            batchForm: newBatchForm
        });
    };

    //Change Form state when field reason changes
    handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newBatchHistoryForm: BatchHistoryFormInfo = this.state.batchHistoryForm;
        newBatchHistoryForm.type = event.target.value;

        this.setState({
            batchHistoryForm: newBatchHistoryForm
        });
    };

    //Change Form state when field date changes
    handleDateChange = (date: Date) => {
        const newBatchForm : BatchFormInfo = this.state.batchForm;
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
            <div className="batch-content">
                {/* Page Title */}
                <ContentTitle
                    Title={`Edit Batch #${this.props.id}`} />
                
                {/* Form */}
                <Form>
                    <Card>
                        <Card.Body>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Product</Form.Label>
                                <Form.Select
                                    disabled
                                    onChange={this.handleProductChange}
                                    value={this.state.batchForm.productId}>
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
                                    value={this.state.batchForm.quantity}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Expiration Date</Form.Label>
                                <DatePicker
                                    selected={this.state.batchForm.expirationDate}
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
                                    value={this.state.batchHistoryForm.type}>
                                    <option key="DEFECT" value="DEFECT">Defect</option>
                                    <option key="LOST" value="LOST">Lost</option>
                                    <option key="OTHER" value="OTHER">Other</option>
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
                                    value={this.state.batchHistoryForm.comment} />
                            </Form.Group>
                        </Row>

                        </Card.Body>

                        <Card.Footer className="text-muted">
                            <div className="form-actions">
                                <Button variant="danger" type="button" href="/Batches">
                                    Cancel
                                </Button>
                                <Button 
                                    variant="success"
                                    type="button"
                                    onClick={() => this.AddOrUpdateBatchById(this.state.batchForm, this.state.batchHistoryForm)}>
                                    Confirm
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
function BatchForm() {
    //Hooks
    const params = useParams<{ batchId?: string }>();
    const batchId = parseInt(params.batchId || '0');
    const navigate = useNavigate();

    //Redirect to /batches
    const handleNavigation = () => {
        navigate('/batches');
    }

    //If batch id isn't a number or is smaller than zero return NotFound page
    if(batchId === 0 || isNaN(Number(batchId)))
    {
        return <NotFound />
    }

    return <BatchFormComponent 
                id={batchId}
                handleNavigation={handleNavigation} />
}

export default BatchForm;