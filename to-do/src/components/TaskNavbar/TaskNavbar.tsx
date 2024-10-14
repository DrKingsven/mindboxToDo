import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NewTaskModal from '../NewTaskModal/NewTaskModal';

interface TaskNavbarProps {
  getTasks: () => void;
}

const TaskNavbar: React.FC<TaskNavbarProps> = ({getTasks}) => {
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">TODOS</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <NewTaskModal getTasks={getTasks}/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TaskNavbar;