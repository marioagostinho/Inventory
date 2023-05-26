import React from 'react';

import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import './ItemList.css';

interface ItemListProps {
    CanAction: Boolean,
    Header: String[],
    Items: any[]
}

export default function ItemList({CanAction, Header, Items}: ItemListProps) {
    return (
        <div>
            <table className="table">
                <thead>
                    <tr className="table-dark">
                        <th scope="col">#</th>
                        {
                            Header.map((header, index) => (
                                <th scope='col' key={index}>{header}</th>
                            ))
                        }
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                {
                    Items.map((item) => (
                        <tr key={item.id}>
                            {
                                Object.entries(item).map(([key, value]) => {
                                    if (key === "id") {
                                        return <th scope="row" key={key}>{value as String}</th>;
                                    } else {
                                        return <td scope="row" key={key}>{value as String}</td>;
                                    }
                                })
                            }
                            <td>
                            <div className='table-actions'>
                                {
                                    CanAction !== false &&
                                    <div>
                                        <a className='pointer'>
                                        <FontAwesomeIcon icon={faPenToSquare} className='edit-icon' />
                                        </a>
                                        <a className='pointer'>
                                        <FontAwesomeIcon icon={faTrashCan} className='delete-icon' />
                                        </a>
                                    </div>
                                }
                            </div>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}