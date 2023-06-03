import React, { Component } from 'react';

import ContentTitle from '../../components/ContentTitle/ContentTitle';
import ItemList, { ItemListHeader, ItemListInfo } from '../../components/ItemList/ItemList';
import BatchHistoryService from '../../services/BatchHistoryService';
import moment from 'moment';

interface State {
    items: [];
    isItemListLoading: boolean;
}

class HistoryPage extends Component<{}, State> {
    private batchHistoryService: BatchHistoryService;

    //CONTRUCTOR
    constructor(props: any) {
        super(props);

        this.state = {
            items: [],
            isItemListLoading: true
        }

        this.batchHistoryService = new BatchHistoryService();
    }

    //AFTER THE COMPONENT IS LOAD
    componentDidMount() {
        this.fetchBatchHistories();
    }

    //SERVICES

    //Fecth all the batchHistories
    fetchBatchHistories = () => {
        this.batchHistoryService
            .GetBatchHistories()
            .then((data) => {
                if (data && data.batchHistories) {
                    const items = data.batchHistories.map((item: any) => ({
                        Value: {
                            id: item.id,
                            product: `${item.batch.product.name} (#${item.batch.id})`,
                            date: moment(item.date).format('DD/MM/YYYY HH:mm'),
                            amount: item.quantity,
                            type: item.type,
                            comment: item.comment
                        }
                    } as ItemListInfo));

                    //Update items array and isItemListLoading state
                    this.setState({ 
                        items,
                        isItemListLoading: false
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
         //Set batch histories list header
         const Header: ItemListHeader[] = [
            { Title: "ID.", Value: "id", Props: { style:{fontWeight: 'bold'} } },
            { Title: "Product", Value: "product"},
            { 
                Title: "Amount",
                Value: "amount", 
                Render: (header: ItemListHeader, item: ItemListInfo) => {

                    let colorStyle: string = 'red';
                    let titleQuantity: string = item.Value[header.Value];

                    if(parseInt(item.Value[header.Value]) > 0) {
                        colorStyle = 'green';
                        titleQuantity = `+${item.Value[header.Value]}`;
                    }

                    return <td key={item.Value[header.Value]} style={{color: colorStyle, fontWeight: 'bold'}}>
                        {titleQuantity}
                    </td>;
                }
            },
            { Title: "Type", Value: "type" },
            { Title: "Date", Value: "date" },
            { 
                Title: "Comment",
                Value: "comment", 
                Props: {style:{overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', maxWidth:'350px'}}
            }
        ];

        return (
        <div>
            {/* Page Title */}
            <ContentTitle Title={"History"} />

            {/* Batch Histories list */}
            <ItemList
                Header={Header}
                Items={this.state.items}
                NoItemsWarning='No history available' 
                IsLoading={this.state.isItemListLoading}/>
        </div>
        );
    }
}

export default HistoryPage;