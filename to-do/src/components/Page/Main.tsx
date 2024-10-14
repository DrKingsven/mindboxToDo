import { useEffect, useState } from "react";
import TaskList from "../TaskList/TaskList"
import TaskNavbar from "../TaskNavbar/TaskNavbar"


function Main() {
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    getTasks();
  }, []);


  function getTasks() {
    fetch('http://localhost:5001/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        return response.json();
      })
      .then(data => {
        setTasks(data);
      })
      .catch(error => {
        console.error('Ошибка при получении задач:', error);
      });
  }

  return (
    <div>
      <TaskNavbar getTasks={getTasks} />
      <TaskList tasks={tasks} getTasks={getTasks} />
    </div>
  )
}

export default Main
