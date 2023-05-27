import React from 'react';

import { useNavigate } from 'react-router-dom';

import ItemList from '../../components/ItemList/ItemList';
import ContentTitle from '../../components/ContentTitle/ContentTitle';


export default function OrdersPage() {
    const navigate = useNavigate();

    //MOCAP DATA
    const Header: String[] = [
        "Product",
        "Date",
        "Amount",
        "Type"
    ];

    const Items: any[] = [
        {"id": 3, "Product": "Rice", "date": "26/05/2023", "amount": 50, "type": "Order Out"},
        {"id": 1, "Procuct": "Pasta", "date": "25/05/2023", "amount": 100, "type": "Order In"}
    ];

    //Add action to be used in the ItemList
    const AddClick = () => {
        navigate("/Orders/0");
    }

    return (
        <div className='orders-content'>

            <ContentTitle 
                Title={'Orders'}
                AddClick={AddClick}
            />

            <ItemList
                CanAction={false}
                Header={Header}
                Items={Items} />
        </div>
        
    )
}