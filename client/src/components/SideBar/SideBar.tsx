import React from 'react'
import { useLocation } from "react-router-dom";

//Bootstrap and Font-awesome
import Image from 'react-bootstrap/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCartShopping, faHouse, faUtensils } from '@fortawesome/free-solid-svg-icons';

import "./SideBar.css"


export default function SideBar() {
    const root = useLocation().pathname;

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <Image src='./felfel-logo.png' />
                <h1>Inventory</h1>
            </div>
            <a href='/' className={root  === '/' ? 'selected' : ''}><FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>Home</a>
            <a href='/Products' className={root  === '/Products' ? 'selected' : ''}><FontAwesomeIcon icon={faUtensils}></FontAwesomeIcon>Products</a>
            <a href='/Batches' className={root  === '/Batches' ? 'selected' : ''}><FontAwesomeIcon icon={faBox}></FontAwesomeIcon>Batches</a>
            <a href='/Orders' className={root  === '/Orders' ? 'selected' : ''}><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>Orders</a>
      </div>
    );
}