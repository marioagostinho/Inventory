import React from 'react'

import { useNavigate } from 'react-router-dom';

import ItemList from '../../components/ItemList/ItemList';
import ContentTitle from '../../components/ContentTitle/ContentTitle';

export default function Batches() {
    const navigate = useNavigate();

    //MOCAP DATA
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

    //Action to be used in the ContentTitle and ItemList
    const EditClick =  (id: any) => {
        navigate("/Batches/" + id);
    }

    return (
        <div className='batches-content'>
            
            <ContentTitle 
                Title={'Batches'}
            />

            <ItemList 
                CanAction={true} 
                Header={Header} 
                Items={Items}
                EditClick={EditClick}
            />
        </div>
    );
}