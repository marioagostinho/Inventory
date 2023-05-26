import React from 'react';

import './Orders.css';
import ItemList from '../../components/ItemList/ItemList';

export default function Orders() {

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

    const ItemsHistory: any[] = [
        {"id": 3, "batch": 1, "date": "26/05/2023", "amount": 50, "type": "Order Out"},
        {"id": 2, "batch": 1, "date": "26/05/2023", "amount": 50, "type": "Lost"},
        {"id": 1, "batch": 1, "date": "25/05/2023", "amount": 100, "type": "Order In"}
    ];

    return (
        <div className='orders-content'>

            <div className='content-header'>
                <div className='header-left'>
                    <h1>Orders</h1>
                </div>
            </div>
            <hr />

            <ItemList
                CanAction={false}
                Header={Header}
                Items={Items} />

            <div className='separation'></div>

            <div className='content-header'>
                <div className='header-left'>
                    <h1>History</h1>
                </div>
            </div>
            <hr />

            <ItemList
                CanAction={false}
                Header={Header}
                Items={ItemsHistory} />
        </div>
        
    )
}