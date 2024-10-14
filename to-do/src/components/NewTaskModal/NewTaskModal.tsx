import React, { ChangeEvent, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface NewTaskModalProps {
    getTasks: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ getTasks }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    interface TTask {
        wording: string;
        title: string;
    }

    const [task, setTask] = useState<Partial<TTask>>({});



    function createTask() {
        fetch('http://localhost:5001/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        }).then(data => {
            getTasks();
            setShow(false);
        })
            .catch(error => {
                console.error('Ошибка при создании задачи:', error);
            });

    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setTask(task => ({ ...task, [name]: value }));
    };




    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Новая задача
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Новая задача</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Заголовок</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Заголовок задачи"
                                autoFocus
                                name="title"
                                value={task.title}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Формулировка задачи</Form.Label>
                            <Form.Control name="wording"
                                value={task.wording} onChange={handleChange}
                                as="textarea" rows={3} />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Назад
                    </Button>
                    <Button disabled={!Boolean(task.title?.length && task.wording?.length)} variant="primary" onClick={createTask}>Создать</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewTaskModal;