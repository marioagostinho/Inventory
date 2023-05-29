import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import './DeleteModal.css';

interface DeleteModalProps {
    id: number;
    name: string;
    isVisible: boolean;
    changeVisibility: (newVisibility: boolean) => void;
    deleteAction: (id: number) => void;
}

class DeleteModal extends Component<DeleteModalProps> {

    constructor(props: DeleteModalProps) {
        super(props);
    }

    render() {
        return (
            <div className='DeleteModal'>
                <Modal
                    show={this.props.isVisible}
                    onHide={() => this.props.changeVisibility(false)}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#ff0000",}} />
                        Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure that you want to delete <b>{this.props.name}</b>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.changeVisibility(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => this.props.deleteAction(this.props.id)}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default DeleteModal;