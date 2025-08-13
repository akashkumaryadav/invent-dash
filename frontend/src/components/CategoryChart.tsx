import { useMemo } from 'react';
import { useAppSelector } from '../hooks';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type Props = { type: 'bar' | 'line' | 'pie' | 'doughnut' };

export default function CategoryChart({ type }: Props) {
  const items = useAppSelector((s) => s.items.items);

  const { data, options } = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      map.set(it.category, (map.get(it.category) || 0) + it.quantity);
    }
    const labels = Array.from(map.keys());
    const values = Array.from(map.values());
    const palette = [
      '#7db4ff', '#7cf3ff', '#a3e635', '#fbbf24', '#fb7185', '#c084fc', '#60a5fa', '#34d399'
    ];

    let chartData: ChartData<'bar' | 'line' | 'pie' | 'doughnut'>;
    let chartOptions: ChartOptions<'bar' | 'line' | 'pie' | 'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' as const }, title: { display: false, text: '' } },
    };

    if (type === 'pie' || type === 'doughnut') {
      chartData = {
        labels,
        datasets: [
          {
            label: 'Quantity per Category',
            data: values,
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
            borderColor: 'transparent',
          },
        ],
      };
    } else if (type === 'line') {
      chartData = {
        labels,
        datasets: [
          {
            label: 'Quantity per Category',
            data: values,
            borderColor: 'rgba(75, 192, 192, 0.9)',
            backgroundColor: 'rgba(75, 192, 192, 0.3)',
            fill: true,
            tension: 0.3,
          },
        ],
      };
      chartOptions = {
        ...chartOptions,
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
      } as ChartOptions<'line'>;
    } else {
      // bar
      chartData = {
        labels,
        datasets: [
          {
            label: 'Quantity per Category',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
        ],
      };
      chartOptions = {
        ...chartOptions,
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
      } as ChartOptions<'bar'>;
    }

    return { data: chartData, options: chartOptions };
  }, [items, type]);

  return (
    <div className="chart-container">
      <h2>Analytics</h2>
      <div className="chart-area">
        {type === 'bar' && (
          <Bar data={data as ChartData<'bar'>} options={options as ChartOptions<'bar'>} />
        )}
        {type === 'line' && (
          <Line data={data as ChartData<'line'>} options={options as ChartOptions<'line'>} />
        )}
        {type === 'pie' && (
          <Pie data={data as ChartData<'pie'>} options={options as ChartOptions<'pie'>} />
        )}
        {type === 'doughnut' && (
          <Doughnut
            data={data as ChartData<'doughnut'>}
            options={options as ChartOptions<'doughnut'>}
          />
        )}
      </div>
    </div>
  );
}
