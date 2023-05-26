import React from 'react'

import './Products.css';
import ItemList from '../../components/ItemList/ItemList';

export default function Products() {

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

    return (
        <div className='products-content'>
            <ItemList 
                Title='Products' 
                AddLink='' 
                CanAction={true}
                Header={Header} 
                Items={Items}
            />
        </div>
    );
}