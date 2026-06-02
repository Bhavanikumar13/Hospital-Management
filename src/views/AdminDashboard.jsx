import React, { useState } from 'react';
import { useHms } from '../context/HmsContext';
import { DollarSign, ShieldAlert, Users, Calendar, Activity, CheckCircle, Database } from 'lucide-react';

const AdminDashboard = () => {
  const { getAdminStats, beds, backupLogs, triggerDatabaseBackup } = useHms();
  const stats = getAdminStats();
  const [backingUp, setBackingUp] = useState(false);

  const handleBackup = () => {
    setBackingUp(true);
    triggerDatabaseBackup();
    setTimeout(() => setBackingUp(false), 2000);
  };

  // Mock revenue chart coordinates
  const revenuePoints = "20,150 70,120 120,130 170,80 220,100 270,50 320,40";
  const patientPoints = "20,130 70,140 120,90 170,110 220,60 270,80 320,50";

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Administration & Operations Panel</h2>
          <p>Real-time analytics, central bed inventory, database system controls.</p>
        </div>
        <button 
          onClick={handleBackup} 
          disabled={backingUp}
          className="hms-btn hms-btn-secondary"
        >
          <Database size={18} className={backingUp ? "spin" : ""} style={{ color: 'var(--color-primary)' }} />
          {backingUp ? "Securing Databases..." : "Run Database Backup"}
        </button>
      </div>

      {/* METRIC CARD GRID */}
      <div className="metric-grid">
        <div className="hms-card metric-card">
          <div className="metric-details">
            <h4>Total Revenue</h4>
            <div className="metric-value">${stats.totalRevenue.toFixed(2)}</div>
            <div className="metric-subtext" style={{ color: 'var(--color-success)' }}>+12.4% vs last week</div>
          </div>
          <div className="metric-icon-box" style={{ background: 'rgba(0, 255, 135, 0.15)', color: 'var(--color-success)' }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="hms-card metric-card">
          <div className="metric-details">
            <h4>Bed Occupancy</h4>
            <div className="metric-value">{stats.bedOccupancyRate}%</div>
            <div className="metric-subtext">{stats.occupiedBeds} of {stats.totalBeds} Beds Occupied</div>
          </div>
          <div className="metric-icon-box" style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--color-primary)' }}>
            <Activity size={24} />
          </div>
        </div>

        <div className="hms-card metric-card">
          <div className="metric-details">
            <h4>Registered Patients</h4>
            <div className="metric-value">{stats.patientsCount}</div>
            <div className="metric-subtext">Active files in system</div>
          </div>
          <div className="metric-icon-box" style={{ background: 'rgba(123, 44, 255, 0.15)', color: 'var(--color-info)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="hms-card metric-card">
          <div className="metric-details">
            <h4>Low Formulary Stock</h4>
            <div className="metric-value" style={{ color: stats.lowStockCount > 0 ? 'var(--color-warning)' : 'var(--text-primary)' }}>
              {stats.lowStockCount} Items
            </div>
            <div className="metric-subtext">{stats.lowStockCount > 0 ? 'Reorder orders triggered' : 'All stocks sufficient'}</div>
          </div>
          <div className="metric-icon-box" style={{ 
            background: stats.lowStockCount > 0 ? 'rgba(255, 183, 3, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
            color: stats.lowStockCount > 0 ? 'var(--color-warning)' : 'var(--text-muted)' 
          }}>
            <ShieldAlert size={24} />
          </div>
        </div>
      </div>

      <div className="grid-main-side">
        {/* CHARTS CONTAINER */}
        <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="flex-between">
            <h3>Performance Reports & Analytics</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
              <span className="flex-align-center gap-8">
                <span className="legend-dot-indicator" style={{ background: 'var(--color-primary)' }}></span>
                Revenue ($)
              </span>
              <span className="flex-align-center gap-8">
                <span className="legend-dot-indicator" style={{ background: 'var(--color-success)' }}></span>
                Patient Admissions
              </span>
            </div>
          </div>

          <div className="chart-container-svg">
            <svg className="chart-svg" viewBox="0 0 350 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="patient-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="30" x2="340" y2="30" className="chart-grid-line" />
              <line x1="20" y1="70" x2="340" y2="70" className="chart-grid-line" />
              <line x1="20" y1="110" x2="340" y2="110" className="chart-grid-line" />
              <line x1="20" y1="150" x2="340" y2="150" className="chart-grid-line" />

              {/* Chart Lines */}
              <path d={`M ${revenuePoints}`} className="chart-line" />
              <path d={`M ${revenuePoints} L 320,170 L 20,170 Z`} className="chart-area" />

              <path d={`M ${patientPoints}`} className="chart-line" style={{ stroke: 'var(--color-success)' }} />
              <path d={`M ${patientPoints} L 320,170 L 20,170 Z`} className="chart-area" style={{ fill: 'url(#patient-gradient)' }} />

              {/* Chart Dots */}
              {revenuePoints.split(' ').map((point, index) => {
                const [x, y] = point.split(',');
                return <circle key={`rev-${index}`} cx={x} cy={y} r="4" className="chart-dot" />;
              })}
              {patientPoints.split(' ').map((point, index) => {
                const [x, y] = point.split(',');
                return <circle key={`pat-${index}`} cx={x} cy={y} r="4" className="chart-dot" style={{ stroke: 'var(--color-success)' }} />;
              })}

              {/* Axes Text */}
              <text x="20" y="165" className="chart-axis-text">Mon</text>
              <text x="70" y="165" className="chart-axis-text">Tue</text>
              <text x="120" y="165" className="chart-axis-text">Wed</text>
              <text x="170" y="165" className="chart-axis-text">Thu</text>
              <text x="220" y="165" className="chart-axis-text">Fri</text>
              <text x="270" y="165" className="chart-axis-text">Sat</text>
              <text x="320" y="165" className="chart-axis-text">Sun</text>
            </svg>
          </div>
        </div>

        {/* CLOUD DATA BACKUPS WINDOW */}
        <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-align-center gap-8">
            <Database size={20} style={{ color: 'var(--color-primary)' }} />
            <h3>Secure Backup Console</h3>
          </div>
          <p style={{ fontSize: '0.82rem' }}>Automatic hourly ledger snapshots syncing to cloud nodes.</p>
          
          <div className="backup-log-window">
            {backupLogs.map((log, idx) => (
              <div key={idx} className="backup-log-line">
                <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>{' '}
                <span className={log.status === 'SUCCESS' ? 'success' : 'danger'} style={{ fontWeight: 'bold' }}>
                  {log.action}
                </span>{' '}
                - {log.details}
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓ Ledger Sync Status:</span> Active & Synced. Primary server node operational with zero packet drops.
          </div>
        </div>
      </div>

      {/* CENTRAL BED matrix WIDGET */}
      <div className="hms-card" style={{ marginTop: '24px' }}>
        <div className="flex-between">
          <div>
            <h3>Central Room & Bed Inventory Matrix</h3>
            <p>Real-time occupancy tracker mapping patient slots across general wards, ICUs, and emergency bay blocks.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem' }}>
            <span className="flex-align-center gap-8">
              <span style={{ width: '8px', height: '8px', background: 'rgba(0, 255, 135, 0.2)', border: '1px solid var(--color-success)', borderRadius: '50%' }}></span>
              Available
            </span>
            <span className="flex-align-center gap-8">
              <span style={{ width: '8px', height: '8px', background: 'rgba(255, 0, 91, 0.2)', border: '1px solid var(--color-danger)', borderRadius: '50%' }}></span>
              Occupied
            </span>
          </div>
        </div>

        <div className="beds-grid">
          {beds.map(bed => (
            <div key={bed.id} className={`bed-box ${bed.status === 'Occupied' ? 'occupied' : 'available'}`}>
              <span className="bed-name">{bed.id}</span>
              <span className="bed-status-label">{bed.type.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
