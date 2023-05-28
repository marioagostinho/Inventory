import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import ItemList, { ItemListHeader, ItemListInfo } from '../../components/ItemList/ItemList';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import BatchService from '../../services/BatchService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';


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
                        Value: {
                            id: item.id,
                            product: item.product.name,
                            quantity: item.quantity,
                            expirationDate: moment(item.expirationDate).format('DD/MM/YYYY')
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
        const Header: ItemListHeader[] = [
            { Title: "ID", Value: "id" },
            { Title: "Product", Value: "product" },
            { Title: "Quantity", Value: "quantity" },
            { Title: "Expiration Date", Value: "expirationDate" },
            {
                Title: "",
                Value: "",
                Render: (header: ItemListHeader, item: ItemListInfo) => {
                    return (
                        <td key='actions'>
                            <div className='table-actions'>
                                <a className='pointer' href={`Batches/${item.Value.id}`}>
                                    <FontAwesomeIcon icon={faPenToSquare} className='edit-icon'/>
                                </a>
                                <a className='pointer'>
                                    <FontAwesomeIcon icon={faTrashCan} className='delete-icon'/>
                                </a>
                            </div>
                        </td>
                    );
                }
            }
        ];
        const { items } = this.state;

        const { EditClick } = this.props;

        return (
            <div className='batches-content'>
            <ContentTitle Title={'Batches'} />

            <ItemList
                Header={Header}
                Items={items}
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