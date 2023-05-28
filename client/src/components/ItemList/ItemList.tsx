import React, { useState } from 'react';

import './ItemList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import { Col, Form, Row } from 'react-bootstrap';

export interface ItemListHeader {
    Title: string;
    Value: string;
    Sort?: boolean;
    Render?: (header: ItemListHeader, value: ItemListInfo) => JSX.Element;
    Props?: any;
}

export interface ItemListInfo {
    Value: any;
    Props?: any;
}

interface ItemListProps {
    MaxHeight?: string;
    Header: ItemListHeader[];
    Items: ItemListInfo[];
    EditClick?: (props: any) => void;
}

export default function ItemList({MaxHeight = '800px', Header, Items, EditClick}: ItemListProps) {
    return (
        <div className='table-container' style={{maxHeight:MaxHeight}}>
            <table className="table">
                <thead>
                    <tr >
                        {
                            Header.map((header, index) => (
                                <th scope='col' key={index}>
                                    {header.Title}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    Items.map((item, itemIndex) => (
                        <tr key={item.Value.id}>
                            {
                                Header.map((header, headerIndex) => {
                                    if (header.Render) {
                                        return header.Render(header, item);
                                    } else {
                                    return <td scope="row"
                                        {...header.Props}
                                        {...item.Props}
                                        key={itemIndex.toString() + headerIndex.toString()}>
                                            {item.Value[header.Value] as String}
                                        </td>;
                                    }
                                })
                            }
                        </tr>
                    ))
                }
                </tbody>
            </table>  
        </div>
    );
}