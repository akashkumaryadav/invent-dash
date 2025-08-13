import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../hooks';
import ChartCard, { ChartConfig, ChartType, ChartMode } from './ChartCard';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

type Props = {
  defaultType?: ChartType;
};

export default function ChartsBoard({ defaultType = 'bar' }: Props) {
  const items = useAppSelector((s) => s.items.items);

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category))).sort();
  }, [items]);

  const [configs, setConfigs] = useState<ChartConfig[]>(() => {
    const raw = localStorage.getItem('chartsBoard.configs');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ChartConfig[];
        return parsed;
      } catch {
        // ignore parse errors
      }
    }
    // default: one chart showing all categories
    return [
      { id: uid(), title: 'Analytics', type: defaultType, mode: 'allCategories', categories: [] },
    ];
  });

  useEffect(() => {
    localStorage.setItem('chartsBoard.configs', JSON.stringify(configs));
  }, [configs]);

  // add form state
  const [openAdd, setOpenAdd] = useState(false);
  const [title, setTitle] = useState('New Chart');
  const [type, setType] = useState<ChartType>(defaultType);
  const [mode, setMode] = useState<ChartMode>('allCategories');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  const toggleCat = (c: string) => {
    setSelectedCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const addChart = () => {
    const cfg: ChartConfig = {
      id: uid(),
      title: title || 'Chart',
      type,
      mode,
      categories: mode === 'selectedCategories' ? selectedCats : [],
    };
    setConfigs((prev) => [...prev, cfg]);
    // reset
    setTitle('New Chart');
    setType(defaultType);
    setMode('allCategories');
    setSelectedCats([]);
    setOpenAdd(false);
  };

  const updateChart = (id: string, patch: Partial<ChartConfig>) => {
    setConfigs((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const removeChart = (id: string) => {
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="chart-container">
      <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span>Analytics</span>
        <button className="btn" onClick={() => setOpenAdd((o) => !o)} aria-expanded={openAdd}>
          {openAdd ? 'Close' : 'Add chart'}
        </button>
      </h2>

      {openAdd && (
        <div className="toolbar" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <input
              className="input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select className="input" value={type} onChange={(e) => setType(e.target.value as ChartType)}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
              <option value="doughnut">Doughnut</option>
            </select>
            <select
              className="input"
              value={mode}
              onChange={(e) => setMode(e.target.value as ChartMode)}
            >
              <option value="allCategories">All categories</option>
              <option value="selectedCategories">Selected categories</option>
            </select>
            {mode === 'selectedCategories' && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {categories.map((c) => (
                  <label key={c} className="btn" style={{ display: 'inline-flex', gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(c)}
                      onChange={() => toggleCat(c)}
                      style={{ marginRight: 6 }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            )}
            <button className="btn primary" onClick={addChart} disabled={mode === 'selectedCategories' && selectedCats.length === 0}>
              Add
            </button>
          </div>
        </div>
      )}

      {/* Grid of charts */}
      <div className="chart-area" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {configs.map((cfg) => (
          <ChartCard
            key={cfg.id}
            config={cfg}
            onChange={(patch: Partial<ChartConfig>) => updateChart(cfg.id, patch)}
            onRemove={() => removeChart(cfg.id)}
          />
        ))}
      </div>
    </div>
  );
}
