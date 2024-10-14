import { Button, Card, Dropdown, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import style from './TaskList.module.scss';
import InfoTaskCard from '../InfoTaskCard/InfoTaskCard';
import { useState } from 'react';

interface TTask {
  id: number;
  wording: string;
  title: string;
  status: boolean;
  date: string;
}

interface TaskListProps {
  tasks: TTask[];
  getTasks: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, getTasks }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === null || (filter === 'active' ? !task.status : task.status);
    return matchesSearch && matchesFilter;
  });

  return (
    <Card className={style.cardList}>
      <Card.Body>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
          <Row>
            <Col sm={4}>
              <ListGroup className={style.list}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className={style.filter} id="dropdown-custom-1">Фильтр</Dropdown.Toggle>
                    <Dropdown.Menu >
                      <Dropdown.Item onClick={() => setFilter(null)}>Все</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilter('active')}>Активные</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilter('completed')}>Выполненные</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Form.Control
                    value={search}
                    onChange={handleSearchChange}
                    className={style.search}
                    type="text"
                    placeholder="Поиск"
                  />
                  <Button onClick={() => setSearch('')} variant="light" className={style.searchButton}>
                    🧹
                  </Button>
                  <Button variant="light" className={style.searchButton}>
                    🔎
                  </Button>
                </div>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <ListGroup.Item action href={`#${task.id}`} key={task.id}>
                      {task.status ? '✅' : null} {task.title}
                    </ListGroup.Item>
                  ))
                ) : (
                  <h2 className={style.nullTask}>Создайте задачу 📋</h2>
                )}
              </ListGroup>
            </Col>

            <Col sm={8}>
              <Tab.Content>
                {tasks.map(task => (
                  <Tab.Pane eventKey={`#${task.id}`} key={task.id}>
                    <InfoTaskCard dataInfo={task} getTasks={getTasks} />
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default TaskList;
