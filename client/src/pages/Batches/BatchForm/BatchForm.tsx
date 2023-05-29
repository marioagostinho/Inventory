import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

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

interface BatchFormState {
    products: any[];
    batchForm: BatchFormInfo;
    batchHistoryForm: BatchHistoryFormInfo;
}

interface BatchFormProps {
    id: any;
    handleNavigation: () => void;
}

class BatchFormComponent extends Component<BatchFormProps, BatchFormState> {
    private productService: ProductService;
    private BatchService: BatchService;
    private batchHistoryService: BatchHistoryService

    private batchForm: BatchFormInfo;
    private batchHistoryForm: BatchHistoryFormInfo;

    private OriginalQuantity: number;
    
    constructor(props: BatchFormProps) {
        super(props);

        this.OriginalQuantity = 0;

        this.batchForm = {
            id: props.id,
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
            type: 'DEFECT',
            comment: ''
        };

        this.state = {
            products: [],
            batchForm: this.batchForm,
            batchHistoryForm: this.batchHistoryForm
        };

        this.productService = new ProductService();
        this.BatchService = new BatchService();
        this.batchHistoryService = new BatchHistoryService();  
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
        this.BatchService.GetBatchById(id)
            .then((data) => {
                if(data && data.batches) {
                    this.OriginalQuantity = data.batches[0].quantity;

                    this.batchForm = {
                        id: this.props.id,
                        productId: data.batches[0].product.id,
                        quantity: data.batches[0].quantity,
                        expirationDate: moment(data.batches[0].expirationDate).toDate(),
                        isDeleted: false
                    }

                    this.setState({
                        batchForm: this.batchForm
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

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

    handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.batchForm.productId = parseInt(event.target.value);
        this.setState({
            batchForm: this.batchForm
        });
    };

    handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numericInput = event.target.value.replace(/[^0-9]/g, '');
        this.batchForm.quantity = parseInt(numericInput);

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
                                    disabled
                                    onChange={this.handleProductChange}
                                    value={this.batchForm.productId}>
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
                                    value={this.batchForm.quantity}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Expiration Date</Form.Label>
                                <DatePicker
                                    selected={this.batchForm.expirationDate}
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
                                    value={this.batchHistoryForm.type}>
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
                                    value={this.batchHistoryForm.comment} />
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
                                    onClick={() => this.AddOrUpdateBatchById(this.batchForm, this.batchHistoryForm)}>
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

function BatchForm() {
    const params = useParams<{ batchId?: string }>();
    const batchId = parseInt(params.batchId || '0');
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/batches');
    }

    if(batchId === 0 || isNaN(Number(batchId)))
    {
        return <NotFound />
    }

    return <BatchFormComponent 
                id={batchId}
                handleNavigation={handleNavigation} />
}

export default BatchForm;