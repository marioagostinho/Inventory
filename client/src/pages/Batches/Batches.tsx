import React from 'react'

import './Batches.css';
import ItemList from '../../components/ItemList/ItemList';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Batches() {

    const Header: String[] = [
        'Product',
        'Quantity',
        'Expirition Date',
        'Order'
    ];

    const Items: any[] = [
        {'id': 1, 'product': 'Rice', 'quantity': 1000, 'expiritionDate': '10-10-2023', "order": "OrderIn"},
        {'id': 2, 'product': 'Lettuce', 'quantity': 100, 'expiritionDate': '10-10-2024', "order": "OrderOut"},
        {'id': 3, 'product': 'Tomato', 'quantity': 500, 'expiritionDate': '12-12-2023', "order": "Lost"},
        {'id': 4, 'product': 'Pasta', 'quantity': 750, 'expiritionDate': '10-10-20235', "order": "Test"}
    ];

    return (
        <div className='batches-content'>
            
            <div className='content-header'>
                <div className='header-left'>
                    <h1>Batches</h1>
                </div>
                <div className='header-right'>
                    <Button variant="success">
                            <FontAwesomeIcon icon={faPlus} />Add
                    </Button>
                </div>
            </div>
            <hr />

            <ItemList 
                CanAction={true} 
                Header={Header} 
                Items={Items}
            />
        </div>
    );
}