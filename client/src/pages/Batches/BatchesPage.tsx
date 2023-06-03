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
    isItemListLoading: boolean;
}

interface BatchesComponentProps {
    handleNavigation: (path: string) => void;
}

//Component
class BatchesPageComponent extends Component<BatchesComponentProps, BatchesComponentState> {
    private batchService: BatchService;

    //CONSTRUCTOR
    constructor(props: any) { 
        super(props); 

        this.state = {
            items: [],
            batchId: 0,
            batchName: '',
            isModalVisible: false,
            isItemListLoading: true
        }

        this.batchService = new BatchService();
    }

    //AFTER THE COMPONENT IS LOAD
    componentDidMount() {
        this.fetchBatches();
    }

    //SERVICES

    //Fecth all the batches
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
                            expirationDate: item.expirationDate,
                            batchState: item.batchState
                        }
                    } as ItemListInfo));

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

    //Delete batch by Id
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

    //ACTION

    //Delete batch by ID
    deleteAction = (id: number, name: string) => {
        this.setState({
            batchId: id,
            batchName: name,
            isModalVisible: true
        })
    }

    //Change delete modal visibility
    handleModalVisibility = (newVisibility: boolean) => {
        this.setState({
            isModalVisible: newVisibility
        });
    }

    render() {
        //Set batches list header
        const Header: ItemListHeader[] = [
            { Title: "ID.", Value: "id", Props: { style:{fontWeight: 'bold'} }},
            { Title: "Product", Value: "product" },
            { Title: "Quantity", Value: "quantity" },
            { 
                Title: "Expiration Date",
                Value: "expirationDate",
                Render: (header: ItemListHeader, item: ItemListInfo) => {
                    //Change letter color depending it state
                    
                    let colorStyle: string = 'black';

                    item.Value.batchState = item.Value.batchState.toLowerCase().replace('_', ' ');

                    switch(item.Value.batchState) {
                        case'fresh':
                            colorStyle = 'green';
                            break;
                        case 'expiring today':
                            colorStyle = '#ffcc33';
                            break;
                        case 'expired':
                            colorStyle = 'red';
                            break;
                        default:
                            console.error("Unknown state");
                            break;
                    }

                    return (
                        <td key={header.Value} style={{color: colorStyle, fontWeight: 'bold'}}>
                            {`${moment(item.Value[header.Value]).format('DD/MM/YYYY')} (${item.Value.batchState})`}
                        </td>
                    );
                }
            },
            {
                Title: "",
                Value: "",
                Render: (header: ItemListHeader, item: ItemListInfo) => {
                    //Add action buttons
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
                {/* Page Title */}
                <ContentTitle Title={'Batches'} />

                {/* Batches Table */}
                <ItemList
                    Header={Header}
                    Items={this.state.items}
                    NoItemsWarning='No batches available'
                    IsLoading={this.state.isItemListLoading} />

                {/* Delete Modal */}
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

//Function
function BatchesPage() {
    //Hook
    const navigate = useNavigate();

    //Redirect to /batch/{id} to edit
    const handleNavigation = (id:any) => {
        navigate(`/batches/${id}`);
    };

    return <BatchesPageComponent handleNavigation={handleNavigation} />;
}

export default BatchesPage;