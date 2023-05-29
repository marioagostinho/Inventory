import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import ItemList, { ItemListHeader, ItemListInfo } from '../../components/ItemList/ItemList';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import BatchService from '../../services/BatchService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '../../components/DeleteModal/DeleteModal';

interface BatchesComponentState {
    items: any[];
    batchId: number;
    batchName: string;
    isModalVisible: boolean;
}

interface BatchesComponentProps {
    handleNavigation: (path: string) => void;
}

class BatchesPageComponent extends Component<BatchesComponentProps, BatchesComponentState> {
    private batchService: BatchService;

    constructor(props: any) { 
        super(props); 

        this.state = {
            items: [],
            batchId: 0,
            batchName: '',
            isModalVisible: false
        }

        this.batchService = new BatchService();
    }

    componentDidMount() {
        this.fetchBatches();
    }

    private fetchBatches = () => {
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

    private DeleteBatchById = (id: number) => {
        this.batchService.DeleteBatchById(id)
             .then((data) => {
                var updatedItems = this.state.items.filter((item) => item.Value.id !== id);

                this.setState({
                    items: updatedItems,
                    isModalVisible: false
                });
             })
             .catch((error) => {
                 console.error(error);
             });
     };

    deleteAction = (id: number, name: string) => {
        this.setState({
            batchId: id,
            batchName: name,
            isModalVisible: true
        })
    }

    handleModalVisibility = (newVisibility: boolean) => {
        this.setState({
            isModalVisible: newVisibility
        });
    }

    render() {
        const Header: ItemListHeader[] = [
            { Title: "ID.", Value: "id", Props: { style:{fontWeight: 'bold'} }},
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
                                    <FontAwesomeIcon 
                                        icon={faTrashCan} 
                                        className='delete-icon'
                                        onClick={() => this.deleteAction(item.Value.id, `Batch #${item.Value.id}`)}/>
                                </a>
                            </div>
                        </td>
                    );
                }
            }
        ];

        return (
            <div className='batches-content'>
                <ContentTitle Title={'Batches'} />

                <ItemList
                    Header={Header}
                    Items={this.state.items}
                />

                <DeleteModal 
                    id={this.state.batchId}
                    name={this.state.batchName}
                    isVisible={this.state.isModalVisible} 
                    changeVisibility={this.handleModalVisibility}
                    deleteAction={this.DeleteBatchById}/>
            </div>
        );
    }
}

function BatchesPage() {
    const navigate = useNavigate();

    const handleNavigation = (id:any) => {
        navigate(`/batches/${id}`);
    };

    return <BatchesPageComponent handleNavigation={handleNavigation} />;
}

export default BatchesPage;