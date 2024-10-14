import { render, screen } from '@testing-library/react';
import TaskNavbar from './TaskNavbar';
import NewTaskModal from '../NewTaskModal/NewTaskModal';

jest.mock('../NewTaskModal/NewTaskModal');

describe('TaskNavbar Component', () => {
    const mockGetTasks = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('отображает навигационную панель с правильным заголовком', () => {
        render(<TaskNavbar getTasks={mockGetTasks} />);

        expect(screen.getByText(/todos/i)).toBeInTheDocument();
    });

    it('визуализирует новый модальный компонент задачи с корректными реквизитами', () => {
        render(<TaskNavbar getTasks={mockGetTasks} />);

        expect(NewTaskModal).toHaveBeenCalledWith(
            expect.objectContaining({ getTasks: mockGetTasks }),
            {}
        );
    });

    it('отображает панель навигации.Переключение и панель навигации', () => {
        render(<TaskNavbar getTasks={mockGetTasks} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
});
