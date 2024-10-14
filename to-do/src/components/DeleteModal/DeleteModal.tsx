import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './DeleteModal.module.scss'


interface ComponentProps {
    id: number;
    getTasks: () => void;
}

const DeleteModal = ({ id, getTasks }: ComponentProps) => {
    const [show, setShow] = useState(false);

    const handleClose = () => deleteTask();
    const handleShow = () => setShow(true);

    function deleteTask() {
        fetch(`http://localhost:5001/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                getTasks();
                setShow(false)
            })
            .catch(error => {
                console.error('Ошибка при удалении задачи:', error);
            })

    }

    return (
        <>

            <Button variant="danger" className={style.delButton} onClick={handleShow}>
                Удалить
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Удалить</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены что хотите удалить задачу?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteModal;