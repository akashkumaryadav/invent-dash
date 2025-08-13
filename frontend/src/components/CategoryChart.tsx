import { useMemo } from 'react';
import { useAppSelector } from '../hooks';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CategoryChart() {
  const items = useAppSelector((s) => s.items.items);

  const data = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      map.set(it.category, (map.get(it.category) || 0) + it.quantity);
    }
    const labels = Array.from(map.keys());
    const values = Array.from(map.values());
    return {
      labels,
      datasets: [
        {
          label: 'Quantity per Category',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
  }, [items]);

  return (
    <div>
      <h2>Analytics</h2>
      <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </div>
  );
}
