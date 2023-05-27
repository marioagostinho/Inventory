import React, { useState } from 'react'

import { Button, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import ItemList from '../../components/ItemList/ItemList';
import ProductForm from './ProductForm/ProductForm';

export default function ProductsPage() {
    const [open, setOpen] = useState(false);

    //MOCKAP DATA
    const Header: String[] = [
        'Name',
        'Quantity'
    ];

    const Items: any[] = [
        {'id': 1, 'name': 'Rice', 'quantity': 1000},
        {'id': 2, 'name': 'Lettuce', 'quantity': 100},
        {'id': 3, 'name': 'Tomato', 'quantity': 500},
        {'id': 4, 'name': 'Pasta', 'quantity': 750}
    ];

    //Cancel click passed to ProductForm
    const CancelClick = () => {
        setOpen(!open)
    }

    //Edit click passed to ItemList
    const EditClick =  (id: any) => {
        setOpen(true);
    }

    return (
        <div className='products-content'>
            
            {/* Product Tile */}
            <div className='content-header'>
                <div className='header-left'>
                    <h1>Products</h1>
                </div>
                <div className='header-right'>
                    {/* To open and close the Product Form */}
                    <Button variant="success"
                        onClick={() => setOpen(!open)}
                        aria-controls="collapse-product"
                        aria-expanded={open}
                    >
                        {
                            open === false &&
                            <FontAwesomeIcon icon={faPlus} />
                        }
                        {
                            open === true &&
                            <FontAwesomeIcon icon={faMinus} />
                        }
                        Add
                    </Button>
                </div>
            </div>
            <hr />

            {/* Product Form */}
            <div className='product-item'>
                <Collapse in={open}>
                    <div id="collapse-product">
                        <ProductForm 
                            CancelClick={CancelClick} />
                    </div>
                </Collapse>
            </div>

            {/* Products Table */}
            <ItemList
                CanAction={true}
                Header={Header} 
                Items={Items}
                EditClick={EditClick}
            />
        </div>
    );
}