import React from 'react';

import { Spinner } from 'react-bootstrap';
import './ItemList.css';

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
    NoItemsWarning?: string;
    IsLoading?: boolean;
}

export default function ItemList({MaxHeight = '800px', Header, Items, NoItemsWarning = "Table empty...", IsLoading = false}: ItemListProps) {
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
                    Items.length > 0 && IsLoading === false &&
                    Items.map((item, itemIndex) => (
                        <tr key={item.Value.id.toString}>
                            {
                                Header.map((header, headerIndex) => {
                                    if (header.Render) {
                                        return header.Render(header, item);
                                    } else {
                                    return <td
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
                {
                    Items.length === 0 && IsLoading === false &&
                    <tr className='NoItemsWarning'>
                        <td colSpan={Header.length}>{NoItemsWarning}</td>
                    </tr>
                }
                {
                    IsLoading === true &&
                    <tr className='NoItemsWarning'>
                        <td colSpan={Header.length}>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </td>
                    </tr>
                }
                </tbody>
            </table>  
        </div>
    );
}