import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import App from '../App';

vi.mock('../socket', () => ({ initSocket: () => ({ on: vi.fn() }) }));
vi.mock('react-chartjs-2', () => ({ Bar: () => <div>Chart</div> }));
vi.mock('../api/client', async () => {
  const actual = await vi.importActual<any>('../api/client');
  return {
    ...actual,
    fetchItems: vi.fn().mockResolvedValue([
      { id: '1', name: 'Widget', quantity: 5, category: 'A' },
    ]),
  };
});

describe('App', () => {
  it('renders dashboard and loads items', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/Real-Time Inventory Dashboard/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Widget')).toBeInTheDocument();
    });
  });
});
