import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import BillingPage from './pages/BillingPage';
import HistoryPage from './pages/HistoryPage';
import OwnerPage from './pages/OwnerPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="py-3">
          <Routes>
            <Route path="/" element={<BillingPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/owner" element={<OwnerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
