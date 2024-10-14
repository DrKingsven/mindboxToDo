import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InfoTaskCard from './InfoTaskCard';
import '@testing-library/jest-dom';

describe('InfoTaskCard Component', () => {
    const mockGetTasks = jest.fn();
    const taskData = {
        id: 1,
        wording: 'Тестовая формулировка задачи',
        title: 'Тестовая задача',
        status: false,
        date: '14.10.2024, 10:10:15',
    };

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({}),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('корректно отображает информацию о задаче', () => {
        render(<InfoTaskCard dataInfo={taskData} getTasks={mockGetTasks} />);

        expect(screen.getByLabelText(/Дата/i)).toHaveValue(taskData.date);
        expect(screen.getByLabelText(/Заголовок задачи/i)).toHaveValue(taskData.title);
        expect(screen.getByLabelText(/Формулировка задачи/i)).toHaveValue(taskData.wording);
        expect(screen.getByText(/Статус: Активна/i)).toBeInTheDocument();
    });

    it('обновляет название и формулировку при изменении', () => {
        render(<InfoTaskCard dataInfo={taskData} getTasks={mockGetTasks} />);

        const titleInput = screen.getByLabelText(/Заголовок задачи/i);
        const wordingInput = screen.getByLabelText(/Формулировка задачи/i);

        fireEvent.change(titleInput, { target: { value: 'Новый заголовок' } });
        fireEvent.change(wordingInput, { target: { value: 'Новая формулировка' } });

        expect(titleInput).toHaveValue('Новый заголовок');
        expect(wordingInput).toHaveValue('Новая формулировка');
    });

    it('Обновляет задачи при нажатии кнопки сохранить', async () => {
        render(<InfoTaskCard dataInfo={taskData} getTasks={mockGetTasks} />);

        fireEvent.change(screen.getByLabelText(/Заголовок задачи/i), { target: { value: 'Новый заголовок' } });
        fireEvent.change(screen.getByLabelText(/Формулировка задачи/i), { target: { value: 'Новая формулировка' } });

        const saveButton = screen.getByRole('button', { name: /Сохранить/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:5001/tasks/${taskData.id}`,
                expect.objectContaining({
                    method: 'PATCH',
                })
            );
        });
    });
});
