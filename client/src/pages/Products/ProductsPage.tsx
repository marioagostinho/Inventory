import React, { Component, useState } from 'react'

import { Button, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import ItemList from '../../components/ItemList/ItemList';
import ProductForm from './ProductForm/ProductForm';
import ProductService from '../../services/ProductService';

interface State {
    open: boolean;
    items: any[];
}

class ProductsPage extends Component<{}, State> {
    private productService: ProductService;

    //Construct 
    constructor(props: any) {
        super(props);

        this.state = {
            open: false,
            items: [],
        };

        this.productService = new ProductService();
    }

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = () => {
        this.productService
        .GetProducts()
        .then((data) => {
            if (data && data.products) {
                const items = data.products.map((item: any) => ({
                    id: item.id,
                    name: item.name
                }));

                this.setState({ items });
            }
        })
        .catch((error) => {
            console.error(error);
        });
    };

    onCollapse = (newState: boolean) => {
        this.setState({
            open: newState
        });
    }

    render() {
        const { open, items } = this.state;

        const Header = ['Name'];

        return (
        <div className='products-content'>
            {/* Product Tile */}
            <div className='content-header'>
            <div className='header-left'>
                <h1>Products</h1>
            </div>
            <div className='header-right'>
                {/* To open and close the Product Form */}
                <Button
                variant='success'
                onClick={() => this.onCollapse(!this.state.open)}
                aria-controls='collapse-product'
                aria-expanded={open}
                >
                {open === false && <FontAwesomeIcon icon={faPlus} />}
                {open === true && <FontAwesomeIcon icon={faMinus} />}
                Add
                </Button>
            </div>
            </div>
            <hr />

            {/* Product Form */}
            <div className='product-item'>
            <Collapse in={open}>
                <div id='collapse-product'>
                <ProductForm CancelClick={() => this.onCollapse(false)} />
                </div>
            </Collapse>
            </div>

            {/* Products Table */}
            <ItemList
            CanAction={true}
            Header={Header}
            Items={items}
            EditClick={() => this.onCollapse(true)}
            />
        </div>
        );
    }
}
  
export default ProductsPage;