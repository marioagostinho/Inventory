import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import ItemList, { ItemListHeader, ItemListInfo } from '../../components/ItemList/ItemList';
import ProductService from '../../services/ProductService';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../components/DeleteModal/DeleteModal';

interface ProductsComponentState {
    open: boolean;
    items: any[];
    productId: number;
    productName: string;
    isModalVisible: boolean;
}

interface ProductsComponentProps {
    AddClick: () => void;
}


class ProductsPageComponent extends Component<ProductsComponentProps, ProductsComponentState> {
    private productService: ProductService;

    item: ItemListInfo = {
        Value: []
    };

    //Construct 
    constructor(props: any) {
        super(props);

        this.state = {
            open: false,
            items: [],
            productId: 0,
            productName: '',
            isModalVisible: false
        };

        this.productService = new ProductService();
    }

    componentDidMount() {
        this.fetchProducts();
    }

    private fetchProducts = () => {
        this.productService
        .GetProducts()
        .then((data) => {
            if (data && data.products) {
                const items = data.products.map((item: any) => ({
                    Value: {
                        id: item.id,
                        name: item.name
                    }
                } as ItemListInfo));

                this.setState({ items });
            }
        })
        .catch((error) => {
            console.error(error);
        });
    };

    private DeleteProductById = (id: number) => {
        this.productService.DeleteProductById(id)
             .then((data) => {
                console.log(data);

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

    onAction = (newItem: ItemListInfo) => {
        this.item = newItem;
    }

    deleteAction = (id: number, name: string) => {
        this.setState({
            productId: id,
            productName: name,
            isModalVisible: true
        });
    }

    handleModalVisibility = (newVisibility: boolean) => {
        this.setState({
            isModalVisible: newVisibility
        });
    }

    render() {
        const { AddClick } = this.props;

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

            <ContentTitle
                Title={'Product'}
                AddClick={AddClick}
            />

            {/* Products Table */}
            <ItemList
                Header={Header}
                Items={this.state.items}
             />

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

function ProductsPage() {
    const navigate = useNavigate();

    const AddClick = () => {
        navigate(`/products/0`);
    };

    return <ProductsPageComponent AddClick={AddClick} />;
}

export default ProductsPage;