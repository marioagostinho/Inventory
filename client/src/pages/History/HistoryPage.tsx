import React from 'react';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import ItemList from '../../components/ItemList/ItemList';

export default function HistoryPage() {

    //MOCAP DATA
    const Header: String[] = [
        "Product",
        "Date",
        "Amount",
        "Type"
    ];

    const Items: any[] = [
        {"id": 3, "Product": "Rice (#3)", "date": "26/05/2023", "amount": 50, "type": "Order Out"},
        {"id": 1, "Procuct": "Pasta (#1)", "date": "25/05/2023", "amount": 100, "type": "Order In"}
    ];

    return (
        <div>
            <ContentTitle
                Title={"History"} />

            <ItemList 
                CanAction={false}
                Header={Header}
                Items={Items}
            />
        </div>
    );
}