import React from 'react';

import { useNavigate } from 'react-router-dom';

import ItemList from '../../components/ItemList/ItemList';
import ContentTitle from '../../components/ContentTitle/ContentTitle';


export default function Orders() {
    const navigate = useNavigate();

    //MOCKAP DATA
    const Header: String[] = [
        "Batch",
        "Date",
        "Amount",
        "Type"
    ];

    const Items: any[] = [
        {"id": 3, "batch": 1, "date": "26/05/2023", "amount": 50, "type": "Order Out"},
        {"id": 1, "batch": 1, "date": "25/05/2023", "amount": 100, "type": "Order In"}
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