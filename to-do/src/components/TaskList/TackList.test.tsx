import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

describe('TaskList Component', () => {
    const mockGetTasks = jest.fn();
    const tasks = [
        { id: 1, wording: 'Описание задачи 1', title: 'Задача 1', status: true, date: '2024-01-01' },
        { id: 2, wording: 'Описание задачи 2', title: 'Задача 2', status: false, date: '2024-01-02' },
        { id: 3, wording: 'Описание задачи 3', title: 'Задача 3', status: true, date: '2024-01-03' },
    ];

    it('рендер задач', () => {
        render(<TaskList tasks={tasks} getTasks={mockGetTasks} />);

        expect(screen.getByText(/Задача 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Задача 2/i)).toBeInTheDocument();
        expect(screen.getByText(/Задача 3/i)).toBeInTheDocument();
    });

    it('отображает сообщение при отсутствии задач', () => {
        render(<TaskList tasks={[]} getTasks={mockGetTasks} />);

        expect(screen.getByText('Создайте задачу 📋')).toBeInTheDocument();
    });
});
