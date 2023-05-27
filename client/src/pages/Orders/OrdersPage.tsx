import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

import { Col, Nav, Row, Tab } from 'react-bootstrap';
import moment from 'moment';

import ItemList from '../../components/ItemList/ItemList';
import ContentTitle from '../../components/ContentTitle/ContentTitle';
import BatchHistoryService from '../../services/BatchHistoryService';

import './OrdersPage.css';

interface OrdersComponentProps {
    AddClick: () => void;
}

interface State {
    inItems: any[];
    outItems: any[];
}

class OrdersPageComponent extends Component<OrdersComponentProps, State> {
    private batchHistoryService: BatchHistoryService;

    constructor(props: any) {
        super(props);

        this.state = {
            inItems: [],
            outItems: []
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
                if (data && data.batchHistories) {
                    const items = data.batchHistories
                        .map((item: any) => ({
                            id: item.id,
                            product: item.batch.product.name,
                            amount: item.quantity,
                            date: moment(item.date).format('DD/MM/YYYY')
                    }));

                    const updatedState = {
                        [targetState]: items
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
        const Header = ["Product", "Amount", "Date"];
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
                                    CanAction={false}
                                    Header={Header}
                                    Items={inItems} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                <ItemList 
                                    CanAction={false}
                                    Header={Header}
                                    Items={outItems} />
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