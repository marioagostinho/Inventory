import React, { Component, useState } from 'react';
import { useParams } from 'react-router-dom';

import Form from 'react-bootstrap/esm/Form';
import { Button, Card, Col, Row } from 'react-bootstrap';

import { ItemListInfo } from '../../../components/ItemList/ItemList';
import ContentTitle from '../../../components/ContentTitle/ContentTitle';

import './ProductForm.css';
import ProductService from '../../../services/ProductService';
import NotFound from '../../NotFound/NotFound';

interface ProductFormProps {
    id: any
}

interface ProductFormState {
    name: string
}

class ProductsPageComponent extends Component<ProductFormProps, ProductFormState> {
    private productService: ProductService;
    private form: ProductFormState;

    private formTitle: string;
    
    constructor(props: ProductFormProps) {
        super(props);

        this.formTitle = (props.id > 0) ? 'Edit Product' : 'New Product';

        this.form = {
            name: ''
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
                        name: data.products[0].name
                    }

                    this.setState({
                        name: this.form.name
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.form.name = event.target.value;

        this.setState({
            name: this.form.name
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
                                    <Form.Label>Quantity</Form.Label>
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
                                <Button variant="success" type="submit">
                                    Add
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

    if(productId < 0) {
        return <NotFound />
    }

    return <ProductsPageComponent id={productId}/>
}

export default ProductsForm;