import { Button, Card, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { ChangeEvent, useState, useEffect } from 'react';
import style from './InfoTaskCard.module.scss';
import DeleteModal from '../DeleteModal/DeleteModal';

interface TaskInfo {
    id: number;
    wording: string;
    title: string;
    status: boolean;
    date: string;
}

interface ComponentProps {
    dataInfo: TaskInfo;
    getTasks: () => void;
}

const InfoTaskCard = ({ dataInfo, getTasks }: ComponentProps) => {
    const [actionTask, setActionTask] = useState<TaskInfo>(dataInfo);
    const buttonVariant = actionTask.status ? "success" : "secondary";
    const buttonTitle = `Статус: ${actionTask.status ? "Выполнена" : "Активна"}`;

    useEffect(() => {
        setActionTask(dataInfo);
    }, [dataInfo]);

    function patchTask() {
        fetch(`http://localhost:5001/tasks/${dataInfo.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actionTask),
        })
            .then(() => {
                getTasks();
            })
            .catch(error => {
                console.error('Ошибка при обновлении задачи:', error);
            });
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setActionTask(actionTask => ({ ...actionTask, [name]: value }));
    };

    return (
        <Card>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="task-date">
                        <Form.Label>Дата</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Дата задачи"
                            autoFocus
                            value={dataInfo.date}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="task-title">
                        <Form.Label>Заголовок задачи</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Заголовок задачи"
                            name="title"
                            value={actionTask.title}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="task-wording">
                        <Form.Label>Формулировка задачи</Form.Label>
                        <Form.Control
                            name="wording"
                            value={actionTask.wording}
                            onChange={handleChange}
                            as="textarea"
                            rows={3}
                        />
                    </Form.Group>
                    <Form.Group>
                        <DropdownButton variant={buttonVariant} id="dropdown-basic-button" title={buttonTitle}>
                            <Dropdown.Item onClick={() => setActionTask({ ...actionTask, status: false })}>Активна</Dropdown.Item>
                            <Dropdown.Item onClick={() => setActionTask({ ...actionTask, status: true })}>Выполнена</Dropdown.Item>
                        </DropdownButton>

                        <DeleteModal getTasks={getTasks} id={dataInfo.id} />
                        <Button
                            disabled={JSON.stringify(actionTask) === JSON.stringify(dataInfo)}
                            variant="warning"
                            onClick={patchTask}
                            className={style.saveButton}
                        >
                            Сохранить
                        </Button>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default InfoTaskCard;
