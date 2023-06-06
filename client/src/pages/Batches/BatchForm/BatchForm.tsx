import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as yup from 'yup';
import { Formik } from 'formik';
import moment from 'moment';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';
import NotFound from '../../NotFound/NotFoundPage';

//FORM UI
import InSelect from '../../../components/FormsUI/InSelect';
import InTextField from '../../../components/FormsUI/InTextField';
import InDatePicker from '../../../components/FormsUI/InDatePicker';
import InSubmitButton from '../../../components/FormsUI/InSubmitButton';

//SERVICE
import BatchService from '../../../services/BatchService';
import UniversalToast from '../../../components/UniversalToast/UniversalToast';

interface BatchFormState {
    products: any[];
}

interface BatchFormProps {
    id: any;
    handleNavigation: () => void;
}

//Component
class BatchFormComponent extends Component<BatchFormProps, BatchFormState> {
    private BatchService: BatchService;

    private OriginalQuantity: number;

    //Reference for the formik
    formikRef: any;
    
    //CONSTRUCTOR
    constructor(props: BatchFormProps) {
        super(props);

        this.OriginalQuantity = 0;

        this.state = {
            products: []
        };

        this.BatchService = new BatchService();
    }

    //AFTER THE COMPONENT IS LOAD
    componentDidMount() {
        this.fetchBatchById(this.props.id);
    }

    //SERVICES

    //Fetch batch by Id
    private fetchBatchById = (id: number) => {
        this.BatchService.GetBatchById(id)
            .then((data) => {
                if(data && data.batches) {
                    this.OriginalQuantity = data.batches[0].quantity;

                    this.formikRef.setFieldValue('batchForm.productId', data.batches[0].product.id)
                    this.formikRef.setFieldValue('batchForm.quantity', data.batches[0].quantity)
                    this.formikRef.setFieldValue('batchForm.expirationDate', moment(data.batches[0].expirationDate).format("YYYY-MM-DD"))

                    this.setState({
                        products: [data.batches[0].product]
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Add or Update batch by Id
    private AddOrUpdateBatchById = (values: any) => {
        values.batchForm.quantity = parseInt(values.batchForm.quantity);
        values.batchHistoryForm.quantity = values.batchForm.quantity - this.OriginalQuantity;

        this.BatchService.AddOrUpdateBatch(values.batchForm, values.batchHistoryForm)
            .then((data) => {
                //Toast
                UniversalToast.success("Batch was edited successfully");
                
                this.props.handleNavigation();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        let OriginalQuantity = this.OriginalQuantity;

        //Form values initialization
        const INITIAL_VALUES = {
            batchForm: {
                id: this.props.id,
                productId: 0,
                quantity: 0,
                expirationDate: new Date().toISOString().split('T')[0],
              },
              batchHistoryForm: {
                id: 0,
                batchId: this.props.id,
                quantity: 0,
                date: new Date().toISOString().split('T')[0],
                type: 'DEFECT',
                comment: ''
              }
        }

        //Form validation
        const FORM_VALIDATION = yup.object().shape({
            batchForm: yup.object().shape({
              quantity: yup.number()
                .required('Quantity is required')
                .min(1, 'Quantity must be greater than 0'),
              expirationDate: yup.date()
                .required("Expiration Date is required")
            }),
            batchHistoryForm: yup.object().shape({
              type: yup.string()
                .required('Type is required'),
              comment: yup.string()
                .max(250, 'Comment must not exceed 250 characters'),
            }),
        });
        
        return (
            <div className="batch-content">
                {/* Page Title */}
                <ContentTitle
                    Title={`Edit Batch #${this.props.id}`} />

                {/* Form */}
                <Card>
                    <Formik
                        initialValues={INITIAL_VALUES}
                        validationSchema={FORM_VALIDATION}
                        onSubmit={this.AddOrUpdateBatchById}
                        innerRef={(formik) => (this.formikRef = formik)} >
                        <Form>
                            <Card.Body>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Product <span className='input-required '>*</span></Form.Label>
                                    <InSelect
                                        name="batchForm.productId"
                                        otherProps={{disabled: true}}>
                                        {
                                            this.state.products.map((product: any) => {
                                                return <option key={product.id} value={product.id}>{product.name}</option>
                                            })
                                        }
                                    </InSelect>
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Quantity <span className='input-required '>*</span></Form.Label>
                                    <InTextField 
                                        name='batchForm.quantity'
                                        otherProps={{placeholder:'Ex: 100'}}></InTextField>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Expiration Date <span className='input-required '>*</span></Form.Label>
                                    <InDatePicker name="batchForm.expirationDate" otherProps={{}}></InDatePicker>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Reason <span className='input-required '>*</span></Form.Label>
                                    <InSelect
                                        name="batchHistoryForm.type"
                                        otherProps={{}}>
                                        <option key="DEFECT" value="DEFECT">Defect</option>
                                        <option key="LOST" value="LOST">Lost</option>
                                        <option key="OTHER" value="OTHER">Other</option>
                                    </InSelect>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Comment</Form.Label>
                                    <InTextField 
                                        name='batchHistoryForm.comment'
                                        otherProps={{as:"textarea", style:{ height: '200px' }}}></InTextField>
                                </Form.Group>
                            </Row>

                            </Card.Body>

                            <Card.Footer className="text-muted">
                                <div className="form-actions">
                                    <Button variant="danger" type="button" href="/Batches">
                                        Cancel
                                    </Button>
                                    <InSubmitButton otherProps={{}}>
                                        Confirm
                                    </InSubmitButton>
                                </div>
                            </Card.Footer>
                        </Form>
                    </Formik>
                </Card>
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