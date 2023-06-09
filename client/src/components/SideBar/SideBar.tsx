import React from 'react'
import { useLocation } from "react-router-dom";

//Bootstrap and Font-awesome
import Image from 'react-bootstrap/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCartShopping, faClockRotateLeft, faHouse, faUtensils } from '@fortawesome/free-solid-svg-icons';

import "./SideBar.css"


export default function SideBar() {
    const root = useLocation().pathname.toLowerCase();
    const imagePath = window.location.origin + '/felfel-logo.png';

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <Image src={imagePath} />
                <h1>Inventory</h1>
            </div>
            <a href='/' className={root  === '/' ? 'selected' : ''}><FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>Home</a>
            <a href='/Products' className={root.includes('/products') ? 'selected' : ''}><FontAwesomeIcon icon={faUtensils}></FontAwesomeIcon>Products</a>
            <a href='/Orders' className={root.includes('/orders')  ? 'selected' : ''}><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>Orders</a>
            <a href='/Batches' className={root.includes('/batches')  ? 'selected' : ''}><FontAwesomeIcon icon={faBox}></FontAwesomeIcon>Batches</a>
            <a href='/History' className={root.includes('/history')  ? 'selected' : ''}><FontAwesomeIcon icon={faClockRotateLeft}></FontAwesomeIcon>History</a>
      </div>
    );
}