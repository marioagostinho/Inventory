import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

import ItemList from '../../components/ItemList/ItemList';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import BatchService from '../../services/BatchService';
import moment from 'moment';


interface BatchesComponentProps {
    EditClick: (path: string) => void;
}

interface State {
    items: any[];
}

class BatchesPageComponent extends Component<BatchesComponentProps, State> {
    private batchService: BatchService;

    constructor(props: any) { 
        super(props); 

        this.state = {
            items: []
        }

        this.batchService = new BatchService();
    }

    componentDidMount() {
        this.fetchBatches();
    }

    fetchBatches = () => {
        this.batchService
            .GetBatches()
            .then((data) => {
                if (data && data.batches) {
                    const items = data.batches.map((item: any) => ({
                        id: item.id,
                        product: item.product.name,
                        quantity: item.quantity,
                        expirationDate: moment(item.expirationDate).format('DD/MM/YYYY')
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
        const Header = ['Product', 'Quantity', 'Expiration Date'];

        const { EditClick } = this.props;

        return (
            <div className='batches-content'>
            <ContentTitle Title={'Batches'} />

            <ItemList
                CanAction={true}
                Header={Header}
                Items={items}
                EditClick={EditClick}
            />
            </div>
        );
    }
}

function BatchesPage() {
    const navigate = useNavigate();

    const EditClick = (id:any) => {
        navigate(`/batches/${id}`);
    };

    return <BatchesPageComponent EditClick={EditClick} />;
}

export default BatchesPage;