import React from 'react'

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

import './ContentTitle.css';

interface ContentTitleProps {
    Title: String;
    AddClick?: () => void;
}

export default function ContentTitle({Title, AddClick}: ContentTitleProps) {

    const handleAddClick = () => {
        if(AddClick) {
            AddClick();
        }
      };

    return (
        <div className='Content-Title'>
            <div className='content-header'>
                <div className='header-left'>
                    <h1>{Title}</h1>
                </div>
                <div className='header-right'>
                    {
                        AddClick &&
                        <Button variant="success" onClick={handleAddClick}>
                                <FontAwesomeIcon icon={faPlus} />Add
                        </Button>
                    }
                </div>
            </div>
            <hr />
        </div>
    );
}