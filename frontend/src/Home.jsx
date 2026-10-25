import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function FolderIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.5 6.75A1.75 1.75 0 0 1 5.25 5h4.1l1.8 2h7.6a1.75 1.75 0 0 1 1.75 1.75v8.5A1.75 1.75 0 0 1 18.75 19h-13a1.75 1.75 0 0 1-1.75-1.75z" />
            <path d="M4 9h16" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />
        </svg>
    );
}

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const navigate = useNavigate();
    const API_URL = 'http://127.0.0.1:8000/api';

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get(`${API_URL}/projects`);
            setProjects(res.data);
        } catch (error) {
            alert('Gagal memuat daftar project: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/projects`, { name: newProjectName.trim() });
            setNewProjectName('');
            await fetchProjects();
        } catch (error) {
            alert('Gagal membuat project: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Hapus project ini beserta seluruh data kriteria dan nilainya?')) {
            try {
                await axios.delete(`${API_URL}/projects/${id}`);
                await fetchProjects();
            } catch (error) {
                alert('Gagal menghapus project: ' + (error.response?.data?.detail || error.message));
            }
        }
    };

    return (
        <section className="home-dashboard">
            <div className="home-heading">
                <div>
                    <span className="eyebrow">WORKSPACE</span>
                    <h1>Manajemen Studi Kasus</h1>
                    <p>Atur proyek pengambilan keputusan Anda dan lanjutkan analisis dari satu ruang kerja.</p>
                </div>
                <div className="project-count">
                    <span className="project-count-value">{projects.length}</span>
                    <span>Project</span>
                </div>
            </div>

            <form className="create-project-form" onSubmit={handleCreateProject}>
                <span className="create-project-icon" aria-hidden="true">＋</span>
                <input
                    type="text"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    placeholder="Masukkan nama studi kasus baru..."
                    aria-label="Nama studi kasus baru"
                    required
                />
                <button type="submit">Buat Project Baru</button>
            </form>

            {projects.length ? (
                <div className="project-grid">
                    {projects.map(project => (
                        <article className="project-card" key={project.id}>
                            <div className="project-card-top">
                                <span className="project-icon"><FolderIcon /></span>
                                <button
                                    className="project-delete"
                                    type="button"
                                    onClick={() => handleDeleteProject(project.id)}
                                    aria-label={`Hapus project ${project.name}`}
                                    title="Hapus project"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                            <h2>{project.name}</h2>
                            <p className="project-meta">Studi kasus <span>•</span> Project #{project.id}</p>
                            <p className="project-date">
                                {project.created_at
                                    ? `Dibuat ${new Date(project.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                    : 'Tanggal pembuatan tidak tersedia'}
                            </p>
                            <button
                                className="open-workspace"
                                type="button"
                                onClick={() => navigate(`/project/${project.id}/data`)}
                            >
                                Buka Workspace <span aria-hidden="true">→</span>
                            </button>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="empty-projects">
                    <span aria-hidden="true">✦</span>
                    <h2>Belum ada project</h2>
                    <p>Buat project pertama untuk mulai menambahkan kriteria dan alternatif.</p>
                </div>
            )}
        </section>
    );
}
