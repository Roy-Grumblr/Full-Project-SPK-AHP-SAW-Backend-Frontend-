import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './SawAnalysis.css';

const API_URL = 'http://127.0.0.1:8000/api';

const medalForRank = {
    1: { icon: '♛', label: 'JUARA', modifier: 'first' },
    2: { icon: 'Ⅱ', label: 'RUNNER UP', modifier: 'second' },
    3: { icon: 'Ⅲ', label: 'PERINGKAT 3', modifier: 'third' },
};

function DownloadIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
        </svg>
    );
}

function formatScore(value) {
    const score = Number(value);
    return Number.isFinite(score) ? score.toFixed(4) : '0.0000';
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="custom-tooltip">
            <p className="tooltip-label">{`Alternatif: ${label}`}</p>
            <p className="tooltip-score">{`Skor: ${formatScore(payload[0].value)}`}</p>
        </div>
    );
}

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.number })),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default function SawAnalysis() {
    const { id } = useParams();
    const activeProjectId = Number.parseInt(id, 10);
    const [projectName, setProjectName] = useState('');
    const [normType, setNormType] = useState('linear');
    const [resultData, setResultData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!activeProjectId) return;

        axios.get(`${API_URL}/projects`)
            .then(res => {
                const currentProject = res.data.find(project => project.id === activeProjectId);
                if (currentProject) setProjectName(currentProject.name);
            })
            .catch(error => alert('Gagal memuat project: ' + (error.response?.data?.detail || error.message)));
    }, [activeProjectId]);

    const handleCalculateSAW = async () => {
        setIsLoading(true);
        setResultData([]);
        try {
            const res = await axios.get(`${API_URL}/saw/calculate/${activeProjectId}?norm_type=${normType}`);
            setColumns(res.data.columns);
            setResultData(res.data.data);
        } catch (error) {
            alert('Gagal memproses: ' + (error.response?.data?.detail || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportExcel = () => {
        if (resultData.length === 0) return alert('Belum ada data.');
        const worksheet = XLSX.utils.json_to_sheet(resultData);
        const columnWidths = columns.map(() => ({ wch: 15 }));
        if (columnWidths.length) columnWidths[0] = { wch: 25 };
        worksheet['!cols'] = columnWidths;
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil_SAW');
        XLSX.writeFile(workbook, `Laporan_SAW_${projectName || 'project'}.xlsx`);
    };

    const handleExportPDF = async () => {
        if (resultData.length === 0) return alert('Belum ada data untuk diunduh.');

        let PdfConstructor;
        let renderTable;
        try {
            const [{ jsPDF }, { autoTable }] = await Promise.all([
                import('jspdf'),
                import('jspdf-autotable'),
            ]);
            PdfConstructor = jsPDF;
            renderTable = autoTable;
        } catch (error) {
            alert('Gagal memuat fitur PDF: ' + error.message);
            return;
        }

        const pdf = new PdfConstructor({ orientation: columns.length > 5 ? 'landscape' : 'portrait' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pageWidth, 42, 'F');
        pdf.setTextColor(103, 232, 249);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('CINEDECISION  /  LAPORAN ANALISIS', 14, 14);
        pdf.setTextColor(248, 250, 252);
        pdf.setFontSize(18);
        pdf.text('Hasil Pemeringkatan SAW', 14, 25);
        pdf.setTextColor(203, 213, 225);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(`Project: ${projectName || `Project #${activeProjectId}`}`, 14, 34);
        pdf.text(`Normalisasi: ${normType.toUpperCase()}`, pageWidth - 14, 34, { align: 'right' });

        renderTable(pdf, {
            startY: 50,
            head: [columns],
            body: resultData.map(row => columns.map(column => {
                const value = row[column];
                return typeof value === 'number' && column !== 'Peringkat' ? formatScore(value) : (value ?? '-');
            })),
            theme: 'grid',
            styles: { font: 'helvetica', fontSize: 9, cellPadding: 3, textColor: [30, 41, 59], lineColor: [226, 232, 240] },
            headStyles: { fillColor: [30, 41, 59], textColor: [248, 250, 252], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [241, 245, 249] },
            didParseCell: data => {
                if (data.section === 'body' && Number(resultData[data.row.index]?.['Peringkat']) === 1) {
                    data.cell.styles.fillColor = [254, 243, 199];
                    data.cell.styles.textColor = [120, 53, 15];
                    data.cell.styles.fontStyle = 'bold';
                }
            },
        });

        const safeName = (projectName || `project-${activeProjectId}`).replace(/[\\/:*?"<>|]+/g, '-');
        pdf.save(`Laporan_SAW_${safeName}.pdf`);
    };

    const sortedResults = [...resultData].sort((a, b) => Number(a.Peringkat) - Number(b.Peringkat));
    const winner = sortedResults.find(row => Number(row.Peringkat) === 1);
    const podium = [
        { row: sortedResults.find(row => Number(row.Peringkat) === 2), rank: 2 },
        { row: winner, rank: 1 },
        { row: sortedResults.find(row => Number(row.Peringkat) === 3), rank: 3 },
    ].filter(place => place.row);

    return (
        <section className="saw-container animate-fade-in">
            <div className="saw-heading">
                <div>
                    <span className="saw-eyebrow">ANALISIS KEPUTUSAN</span>
                    <h1>Pemeringkatan Akhir</h1>
                    <p>Ruang kerja <strong>{projectName || 'Memuat project...'}</strong> <span className="heading-separator">/</span> Metode SAW</p>
                </div>
                <div className="heading-trophy" aria-hidden="true">♛</div>
            </div>

            <div className="saw-control-panel glass-panel">
                <div className="normalization-control">
                    <label htmlFor="normType">Metode Normalisasi</label>
                    <select id="normType" value={normType} onChange={event => setNormType(event.target.value)}>
                        <option value="linear">Linear (Klasik SAW)</option>
                        <option value="minmax">Min-Max (Skala 0-1)</option>
                        <option value="sum">Sum (Proporsi Persentase)</option>
                    </select>
                </div>
                <button className="calculate-button" onClick={handleCalculateSAW} disabled={isLoading}>
                    {isLoading ? 'Memproses...' : <><span aria-hidden="true">✦</span> Hitung Peringkat</>}
                </button>
            </div>

            {resultData.length > 0 ? (
                <div className="saw-results animate-fade-in">
                    {winner && (
                        <div className="winner-banner">
                            <span className="winner-star" aria-hidden="true">✦</span>
                            <div>
                                <span className="winner-caption">ALTERNATIF TERBAIK</span>
                                <strong>{winner.Alternatif}</strong>
                                <span className="winner-score">Skor akhir {formatScore(winner['Skor Akhir'])}</span>
                            </div>
                        </div>
                    )}

                    <section className="podium-section" aria-labelledby="podium-title">
                        <div className="section-heading">
                            <div>
                                <span className="section-kicker">YANG TERBAIK</span>
                                <h2 id="podium-title">Podium Top 3</h2>
                            </div>
                            <span className="section-note">Berdasarkan skor SAW tertinggi</span>
                        </div>
                        <div className={`podium-grid podium-count-${podium.length}`}>
                            {podium.map(({ row, rank }) => {
                                const award = medalForRank[rank];
                                return (
                                    <article className={`podium-card podium-${award.modifier}`} key={rank}>
                                        <span className={`podium-medal medal-${rank}`} aria-hidden="true">{award.icon}</span>
                                        <span className="podium-label">{award.label}</span>
                                        <h3 title={row.Alternatif}>{row.Alternatif}</h3>
                                        <strong className="podium-score">{formatScore(row['Skor Akhir'])}</strong>
                                        <span className="podium-step">#{rank}</span>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section className="chart-container">
                        <div className="section-heading">
                            <div>
                                <span className="section-kicker">RINGKASAN SKOR</span>
                                <h2>Perbandingan Alternatif</h2>
                            </div>
                        </div>
                        <div className="chart-area">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={sortedResults} margin={{ top: 16, right: 16, left: 0, bottom: 32 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.14)" />
                                    <XAxis dataKey="Alternatif" tick={{ fill: '#94a3b8', fontSize: 11 }} tickMargin={10} axisLine={{ stroke: '#334155' }} tickLine={false} />
                                    <YAxis domain={[0, 'dataMax + 0.1']} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                                    <Legend wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }} />
                                    <Bar dataKey="Skor Akhir" name="Skor SAW" radius={[7, 7, 0, 0]} animationDuration={900}>
                                        {sortedResults.map((entry, index) => (
                                            <Cell key={`${entry.Alternatif}-${index}`} fill={Number(entry.Peringkat) === 1 ? '#fbbf24' : '#22d3ee'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <section className="ranking-panel glass-panel">
                        <div className="result-header">
                            <div>
                                <span className="section-kicker">DATA LENGKAP</span>
                                <h2>Tabel Hasil Pemeringkatan</h2>
                            </div>
                            <div className="report-actions">
                                <button className="pdf-button" onClick={handleExportPDF}>
                                    <DownloadIcon /> Download Laporan PDF
                                </button>
                                <button className="excel-button" onClick={handleExportExcel}>
                                    <DownloadIcon /> Excel
                                </button>
                            </div>
                        </div>
                        <div className="ranking-table-wrap">
                            <table className="ranking-table">
                                <thead>
                                    <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {sortedResults.map((row, index) => {
                                        const isWinner = Number(row.Peringkat) === 1;
                                        return (
                                            <tr key={`${row.Alternatif}-${index}`} className={isWinner ? 'winner-row' : ''}>
                                                {columns.map(column => {
                                                    const value = row[column];
                                                    if (column === 'Peringkat') {
                                                        return (
                                                            <td key={column}>
                                                                <span className={`rank-badge rank-${value}`}>#{value}</span>
                                                            </td>
                                                        );
                                                    }
                                                    if (column === 'Skor Akhir') {
                                                        return <td className="score-cell" key={column}>{formatScore(value)}</td>;
                                                    }
                                                    return <td key={column}>{value ?? '—'}</td>;
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="ranking-empty glass-panel">
                    <span aria-hidden="true">✦</span>
                    <h2>Hasil peringkat akan tampil di sini</h2>
                    <p>Pilih metode normalisasi, lalu hitung untuk melihat podium dan hasil lengkap.</p>
                </div>
            )}
        </section>
    );
}
