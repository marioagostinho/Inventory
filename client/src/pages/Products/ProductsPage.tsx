import React, { Component, useState } from 'react'

import { Button, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import ItemList, { ItemListHeader, ItemListInfo } from '../../components/ItemList/ItemList';
import ProductService from '../../services/ProductService';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import { useNavigate } from 'react-router-dom';

interface State {
    open: boolean;
    items: any[];
}

interface ProductsComponentProps {
    AddClick: () => void;
}


class ProductsPageComponent extends Component<ProductsComponentProps, State> {
    private productService: ProductService;

    item: ItemListInfo = {
        Value: []
    };

    //Construct 
    constructor(props: any) {
        super(props);

        this.state = {
            open: false,
            items: []
        };

        this.productService = new ProductService();
    }

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = () => {
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

    onAction = (newItem: ItemListInfo) => {
        this.item = newItem;
    }

    render() {
        const { items } = this.state;
        const { AddClick } = this.props;

        const Header: ItemListHeader[] = [
            { Title: "ID", Value: "id", Sort: true },
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
                                <a className='pointer'>
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
                Items={items}
             />
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