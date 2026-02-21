import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Allow for local development to use VITE_API_URL or fallback to localhost directly
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/impact-stats`);
                setStats(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch API", err);
                setError("Unable to connect to the backend service. Make sure it's running!");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [apiUrl]);

    const handleSetupDatabase = async () => {
        setLoading(true);
        try {
            await axios.post(`${apiUrl}/api/setup-database`);
            // Reload stats after setup
            const response = await axios.get(`${apiUrl}/api/impact-stats`);
            setStats(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to setup database", err);
            setError("Failed to initialize database. Check backend logs and Supabase configuration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <main className="dashboard">
                <header className="header">
                    <div className="logo">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#paint0_linear)" />
                            <defs>
                                <linearGradient id="paint0_linear" x1="12" y1="3" x2="12" y2="21.35" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FF6B6B" />
                                    <stop offset="1" stopColor="#FF8E53" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <h1>ImpactSphere</h1>
                    </div>
                    <nav className="nav">
                        <a href="#" className="active">Dashboard</a>
                        <a href="#">Campaigns</a>
                        <a href="#">Volunteers</a>
                        <a href="#">Settings</a>
                    </nav>
                </header>

                <section className="hero-section">
                    <h2>Global Impact Dashboard</h2>
                    <p>Real-time metrics measuring positive change worldwide.</p>
                </section>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Gathering impact data...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <p>{error}</p>
                        <button className="retry-btn" onClick={() => window.location.reload()}>Retry Connection</button>
                    </div>
                ) : !stats || Object.keys(stats).length === 0 ? (
                    <div className="error-state">
                        <div className="error-icon">🗄️</div>
                        <p>Database Connected, but no data found!</p>
                        <button className="retry-btn" onClick={handleSetupDatabase}>Initialize Supabase Data</button>
                    </div>
                ) : (
                    <div className="stats-grid">
                        <StatCard
                            title="Total Donations"
                            value={`$${stats.total_donations.toLocaleString()}`}
                            icon="💰"
                            trend="+12.5%"
                            color="emerald"
                        />
                        <StatCard
                            title="Active Campaigns"
                            value={stats.active_campaigns}
                            icon="🚀"
                            trend="+4.2%"
                            color="blue"
                        />
                        <StatCard
                            title="Volunteers Engaged"
                            value={stats.volunteers_engaged.toLocaleString()}
                            icon="🤝"
                            trend="+18.1%"
                            color="purple"
                        />
                        <StatCard
                            title="Lives Impacted"
                            value={stats.lives_impacted.toLocaleString()}
                            icon="❤️"
                            trend="+8.9%"
                            color="rose"
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, trend, color }) {
    return (
        <div className={`stat-card border-${color}`}>
            <div className="stat-header">
                <span className="stat-icon">{icon}</span>
                <span className="stat-trend trend-up">{trend} ↑</span>
            </div>
            <div className="stat-body">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );
}

export default App;
