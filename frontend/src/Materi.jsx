import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function Materi() {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', background: '#1e293b', padding: '40px', borderRadius: '16px', lineHeight: '1.7', boxShadow: '0 18px 50px rgba(2,8,23,0.25)', color: '#cbd5e1', border: '1px solid rgba(148,163,184,0.16)' }}>
            <h1 style={{ textAlign: 'center', color: '#f8fafc', borderBottom: '3px solid #22d3ee', paddingBottom: '15px', marginBottom: '30px' }}>
                📖 Materi Praktikum: Hybrid AHP & SAW
            </h1>

            <p>
                Sistem Pendukung Keputusan (DSS) Hybrid AHP-SAW menggabungkan kekuatan <strong>Analytic Hierarchy Process (AHP)</strong> dalam menetapkan bobot kriteria secara konsisten, dengan efisiensi <strong>Simple Additive Weighting (SAW)</strong> dalam melakukan pemeringkatan (ranking) alternatif. Pendekatan ini sangat tangguh untuk memecahkan masalah dengan jumlah alternatif yang besar.
            </p>

            <hr style={{ margin: '40px 0', borderTop: '1px dashed #cbd5e1' }} />

            {/* ========================================================= */}
            {/* FASE 1: AHP */}
            {/* ========================================================= */}
            <h2 style={{ color: '#f1f5f9' }}>Fase 1: Pembobotan Kriteria dengan AHP</h2>
            <p>
                AHP dikembangkan oleh Thomas L. Saaty. Metode ini memecah masalah kompleks menjadi hierarki dan menggunakan pembandingan berpasangan (<em>pairwise comparison</em>) skala 1-9 untuk mengekspresikan intensitas preferensi pengambil keputusan.
            </p>

            <div style={{ background: '#142033', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #22d3ee', marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Langkah 1.1: Normalisasi Matriks Perbandingan</h4>
                <p>Setiap elemen pada matriks dibagi dengan jumlah elemen pada kolom yang sama (Metode Normalisasi Kolom):</p>
                <BlockMath math={"a'_{ij} = \\frac{a_{ij}}{\\sum_{k=1}^{n} a_{kj}}"} />
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Dimana <InlineMath math={"a_{ij}"} /> adalah nilai perbandingan baris ke-<InlineMath math={"i"} /> dan kolom ke-<InlineMath math={"j"} />, serta <InlineMath math={"n"} /> adalah jumlah kriteria.</p>
            </div>

            <div style={{ background: '#142033', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #22d3ee', marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Langkah 1.2: Menghitung Vektor Prioritas (Bobot)</h4>
                <p>Bobot prioritas setiap kriteria (<InlineMath math={"w_i"} />) diperoleh dengan menghitung rata-rata nilai pada setiap baris dari matriks yang telah dinormalisasi:</p>
                <BlockMath math={"w_i = \\frac{1}{n} \\sum_{j=1}^{n} a'_{ij}"} />
            </div>

            <div style={{ background: '#352b18', padding: '20px', borderRadius: '8px', border: '1px solid rgba(251,191,36,0.35)', marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#fcd34d' }}>Langkah 1.3: Uji Konsistensi (Consistency Ratio / CR)</h4>
                <p>Fitur paling bernilai dari AHP adalah validasi konsistensi. Pertama, hitung nilai <em>Eigenvalue Maksimum</em> (<InlineMath math={"\\lambda_{max}"} />):</p>
                <BlockMath math={"\\lambda_{max} = \\frac{1}{n} \\sum_{i=1}^{n} \\frac{(A \\cdot w)_i}{w_i}"} />
                
                <p>Selanjutnya, hitung <strong>Consistency Index (CI)</strong>:</p>
                <BlockMath math={"CI = \\frac{\\lambda_{max} - n}{n - 1}"} />
                
                <p>Terakhir, hitung <strong>Consistency Ratio (CR)</strong> dengan membagi CI dengan <em>Random Index</em> (RI) standar Saaty:</p>
                <BlockMath math={"CR = \\frac{CI}{RI}"} />
                
                <p style={{ fontWeight: 'bold', color: '#fca5a5', textAlign: 'center', marginTop: '15px' }}>
                    * Syarat Mutlak: Penilaian dianggap rasional dan valid jika CR ≤ 0.10.
                </p>
            </div>

            <hr style={{ margin: '40px 0', borderTop: '1px dashed #cbd5e1' }} />

            {/* ========================================================= */}
            {/* FASE 2: SAW */}
            {/* ========================================================= */}
            <h2 style={{ color: '#f1f5f9' }}>Fase 2: Pemeringkatan Alternatif dengan SAW</h2>
            <p>
                Setelah bobot kriteria (<InlineMath math={"w_j"} />) tervalidasi di Fase 1, metode SAW digunakan untuk menghitung skor setiap alternatif berdasarkan data aktual (bukan pembandingan berpasangan).
            </p>

            <div style={{ background: '#102b2a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #34d399', marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Langkah 2.1: Normalisasi Matriks (Min-Max)</h4>
                <p>Sesuaikan nilai berdasarkan sifat kriteria (Benefit atau Cost):</p>
                
                <strong>Kriteria Benefit (Keuntungan):</strong>
                <BlockMath math={"r_{ij} = \\frac{x_{ij} - x_j^{min}}{x_j^{max} - x_j^{min}}"} />
                
                <strong>Kriteria Cost (Biaya):</strong>
                <BlockMath math={"r_{ij} = \\frac{x_j^{max} - x_{ij}}{x_j^{max} - x_j^{min}}"} />
                
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    Dimana <InlineMath math={"x_{ij}"} /> adalah nilai performa alternatif <InlineMath math={"i"} /> pada kriteria <InlineMath math={"j"} />.
                </p>
            </div>

            <div style={{ background: '#102b2a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #34d399', marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Langkah 2.2: Perhitungan Skor Akhir (Preferensi)</h4>
                <p>Skor akhir (<InlineMath math={"V_i"} />) didapatkan dari penjumlahan hasil perkalian antara matriks ternormalisasi (<InlineMath math={"r_{ij}"} />) dengan bobot kriteria AHP (<InlineMath math={"w_j"} />):</p>
                <BlockMath math={"V_i = \\sum_{j=1}^{n} w_j \\cdot r_{ij}"} />
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    🏆 <em>Alternatif dengan skor <InlineMath math={"V_i"} /> terbesar dipilih sebagai alternatif terbaik (Peringkat 1).</em>
                </p>
            </div>

            <div style={{ background: '#111c30', color: '#e2e8f0', padding: '20px', borderRadius: '8px', marginTop: '40px', textAlign: 'center', border: '1px solid rgba(34,211,238,0.2)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#67e8f9' }}>💡 Kesimpulan Desain Hybrid</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Arsitektur Hybrid memecahkan batasan AHP yang tidak efisien jika membandingkan puluhan alternatif secara berpasangan, sekaligus mengatasi kelemahan SAW yang biasanya menggunakan bobot kriteria arbitrer tanpa validasi konsistensi.
                </p>
            </div>

        </div>
    );
}