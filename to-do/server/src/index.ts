import cors from 'cors';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export interface Task {
    id: number;
    wording: string;
    title: string;
    status: boolean;
    date: string;
}

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let tasks: Task[] = [];

const addTask = (wording: string, title: string): Task => {
    const newTask: Task = {
        id: tasks.length + 1,
        wording,
        title,
        status: false,
        date: new Date().toLocaleString(),
    };

    tasks.push(newTask);
    saveTasksToFile(); 

    return newTask; 
};

const saveTasksToFile = () => {
    const filePath = path.join(__dirname, 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
};

const loadTasksFromFile = () => {
    const filePath = path.join(__dirname, 'data.json');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        tasks = JSON.parse(data);
    }
};

loadTasksFromFile();

app.get('/tasks', (req: Request, res: Response) => {
    res.status(200).json(tasks);
});

app.post('/tasks', (req: Request, res: Response) => {
    const { wording, title } = req.body;
    if (!wording || !title) {
        return res.status(400).json({ message: 'wording and title are required' });
    }

    const newTask = addTask(wording, title);
    return res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { wording, title, status } = req.body;

    const taskIndex = tasks.findIndex(task => task.id === Number(id));

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Задача не найдена' });
    }

    if (wording !== undefined) {
        tasks[taskIndex].wording = wording;
    }
    if (title !== undefined) {
        tasks[taskIndex].title = title;
    }
    if (status !== undefined) {
        tasks[taskIndex].status = status;
    }

    saveTasksToFile();

    return res.status(200).json(tasks[taskIndex]);
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === Number(id));

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Задача не найдена' });
    }

    tasks.splice(taskIndex, 1); 
    saveTasksToFile(); 

    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
