import { Sidebar } from './components/editor/Sidebar';
import { LivePreview } from './components/preview/LivePreview';

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900">
      <Sidebar />
      <LivePreview />
    </div>
  );
}

export default App;
