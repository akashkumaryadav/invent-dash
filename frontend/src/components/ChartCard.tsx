import { useMemo, useState } from 'react';
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

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';
export type ChartMode = 'allCategories' | 'selectedCategories';

export type ChartConfig = {
  id: string;
  title: string;
  type: ChartType;
  mode: ChartMode;
  categories: string[]; // used when mode === 'selectedCategories'
};

type Props = {
  config: ChartConfig;
  onChange: (patch: Partial<ChartConfig>) => void;
  onRemove: () => void;
};

export default function ChartCard({ config, onChange, onRemove }: Props) {
  const items = useAppSelector((s) => s.items.items);
  const [editing, setEditing] = useState(false);

  const allCategories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items]
  );

  const activeCategories = useMemo(() => {
    if (config.mode === 'selectedCategories') return config.categories;
    return allCategories;
  }, [config.mode, config.categories, allCategories]);

  const { data, options } = useMemo(() => {
    // aggregate quantity per category
    const map = new Map<string, number>();
    for (const it of items) {
      if (activeCategories.length && !activeCategories.includes(it.category)) continue;
      map.set(it.category, (map.get(it.category) || 0) + it.quantity);
    }
    const labels = Array.from(map.keys());
    const values = Array.from(map.values());

    const palette = [
      '#7db4ff', '#7cf3ff', '#a3e635', '#fbbf24', '#fb7185', '#c084fc', '#60a5fa', '#34d399',
      '#f472b6', '#93c5fd', '#fde047', '#86efac'
    ];

    let chartData: ChartData<'bar' | 'line' | 'pie' | 'doughnut'>;
    let chartOptions: ChartOptions<'bar' | 'line' | 'pie' | 'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' as const }, title: { display: false, text: '' } },
    };

    if (config.type === 'pie' || config.type === 'doughnut') {
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
    } else if (config.type === 'line') {
      chartData = {
        labels,
        datasets: [
          {
            label: 'Quantity per Category',
            data: values,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.25)',
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
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          },
        ],
      };
      chartOptions = {
        ...chartOptions,
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
      } as ChartOptions<'bar'>;
    }

    return { data: chartData, options: chartOptions };
  }, [items, config.type, activeCategories]);

  const toggleCategory = (c: string) => {
    const list = config.categories.includes(c)
      ? config.categories.filter((x) => x !== c)
      : [...config.categories, c];
    onChange({ categories: list });
  };

  return (
    <div className="panel" style={{ minHeight: 220 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <strong>{config.title}</strong>
        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <select
            className="input"
            value={config.type}
            onChange={(e) => onChange({ type: e.target.value as ChartType })}
            aria-label="Chart type"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
          </select>
          <button className="btn" onClick={() => setEditing((v) => !v)}>{editing ? 'Hide' : 'Edit'}</button>
          <button className="btn danger" onClick={onRemove}>Remove</button>
        </div>
      </div>

      {editing && (
        <div style={{ margin: '8px 0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="input"
            value={config.title}
            onChange={(e) => onChange({ title: e.target.value })}
            aria-label="Chart title"
          />
          <select
            className="input"
            value={config.mode}
            onChange={(e) => onChange({ mode: e.target.value as ChartMode })}
            aria-label="Chart mode"
          >
            <option value="allCategories">All categories</option>
            <option value="selectedCategories">Selected categories</option>
          </select>
          {config.mode === 'selectedCategories' && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {allCategories.map((c) => (
                <label key={c} className="btn" style={{ display: 'inline-flex', gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={config.categories.includes(c)}
                    onChange={() => toggleCategory(c)}
                    style={{ marginRight: 6 }}
                  />
                  {c}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="chart-area">
        {config.type === 'bar' && (
          <Bar data={data as ChartData<'bar'>} options={options as ChartOptions<'bar'>} />
        )}
        {config.type === 'line' && (
          <Line data={data as ChartData<'line'>} options={options as ChartOptions<'line'>} />
        )}
        {config.type === 'pie' && (
          <Pie data={data as ChartData<'pie'>} options={options as ChartOptions<'pie'>} />
        )}
        {config.type === 'doughnut' && (
          <Doughnut data={data as ChartData<'doughnut'>} options={options as ChartOptions<'doughnut'>} />
        )}
      </div>
    </div>
  );
}
