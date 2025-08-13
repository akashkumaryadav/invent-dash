import { useEffect, useMemo, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import CategoryChart from './components/CategoryChart';
import { useAppDispatch } from './hooks';
import { loadItems } from './slices/itemsSlice';
import { initSocket } from './socket';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadItems());
    initSocket(dispatch);
  }, [dispatch]);

  type Layout = 'side-by-side' | 'side-by-side-swapped' | 'stacked';
  const [layout, setLayout] = useState<Layout>(() => {
    const saved = localStorage.getItem('layout');
    return (saved as Layout) || 'side-by-side';
  });

  useEffect(() => {
    localStorage.setItem('layout', layout);
  }, [layout]);

  // theme
  const prefersDark = useMemo(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    []
  );
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    return saved || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // responsive: force stacked on small screens, preserve user choice otherwise
  const [isSmall, setIsSmall] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 720px)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const onChange = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    // initial sync
    setIsSmall(mq.matches);
    // subscribe
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    } else {
      // Safari fallback (deprecated addListener/removeListener)
      const legacyListener: (this: MediaQueryList, ev: MediaQueryListEvent) => void = (e) =>
        setIsSmall(e.matches);
      mq.addListener(legacyListener);
      return () => {
        mq.removeListener(legacyListener);
      };
    }
  }, []);

  const SideBySide = ({ swapped = false }: { swapped?: boolean }) => (
    <PanelGroup direction="horizontal" className="panel-group" autoSaveId="main-horizontal">
      <Panel minSize={20} defaultSize={60} className="panel">
        <div className="panel-body">
          {swapped ? <CategoryChart /> : <InventoryTable />}
        </div>
      </Panel>
      <PanelResizeHandle
        className="resize-handle resize-handle-vertical"
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        aria-label="Resize panels"
      />
      <Panel minSize={20} defaultSize={40} className="panel">
        <div className="panel-body">
          {swapped ? <InventoryTable /> : <CategoryChart />}
        </div>
      </Panel>
    </PanelGroup>
  );

  const Stacked = () => (
    <PanelGroup direction="vertical" className="panel-group" autoSaveId="main-vertical">
      <Panel minSize={25} defaultSize={60} className="panel">
        <div className="panel-body">
          <InventoryTable />
        </div>
      </Panel>
      <PanelResizeHandle
        className="resize-handle resize-handle-horizontal"
        role="separator"
        aria-orientation="horizontal"
        tabIndex={0}
        aria-label="Resize panels"
      />
      <Panel minSize={20} defaultSize={40} className="panel">
        <div className="panel-body">
          <CategoryChart />
        </div>
      </Panel>
    </PanelGroup>
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Real-Time Inventory Dashboard</h1>
        <div className="header-actions">
          <div className="layout-switcher" role="group" aria-label="Layout selector">
            <button
              className={layout === 'side-by-side' ? 'btn active' : 'btn'}
              onClick={() => setLayout('side-by-side')}
              title="Table left, Chart right"
            >
              Side-by-side
            </button>
            <button
              className={layout === 'side-by-side-swapped' ? 'btn active' : 'btn'}
              onClick={() => setLayout('side-by-side-swapped')}
              title="Chart left, Table right"
            >
              Swap
            </button>
            <button
              className={layout === 'stacked' ? 'btn active' : 'btn'}
              onClick={() => setLayout('stacked')}
              title="Table top, Chart bottom"
            >
              Stacked
            </button>
          </div>
          <button
            className="btn theme-toggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle light/dark theme"
            title="Toggle light/dark theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <section className="toolbar">
        <SearchBar />
        <AddItemForm />
      </section>

      <main className="workspace">
        {isSmall ? (
          <Stacked />
        ) : (
          <>
            {layout === 'side-by-side' && <SideBySide />}
            {layout === 'side-by-side-swapped' && <SideBySide swapped />}
            {layout === 'stacked' && <Stacked />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
