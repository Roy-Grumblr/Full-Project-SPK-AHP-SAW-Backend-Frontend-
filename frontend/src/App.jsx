import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from './Home';
import DataStudio from './DataStudio';
import AhpMatrix from './AhpMatrix';
import SawAnalysis from './SawAnalysis';
import Materi from './Materi';
import './App.css';

function Layout({ children }) {
  const location = useLocation();
  const projectId = location.pathname.split('/')[2];
  const isWorkspace = location.pathname.includes('/project/');

  return (
    <div className="app-shell">
      <header className="app-navbar">
        <Link to="/" className="brand-mark" aria-label="CineDecision, beranda">
          <span className="brand-symbol">✦</span>
          <span className="brand-name">Cine<span>Decision</span></span>
        </Link>

        <nav className="nav-pills" aria-label="Navigasi utama">
          <NavLink to="/" end className={({ isActive }) => `nav-pill${isActive ? ' is-active' : ''}`}>
            <span aria-hidden="true">⌂</span> Beranda
          </NavLink>
          <NavLink to="/materi" className={({ isActive }) => `nav-pill${isActive ? ' is-active' : ''}`}>
            <span aria-hidden="true">▤</span> Modul Akademik
          </NavLink>
        </nav>

        {isWorkspace && (
          <nav className="workspace-pills" aria-label="Navigasi ruang kerja">
            <NavLink to={`/project/${projectId}/data`} className={({ isActive }) => `nav-pill${isActive ? ' is-active' : ''}`}>Data & ETL</NavLink>
            <NavLink to={`/project/${projectId}/ahp`} className={({ isActive }) => `nav-pill${isActive ? ' is-active' : ''}`}>Bobot AHP</NavLink>
            <NavLink to={`/project/${projectId}/saw`} className={({ isActive }) => `nav-pill${isActive ? ' is-active' : ''}`}>Peringkat SAW</NavLink>
          </nav>
        )}

        <div className="user-avatar" title="Profil pengguna" aria-label="Profil pengguna">U</div>
      </header>

      <main className="app-content">{children}</main>
      <footer className="app-footer">Copyright &copy; 2026 Ahmad Fauzi. Hak Cipta Dilindungi Undang-Undang.</footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materi" element={<Materi />} />
          <Route path="/project/:id/data" element={<DataStudio />} />
          <Route path="/project/:id/ahp" element={<AhpMatrix />} />
          <Route path="/project/:id/saw" element={<SawAnalysis />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
