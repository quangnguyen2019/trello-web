import { Modal, Button } from 'react-bootstrap';

function ConfirmModal(props) {
    const { content, show, onAction } = props;

    return (
        <Modal 
            show={show} 
            onHide={onAction}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title className="h5"> Remove Column </Modal.Title>
            </Modal.Header>
            <Modal.Body> {content} </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onAction}> Close </Button>
                <Button variant="primary" onClick={() => onAction('remove')}>
                    Remove
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
  
export default ConfirmModal;