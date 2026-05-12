import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BloodSugar from './pages/BloodSugar';
import Nutrition from './pages/Nutrition';
import Lifestyle from './pages/Lifestyle';
import Screening from './pages/Screening';
import HealthDiary from './pages/HealthDiary';
import Blog from './pages/Blog';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blood-sugar/*" element={<BloodSugar />} />
          <Route path="/nutrition/*" element={<Nutrition />} />
          <Route path="/lifestyle/*" element={<Lifestyle />} />
          <Route path="/screening/*" element={<Screening />} />
          <Route path="/health-diary/*" element={<HealthDiary />} />
          <Route path="/blog/*" element={<Blog />} />
        </Routes>
      </Layout>
    </Router>
  );
}
