import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Form from 'react-bootstrap/esm/Form';
import { Button, Card, Col, Row } from 'react-bootstrap';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';
import ProductService from '../../../services/ProductService';
import NotFound from '../../NotFound/NotFoundPage';

interface ProductFormItem {
    id: number;
    name: string;
}

interface ProductFormProps {
    id: any;
    handleNavigation: () => void;
}

interface ProductFormState {
    form: ProductFormItem;
}

//Component
class ProductsPageComponent extends Component<ProductFormProps, ProductFormState> {
    private productService: ProductService;
    
    //CONSTRUCTOR
    constructor(props: ProductFormProps) {
        super(props);
    
        this.state ={
            form: {
                id: props.id,
                name: ''
            }
        };

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
                    //Set form state
                    this.setState({
                        form: {
                            id:  data.products[0].id,
                            name: data.products[0].name
                        }
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

    //Change Form state when field name changes
    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newForm: ProductFormItem = this.state.form;
        newForm.name = event.target.value;

        this.setState({
            form: newForm
        });
    };

    render() {

        const formTitle: string = (this.props.id > 0) ? 'Edit Product' : 'New Product';
        const actionTitle: string = (this.props.id > 0) ? 'Confirm' : 'Add';

        return (
            <div>
                {/* Page Title */}
                <ContentTitle
                    Title={formTitle} />

                {/* Form */}
                <Card>
                    <Form>
                        <Card.Body>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control 
                                        placeholder="Ex: Pasta" 
                                        onChange={this.handleNameChange}
                                        value={this.state.form.name} />
                                </Form.Group>
                            </Row>  
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <div className="form-actions">
                                <Button variant="danger" type="button" href="/Products">
                                    Cancel
                                </Button>
                                <Button variant="success" type="button" onClick={() => this.AddOrUpdateProductById(this.state.form)}>
                                    {actionTitle}
                                </Button>
                            </div>
                        </Card.Footer>
                    </Form>
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