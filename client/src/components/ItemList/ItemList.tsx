import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import './ItemList.css';

interface ItemListProps {
    MaxHeight?: string;
    CanAction: Boolean;
    Header: String[];
    Items: any[];
    EditClick?: (props: any) => void;
}

export default function ItemList({MaxHeight = '800px', CanAction, Header, Items, EditClick}: ItemListProps) {

    const handleEditClick = (props:any) => {
        if(EditClick) {
            EditClick(props);
        }
      };
    
    return (
        <div className='table-container' style={{maxHeight:MaxHeight}}>
            <table className="table">
                <thead>
                    <tr >
                        <th scope="col">ID.</th>
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
                                        <a className='pointer' onClick={() => handleEditClick(item.id)}>
                                        <FontAwesomeIcon icon={faPenToSquare} className='edit-icon'/>
                                        </a>
                                        <a className='pointer'>
                                        <FontAwesomeIcon icon={faTrashCan} className='delete-icon'/>
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