import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import ItemList, { ItemListHeader, ItemListInfo } from '../../components/ItemList/ItemList';
import ProductService from '../../services/ProductService';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import DeleteModal from '../../components/DeleteModal/DeleteModal';

interface ProductsComponentState {
    open: boolean;
    items: any[];
    productId: number;
    productName: string;
    isModalVisible: boolean;
    isItemListLoading: boolean;
}

interface ProductsComponentProps {
    AddClick: () => void;
}

//Component
class ProductsPageComponent extends Component<ProductsComponentProps, ProductsComponentState> {
    private productService: ProductService;

    //CONTRUCTOR
    constructor(props: any) {
        super(props);

        this.state = {
            open: false,
            items: [],
            productId: 0,
            productName: '',
            isModalVisible: false,
            isItemListLoading: true
        };

        this.productService = new ProductService();
    }

    //AFTER THE COMPONENT IS LOAD
    componentDidMount() {
        this.fetchProducts();
    }

    //SERVICES

    //Fecth all the products
    private fetchProducts = () => {
        this.productService
        .GetProducts()
        .then((data) => {
            if (data && data.products) {
                //Data to items array
                const items = data.products.map((item: any) => ({
                    Value: {
                        id: item.id,
                        name: item.name
                    }
                } as ItemListInfo));

                //Set items and isItemListLoading state
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

    //Delete product by Id
    private DeleteProductById = (id: number) => {
        this.productService.DeleteProductById(id)
             .then((data) => {
                //Update items array by removing the item with the ID removed
                var updatedItems = this.state.items.filter((item) => item.Value.id !== id);

                //Set items and isModalVisible state
                this.setState({
                    items: updatedItems,
                    isModalVisible: false
                });
             })
             .catch((error) => {
                 console.error(error);
             });
    };

    //ACTIONS

    //Delete product by ID
    deleteAction = (id: number, name: string) => {
        this.setState({
            productId: id,
            productName: name,
            isModalVisible: true
        });
    }

    //Change delete modal visibility
    handleModalVisibility = (newVisibility: boolean) => {
        this.setState({
            isModalVisible: newVisibility
        });
    }

    render() {
        const { AddClick } = this.props;

        //Set product list header
        const Header: ItemListHeader[] = [
            { Title: "ID.", Value: "id", Props: { style:{fontWeight: 'bold'} } },
            { Title: "Name", Value: "name" },
            {
                Title: "",
                Value: "",
                Render: (header: ItemListHeader, item: ItemListInfo) => {
                    return (
                        <td key='actions'>
                            <div className='table-actions'>
                                <a className='pointer' href={`/products/${item.Value.id}`}>
                                    <FontAwesomeIcon icon={faPenToSquare} className='edit-icon'/>
                                </a>
                                <a className='pointer' onClick={() => this.deleteAction(item.Value.id, item.Value.name)}>
                                    <FontAwesomeIcon icon={faTrashCan} className='delete-icon'/>
                                </a>
                            </div>
                        </td>
                    );
                }
            }
        ];

        return (
        <div className='products-content'>
            {/* Page Title */}
            <ContentTitle
                Title={'Product'}
                AddClick={AddClick}
            />

            {/* Products Table */}
            <ItemList
                Header={Header}
                Items={this.state.items}
                NoItemsWarning="No products available" 
                IsLoading={this.state.isItemListLoading}/>

            {/* Delete Modal */}
            <DeleteModal 
                id={this.state.productId}
                name={this.state.productName}
                isVisible={this.state.isModalVisible} 
                changeVisibility={this.handleModalVisibility}
                deleteAction={this.DeleteProductById}/>

        </div>
        );
    }
}

//Function
function ProductsPage() {
    //Hooks
    const navigate = useNavigate();

    //Redirect to /products/0 to add a product
    const AddClick = () => {
        navigate(`/products/0`);
    };

    return <ProductsPageComponent AddClick={AddClick} />;
}

export default ProductsPage;