import React, { Component } from 'react';

import ContentTitle from '../../components/ContentTitle/ContentTitle';
import ItemList from '../../components/ItemList/ItemList';
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
                        id: item.id,
                        product: `${item.batch.product.name} (#${item.batch.id})`,
                        date: moment(item.date).format('DD/MM/YYYY'),
                        amount: item.quantity,
                        type: item.type
                    }));

                    this.setState({ items });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };


    render() {
        const { items } = this.state;
        const Header = ["Product", "Date", "Amount", "Type"];

        return (
        <div>
            <ContentTitle Title={"History"} />

            <ItemList
            CanAction={false}
            Header={Header}
            Items={items}
            />
        </div>
        );
    }
}

export default HistoryPage;