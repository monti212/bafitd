import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BaFitDPage from './pages/BaFitDPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaFitDPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
