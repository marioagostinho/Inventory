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

class OrdersPageComponent extends Component<OrdersComponentProps, State> {
    private batchHistoryService: BatchHistoryService;

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

    componentDidMount() {
        this.fetchBatchHistoriesByType("ORDER_IN", "inItems");
        this.fetchBatchHistoriesByType("ORDER_OUT", "outItems");
    }

    fetchBatchHistoriesByType = (type: string, targetState: keyof State) => {
        this.batchHistoryService
            .GetBatchHistoriesByType(type as "string")
            .then((data) => {
                console.log(data);
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

                    const updatedState = {
                        [targetState]: items,
                        isOrderInListLoading: false,
                        isOrderOutListLoading: false
                    } as Pick<State, keyof State>;
              
                    this.setState(updatedState);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        //TABLE INFORMATION
        const Header: ItemListHeader[] = [
            { Title: "ID.", Value: "id", Props: { style:{fontWeight: 'bold'} } },
            { Title: "Product", Value: "product" },
            { 
                Title: "Amount",
                Value: "amount", 
                Render: (header: ItemListHeader, item: ItemListInfo) => {

                    const colorStyle: string = (parseInt(item.Value[header.Value]) < 0) ? "red" : "green";

                    return <td key={item.Value[header.Value]} style={{color: colorStyle, fontWeight: 'bold'}}>
                        {item.Value[header.Value]}
                    </td>;
                }
            },
            { Title: "Date", Value: "date" }
        ];
        const { inItems, outItems } = this.state;

        const { AddClick } = this.props;


        return (
            <div className='orders-content'>

                <ContentTitle 
                    Title={'Orders'}
                    AddClick={AddClick} />


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
                                <ItemList 
                                    Header={Header}
                                    Items={inItems} 
                                    NoItemsWarning="No orders in"
                                    IsLoading={this.state.isOrderInListLoading} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                <ItemList 
                                    Header={Header}
                                    Items={outItems} 
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

function OrdersPage() {
    const navigate = useNavigate();

    const AddClick = () => {
        navigate(`/orders/0`);
    };

    return <OrdersPageComponent AddClick={AddClick} />;
}

export default OrdersPage;