import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as yup from 'yup';
import { Formik } from 'formik';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';
import NotFound from '../../NotFound/NotFoundPage';

//FORM UI
import InSelect from '../../../components/FormsUI/InSelect';
import InTextField from '../../../components/FormsUI/InTextField';
import InSubmitButton from '../../../components/FormsUI/InSubmitButton';
import InDatePicker from '../../../components/FormsUI/InDatePicker';

//SERVICES
import ProductService from '../../../services/ProductService';
import BatchService from '../../../services/BatchService';

interface OrderFormState {
    products: any[];
}

interface OrderFormProps {
    id: any;
    handleNavigation: () => void;
}

//Component
class OrderFormComponent extends Component<OrderFormProps, OrderFormState> {
    private productService: ProductService;
    private batchService: BatchService;

    //Reference for the formik
    formikRef: any;
    
    //CONSTRUCTOR
    constructor(props: OrderFormProps) {
        super(props);

        this.state = {
            products: []
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
                    //Set form batchForm.productId value
                    this.formikRef.setFieldValue('batchForm.productId', data.products[0].id)

                    //Set products array and batchForm product id state
                    this.setState({
                        products: data.products
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Add or Update batch by Id
    private AddOrUpdateBatchById = (values: any) => {
        values.batchHistoryForm.quantity = values.batchForm.quantity;
        values.batchHistoryForm.date = new Date();

        console.log(values);

        this.batchService.AddOrUpdateBatch(values.batchForm, values.batchHistoryForm)
             .then((data) => {
                this.props.handleNavigation();
             })
             .catch((error) => {
                 console.error(error);
             });
    };

    //Add order out by Id
    private AddBatchOrderOut = (values: any) => {
        values.batchHistoryForm.quantity = values.batchForm.quantity;
        values.date = new Date();

        this.batchService.AddBatchOrderOut(values.batchForm.productId, values.batchHistoryForm)
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
    private HandleAddAction = (values:any) => {
        values.batchForm.quantity = parseInt(values.batchForm.quantity);

        if(values.batchHistoryForm.type === "ORDER_IN") {
            this.AddOrUpdateBatchById(values);
        } else {
            this.AddBatchOrderOut(values);
        }
    }

    render() {
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
                type: 'ORDER_IN',
                comment: ''
              }
        }

        //Form validation
        const FORM_VALIDATION = yup.object().shape({
            batchForm: yup.object().shape({
              quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be greater than 0'),
              expirationDate: yup.date().nullable().test({
                name: 'expirationDate',
                exclusive: true,
                message: 'Expiration Date is required',
                test: function (value) {
                  const type = this.resolve(yup.ref('batchHistoryForm.type'));
                  if (type === 'ORDER_IN') {
                    return value !== null;
                  }
                  return true;
                },
              })
            }),
            batchHistoryForm: yup.object().shape({
              type: yup.string().required('Type is required'),
              comment: yup.string().max(250, 'Comment must not exceed 250 characters'),
            }),
        });
        
        return (
            <div className="order-content">
                {/* Page Title */}
                <ContentTitle 
                    Title={'New Order'} />

                {/* Form */}
                <Card>
                    <Formik
                        initialValues={INITIAL_VALUES}
                        validationSchema={FORM_VALIDATION}
                        onSubmit={this.HandleAddAction}
                        innerRef={(formik) => (this.formikRef = formik)} >
                        {(formikProps: any) => (
                            <Form>
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>Type <span className='input-required '>*</span></Form.Label>
                                            <InSelect
                                                name="batchHistoryForm.type"
                                                otherProps={{}}>
                                                <option value='ORDER_IN'>Order In</option>
                                                <option value='ORDER_OUT'>Order Out</option>
                                            </InSelect>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>Product <span className='input-required '>*</span></Form.Label>
                                            <InSelect
                                                name="batchForm.productId"
                                                otherProps={{}}>
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
                                        { formikProps?.values?.batchHistoryForm?.type === "ORDER_IN" && (
                                            <Form.Group as={Col} controlId="formGridZip">
                                            <Form.Label>Expiration Date <span className='input-required '>*</span></Form.Label>
                                                <InDatePicker name="batchForm.expirationDate" otherProps={{}}></InDatePicker>
                                            </Form.Group>
                                        )}
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
                                        <Button variant="danger" type="button" href="/Orders">
                                            Cancel
                                        </Button>
                                        <InSubmitButton otherProps={{}}>
                                            Add
                                        </InSubmitButton>
                                    </div>
                                </Card.Footer>
                            </Form>
                        )}
                    </Formik>
                </Card>
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