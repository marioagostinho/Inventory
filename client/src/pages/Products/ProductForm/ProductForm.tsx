import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as yup from 'yup';
import { Formik } from 'formik';
import Form from 'react-bootstrap/esm/Form';
import { Button, Card, Col, Row } from 'react-bootstrap';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';
import NotFound from '../../NotFound/NotFoundPage';

//FORM UI
import InSubmitButton from '../../../components/FormsUI/InSubmitButton';
import InTextField from '../../../components/FormsUI/InTextField';

//SERVICES
import ProductService from '../../../services/ProductService';


interface ProductFormProps {
    id: any;
    handleNavigation: () => void;
}

//Component
class ProductsPageComponent extends Component<ProductFormProps> {
    private productService: ProductService;

    //Reference for the formik
    formikRef: any;
    
    //CONSTRUCTOR
    constructor(props: ProductFormProps) {
        super(props);

        this.productService = new ProductService();
    }

    //AFTER THE COMPONENT IS LOAD
    componentDidMount() {
        if(this.props.id > 0) {
            this.fetchProductById(this.props.id);
        }
    }

    //SERVICES

    //Fecth product by Id
    private fetchProductById = (id: number) => {
        this.productService.GetProductById(id)
            .then((data) => {
                if(data && data.products) {
                    this.formikRef.setValues({
                        id:  data.products[0].id,
                        name: data.products[0].name
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Add or Update product by Id
    private AddOrUpdateProductById = (product: any) => {
        this.productService.AddOrUpdateProduct(product)
                .then((data) => {
                    //Redirect to /Products
                    this.props.handleNavigation();
                })
                .catch((error) => {
                    console.error(error);
                });
    };
    
    //ACTIONS

    render() {
        const INITIAL_VALUES = {
            id: this.props.id,
            name: ''
        }
        
        const FORM_VALIDATION = yup.object().shape({
            name: yup.string()
                .required("Name is required")
        });

        const FORM_TITLE: string = (this.props.id > 0) ? 'Edit Product' : 'New Product';
        const ACTION_TITLE: string = (this.props.id > 0) ? 'Confirm' : 'Add';

        return (
            <div>
                {/* Page Title */}
                <ContentTitle
                    Title={FORM_TITLE} />

                {/* Form */}
                <Card>
                    <Formik
                        initialValues={INITIAL_VALUES}
                        validationSchema={FORM_VALIDATION}
                        onSubmit={this.AddOrUpdateProductById}
                        innerRef={(formik) => (this.formikRef = formik)} >
                        <Form>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>Name <span className='input-required '>*</span></Form.Label>
                                        <InTextField 
                                            name='name'
                                            otherProps={{placeholder:'Ex: Cheese...'}}></InTextField>
                                    </Form.Group>
                                </Row>  
                            </Card.Body>
                            <Card.Footer className="text-muted">
                                <div className="form-actions">
                                    <Button variant="danger" type="button" href="/Products">
                                        Cancel
                                    </Button>
                                    <InSubmitButton otherProps={{}}>
                                        {ACTION_TITLE}
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
function ProductsForm() {
    //Hooks
    const params = useParams<{ productId?: string }>();
    const productId = parseInt(params.productId || '0');
    const navigate = useNavigate();

    //Redirect to /products
    const handleNavigation = () => {
        navigate('/products');
    }

    //If product id isn't a number or is smaller than zero return NotFound page
    if(productId < 0 || isNaN(Number(productId))) {
        return <NotFound />
    }

    return <ProductsPageComponent 
                id={productId}
                handleNavigation={handleNavigation} />
}

export default ProductsForm;