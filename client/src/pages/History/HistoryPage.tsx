import React, { Component } from 'react';

import ContentTitle from '../../components/ContentTitle/ContentTitle';
import ItemList, { ItemListHeader, ItemListInfo } from '../../components/ItemList/ItemList';
import BatchHistoryService from '../../services/BatchHistoryService';
import moment from 'moment';

interface State {
    items: [];
}

class HistoryPage extends Component<{}, State> {
    private batchHistoryService: BatchHistoryService;

    constructor(props: any) {
        super(props);

        this.state = {
            items: []
        }

        this.batchHistoryService = new BatchHistoryService();
    }

    componentDidMount() {
        this.fetchBatchHistories();
    }

    fetchBatchHistories = () => {
        this.batchHistoryService
            .GetBatchHistories()
            .then((data) => {
                if (data && data.batchHistories) {
                    const items = data.batchHistories.map((item: any) => ({
                        Value: {
                            id: item.id,
                            product: `${item.batch.product.name} (#${item.batch.id})`,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            amount: item.quantity,
                            type: item.type
                        }
                    } as ItemListInfo));

                    this.setState({ items });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };


    render() {
         //TABLE INFORMATION
         const Header: ItemListHeader[] = [
            { Title: "ID.", Value: "id" },
            { Title: "Product", Value: "product"},
            { 
                Title: "Amount",
                Value: "amount", 
                Render: (header: ItemListHeader, item: ItemListInfo) => {

                    const colorStyle: string = (parseInt(item.Value[header.Value]) < 0) ? "red" : "green";

                    return <td scope="row" key={item.Value[header.Value]} style={{color: colorStyle, fontWeight: 'bold'}}>
                        {item.Value[header.Value]}
                    </td>;
                }
            },
            { Title: "Type", Value: "type" },
            { Title: "Date", Value: "date" }
        ];
        const { items } = this.state;

        return (
        <div>
            <ContentTitle Title={"History"} />

            <ItemList
            Header={Header}
            Items={items}
            />
        </div>
        );
    }
}

export default HistoryPage;