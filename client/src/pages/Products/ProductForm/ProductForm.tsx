import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Form from 'react-bootstrap/esm/Form';
import { Button, Card, Col, Row } from 'react-bootstrap';

import ContentTitle from '../../../components/ContentTitle/ContentTitle';
import ProductService from '../../../services/ProductService';
import NotFound from '../../NotFound/NotFound';

interface ProductFormItem {
    id: number;
    name: string;
    isDeleted: boolean;
}

interface ProductFormProps {
    id: any;
    handleNavigation: () => void;
}

interface ProductFormState {
    form: ProductFormItem;
}

class ProductsPageComponent extends Component<ProductFormProps, ProductFormState> {
    private productService: ProductService;
    private form: ProductFormItem;

    private formTitle: string;
    private actionTitle: string;
    
    constructor(props: ProductFormProps) {
        super(props);

        this.formTitle = (props.id > 0) ? 'Edit Product' : 'New Product';
        this.actionTitle = (props.id > 0) ? 'Confirm' : 'Add';

        this.form = {
            id: props.id,
            name: '',
            isDeleted: false
        }

        this.productService = new ProductService();
    }

    componentDidMount() {
        if(this.props.id > 0) {
            this.fetchProductById(this.props.id);
        }
    }

    private fetchProductById = (id: number) => {
        this.productService.GetProductById(id)
            .then((data) => {
                if(data && data.products) {
                    this.form = {
                        id:  data.products[0].id,
                        name: data.products[0].name,
                        isDeleted: data.products[0].isDeleted || false
                    }

                    this.setState({
                        form: this.form
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    private AddOrUpdateProductById = (product: any) => {
       this.productService.AddOrUpdateProduct(product)
            .then((data) => {
                this.props.handleNavigation();
            })
            .catch((error) => {
                console.error(error);
            });
    };
    

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.form.name = event.target.value;

        this.setState({
            form: this.form
        });
    };

    render() {

        return (
            <div>
                <ContentTitle
                    Title={this.formTitle} />

                <Card>
                    <Form>
                        <Card.Body>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control 
                                        placeholder="Ex: Pasta" 
                                        onChange={this.handleNameChange}
                                        value={this.form.name} />
                                </Form.Group>
                            </Row>  
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <div className="form-actions">
                                <Button variant="danger" type="button" href="/Products">
                                    Cancel
                                </Button>
                                <Button variant="success" type="button" onClick={() => this.AddOrUpdateProductById(this.form)}>
                                    {this.actionTitle}
                                </Button>
                            </div>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        );
    }
}

function ProductsForm() {
    const params = useParams<{ productId?: string }>();
    const productId = parseInt(params.productId || '0');
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/products');
    }

    if(productId < 0 || isNaN(Number(productId))) {
        return <NotFound />
    }

    return <ProductsPageComponent 
                id={productId}
                handleNavigation={handleNavigation} />
}

export default ProductsForm;