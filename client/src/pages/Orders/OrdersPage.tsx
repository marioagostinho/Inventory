import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

import { Col, Nav, Row, Tab } from 'react-bootstrap';
import moment from 'moment';

import ItemList, { ItemListHeader, ItemListInfo } from '../../components/ItemList/ItemList';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import BatchHistoryService from '../../services/BatchHistoryService';

import './OrdersPage.css';

interface OrdersComponentProps {
    AddClick: () => void;
}

interface State {
    inItems: any[];
    outItems: any[];
    isOrderInListLoading: boolean;
    isOrderOutListLoading: boolean;
}

//Component
class OrdersPageComponent extends Component<OrdersComponentProps, State> {
    private batchHistoryService: BatchHistoryService;

    //CONSTRUCTOR
    constructor(props: any) {
        super(props);

        this.state = {
            inItems: [],
            outItems: [],
            isOrderInListLoading: true,
            isOrderOutListLoading: true
        }

        this.batchHistoryService = new BatchHistoryService();
    }

    //AFTER THE COMPONENT IS LOAD
    componentDidMount() {
        this.fetchBatchHistoriesByType("ORDER_IN", "inItems");
        this.fetchBatchHistoriesByType("ORDER_OUT", "outItems");
    }

    //SERVICES

    //Fecth batch histories by it type
    fetchBatchHistoriesByType = (type: string, targetState: keyof State) => {
        this.batchHistoryService
            .GetBatchHistoriesByType(type as "string")
            .then((data) => { 
                if (data && data.batchHistories) {
                    const items = data.batchHistories
                        .map((item: any) => ({
                            Value: {
                                id: item.id,
                                product: item.batch.product.name,
                                amount: item.quantity,
                                date: moment(item.date).format('DD/MM/YYYY')
                            }
                    } as ItemListInfo));

                    //Object to update State because you can't update it directly with [targetState]
                    const updatedState = {
                        [targetState]: items,
                        isOrderInListLoading: false,
                        isOrderOutListLoading: false
                    } as Pick<State, keyof State>;
              
                    //Update state with new Batch Histories array type
                    this.setState(updatedState);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        //Set orders list header
        const Header: ItemListHeader[] = [
            { Title: "ID.", Value: "id", Props: { style:{fontWeight: 'bold'} } },
            { Title: "Product", Value: "product" },
            { 
                Title: "Amount",
                Value: "amount", 
                Render: (header: ItemListHeader, item: ItemListInfo) => {

                    const colorStyle: string = (parseInt(item.Value[header.Value]) < 0) ? "red" : "green";

                    return <td key={item.Value[header.Value].toString() + "rw"} style={{color: colorStyle, fontWeight: 'bold'}}>
                        {item.Value[header.Value]}
                    </td>;
                }
            },
            { Title: "Date", Value: "date" }
        ];

        const { AddClick } = this.props;

        return (
            <div className='orders-content'>

                {/* Page Title */}
                <ContentTitle 
                    Title={'Orders'}
                    AddClick={AddClick} />

                {/* Nav */}
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>
                        <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                            <Nav.Link eventKey="first">Orders In</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="second">Orders Out</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </Col>
                        <Col sm={10}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                {/* Orders in list */}
                                <ItemList 
                                    Header={Header}
                                    Items={this.state.inItems} 
                                    NoItemsWarning="No orders in"
                                    IsLoading={this.state.isOrderInListLoading} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                {/* Orders out list */}
                                <ItemList 
                                    Header={Header}
                                    Items={this.state.outItems} 
                                    NoItemsWarning="No orders out" 
                                    IsLoading={this.state.isOrderOutListLoading} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
}

//Function
function OrdersPage() {
    //Hook
    const navigate = useNavigate();

    //Redirect to /orders/0 to add an order
    const AddClick = () => {
        navigate(`/orders/0`);
    };

    return <OrdersPageComponent AddClick={AddClick} />;
}

export default OrdersPage;