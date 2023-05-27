import React from 'react'

import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import ItemList from '../../components/ItemList/ItemList';
import './BatchesPage.css';
import { redirect, useNavigate } from 'react-router-dom';

export default function Batches() {
    const navigate = useNavigate();

    const Header: String[] = [
        'Product',
        'Quantity',
        'Expirition Date',
    ];

    const Items: any[] = [
        {'id': 1, 'product': 'Rice', 'quantity': 1000, 'expiritionDate': '10-10-2023'},
        {'id': 2, 'product': 'Lettuce', 'quantity': 100, 'expiritionDate': '10-10-2024'},
        {'id': 3, 'product': 'Tomato', 'quantity': 500, 'expiritionDate': '12-12-2023'},
        {'id': 4, 'product': 'Pasta', 'quantity': 750, 'expiritionDate': '10-10-20235'},
        {'id': 1, 'product': 'Rice', 'quantity': 1000, 'expiritionDate': '10-10-2023'},
        {'id': 2, 'product': 'Lettuce', 'quantity': 100, 'expiritionDate': '10-10-2024'},
        {'id': 3, 'product': 'Tomato', 'quantity': 500, 'expiritionDate': '12-12-2023'},
        {'id': 4, 'product': 'Pasta', 'quantity': 750, 'expiritionDate': '10-10-20235'},
        {'id': 1, 'product': 'Rice', 'quantity': 1000, 'expiritionDate': '10-10-2023'},
        {'id': 2, 'product': 'Lettuce', 'quantity': 100, 'expiritionDate': '10-10-2024'},
        {'id': 3, 'product': 'Tomato', 'quantity': 500, 'expiritionDate': '12-12-2023'},
        {'id': 4, 'product': 'Pasta', 'quantity': 750, 'expiritionDate': '10-10-20235'}
    ];

    const EditClick =  (id: any) => {
        navigate("/Batches/" + id);
    }

    return (
        <div className='batches-content'>
            
            <div className='content-header'>
                <div className='header-left'>
                    <h1>Batches</h1>
                </div>
                <div className='header-right'>
                    <Button variant="success" href='/Batches/0'>
                            <FontAwesomeIcon icon={faPlus} />Add
                    </Button>
                </div>
            </div>
            <hr />

            <ItemList 
                CanAction={true} 
                Header={Header} 
                Items={Items}
                EditClick={EditClick}
            />
        </div>
    );
}