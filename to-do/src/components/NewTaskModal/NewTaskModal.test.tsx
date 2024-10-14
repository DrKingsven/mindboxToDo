import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewTaskModal from './NewTaskModal';

global.fetch = jest.fn();

const mockGetTasks = jest.fn();

describe('Компонент NewTaskModal', () => {
    let consoleErrorMock: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockClear();
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorMock.mockRestore();
    });

    it('вызывает getTasks и закрывает модальное окно при успешном создании задачи', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        render(<NewTaskModal getTasks={mockGetTasks} />);

        fireEvent.click(screen.getByRole('button', { name: /новая задача/i }));

        fireEvent.change(screen.getByLabelText(/заголовок/i), { target: { value: 'Тестовая задача' } });
        fireEvent.change(screen.getByLabelText(/формулировка задачи/i), { target: { value: 'Описание задачи' } });

        fireEvent.click(screen.getByRole('button', { name: /создать/i }));

        await waitFor(() => {
            expect(mockGetTasks).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        expect(screen.queryByRole('dialog')).toBeNull();
    });
});
