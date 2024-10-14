import { render, screen, waitFor } from '@testing-library/react';
import Main from './Main';
import TaskList from '../TaskList/TaskList';
import TaskNavbar from '../TaskNavbar/TaskNavbar';

jest.mock('../TaskList/TaskList');
jest.mock('../TaskNavbar/TaskNavbar');

describe('Основной компонент', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('визуализирует компоненты панели навигации и списка задач', () => {
        render(<Main />);

        expect(TaskNavbar).toHaveBeenCalled();
        expect(TaskList).toHaveBeenCalled();
    });

    it('вызывает getTasks на монтировании', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        ) as jest.Mock;

        render(<Main />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5001/tasks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    });

    it('отображает задачи в списке задач', async () => {
        const mockTasks = [
            { id: 1, wording: 'Тест 1', title: 'Тест 1', status: false, date: '14.10.2024, 10:09:57' },
            { id: 2, wording: 'Тест 2', title: 'Тест 2', status: false, date: '14.10.2024, 10:10:07' },
            { id: 3, wording: 'Тест 3', title: 'Тест 3', status: false, date: '14.10.2024, 10:10:11' },
            { id: 4, wording: 'Тест 4', title: 'Тест 4', status: false, date: '14.10.2024, 10:10:15' },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockTasks),
            })
        ) as jest.Mock;

        render(<Main />);

        await waitFor(() => {
            expect(TaskList).toHaveBeenCalledWith(
                expect.objectContaining({ tasks: mockTasks }),
                {}
            );
        });
    });

    it('обрабатывает ошибку выборки', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Ошибка сети'))
        ) as jest.Mock;

        console.error = jest.fn();

        render(<Main />);

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                'Ошибка при получении задач:',
                expect.any(Error)
            );
        });
    });
});
