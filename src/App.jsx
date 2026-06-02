import React, { useState } from 'react';
import { HmsProvider, useHms } from './context/HmsContext';

// Import Views
import AdminDashboard from './views/AdminDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import PatientDashboard from './views/PatientDashboard';
import ReceptionistDashboard from './views/ReceptionistDashboard';
import NurseDashboard from './views/NurseDashboard';
import PharmacistDashboard from './views/PharmacistDashboard';
import LabTechnicianDashboard from './views/LabTechnicianDashboard';
import InsuranceOfficerDashboard from './views/InsuranceOfficerDashboard';

// Import Icons from Lucide
import { 
  Shield, 
  Activity, 
  User, 
  Calendar, 
  Heart, 
  Clipboard, 
  Beaker, 
  ShieldCheck, 
  Bell, 
  X, 
  Play, 
  Plus,
  Zap,
  Clock,
  ShieldAlert,
  Database
} from 'lucide-react';

const AppContent = () => {
  // Roles listing
  const roles = [
    { id: 'admin', name: 'System Admin', icon: Shield, component: AdminDashboard, color: 'var(--color-primary)' },
    { id: 'receptionist', name: 'Receptionist', icon: Calendar, component: ReceptionistDashboard, color: 'var(--color-success)' },
    { id: 'patient', name: 'Patient (Portal)', icon: User, component: PatientDashboard, color: 'var(--color-info)' },
    { id: 'doctor', name: 'Medical Doctor', icon: Activity, component: DoctorDashboard, color: 'var(--color-warning)' },
    { id: 'nurse', name: 'Ward Nurse', icon: Heart, component: NurseDashboard, color: 'var(--color-danger)' },
    { id: 'pharmacist', name: 'Pharmacist', icon: Clipboard, component: PharmacistDashboard, color: 'var(--color-primary)' },
    { id: 'labtech', name: 'Lab Technician', icon: Beaker, component: LabTechnicianDashboard, color: 'var(--color-success)' },
    { id: 'insurance', name: 'Insurance Officer', icon: ShieldCheck, component: InsuranceOfficerDashboard, color: 'var(--color-info)' }
  ];

  const [activeRole, setActiveRole] = useState('admin');
  const [activeToasts, setActiveToasts] = useState([]);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  const { 
    notifications, 
    triggerEmergencySimulator, 
    triggerDatabaseBackup,
    patients,
    appointments,
    inventory
  } = useHms();

  const currentRole = roles.find(r => r.id === activeRole);
  const DashboardView = currentRole.component;

  // Dismiss Toast
  const dismissToast = (id) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync background triggers (toast popups) when notification list changes
  React.useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Check if this notification is already displayed or dismissed
      setActiveToasts(prev => {
        if (prev.some(t => t.id === latest.id)) return prev;
        // Keep last 3 toasts
        const newToasts = [latest, ...prev].slice(0, 3);
        
        // Auto-dismiss toast after 5s
        setTimeout(() => {
          dismissToast(latest.id);
        }, 5000);

        return newToasts;
      });
    }
  }, [notifications]);

  return (
    <div className="hms-app-layout">
      {/* SIDEBAR PANEL */}
      <aside className="hms-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Activity size={20} style={{ color: '#020617' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', margin: 0, letterSpacing: '-0.01em', fontWeight: 'bold' }}>Smart HMS</h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>Real-Time System</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li style={{ padding: '0 16px 8px 16px', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            OPERATIONAL ACTORS
          </li>
          {roles.map(role => {
            const IconComponent = role.icon;
            const isActive = activeRole === role.id;
            return (
              <li key={role.id} className="sidebar-item">
                <a 
                  onClick={() => setActiveRole(role.id)} 
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <IconComponent size={18} className="sidebar-icon" style={{ color: isActive ? '#020617' : role.color }} />
                  <span>{role.name}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <div>HMS System Node 01</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-success)', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span className="actor-indicator"></span> Live DB Connected
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT DISPLAY */}
      <main className="hms-main-content">
        <header className="hms-header">
          <div className="flex-align-center gap-12">
            <span className="actor-indicator" style={{ background: currentRole.color, boxShadow: `0 0 8px ${currentRole.color}` }}></span>
            <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {currentRole.name} Dashboard
            </h3>
          </div>

          <div className="flex-align-center gap-16">
            {/* System Info Tickers */}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '16px' }}>
              <span className="flex-align-center gap-8">
                <User size={14} style={{ color: 'var(--color-primary)' }} /> Patients: {patients.length}
              </span>
              <span className="flex-align-center gap-8">
                <Clock size={14} style={{ color: 'var(--color-success)' }} /> Active Apts: {appointments.filter(a=>a.status==='Pending').length}
              </span>
            </div>

            {/* Notification Icon */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
                className="hms-btn hms-btn-secondary hms-btn-icon-only"
                style={{ borderRadius: '50%' }}
              >
                <Bell size={18} style={{ color: 'var(--color-primary)' }} />
                {notifications.length > 0 && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--color-danger)', width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 6px var(--color-danger)' }}></span>
                )}
              </button>

              {/* NOTIFICATION CENTER DROPDOWN */}
              {showNotificationsDrawer && (
                <div className="hms-card" style={{ position: 'absolute', right: 0, top: '48px', width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 1000, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <h4 style={{ fontSize: '0.85rem' }}>Central Notification Logs</h4>
                    <button 
                      onClick={() => setShowNotificationsDrawer(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px', fontSize: '0.75rem' }}>
                      <div className="flex-between">
                        <strong className={
                          n.type === 'danger' ? 'danger' : 
                          n.type === 'success' ? 'success' : 
                          n.type === 'warning' ? 'warning' : 'info'
                        } style={{ 
                          color: n.type === 'danger' ? 'var(--color-danger)' : 
                                 n.type === 'success' ? 'var(--color-success)' :
                                 n.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'
                        }}>{n.title}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '0.72rem', marginTop: '2px', color: 'var(--text-secondary)' }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ACTIVE DASHBOARD BODY */}
        <div className="hms-dashboard-body">
          <DashboardView />
        </div>
      </main>

      {/* REAL-TIME TOAST POPUPS */}
      <div className="toast-container">
        {activeToasts.map(toast => (
          <div key={toast.id} className={`hms-toast ${toast.type}`}>
            <div className="toast-content">
              <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {toast.type === 'danger' && <ShieldAlert size={14} style={{ color: 'var(--color-danger)' }} />}
                {toast.type === 'warning' && <ShieldAlert size={14} style={{ color: 'var(--color-warning)' }} />}
                {toast.title}
              </h5>
              <p>{toast.message}</p>
            </div>
            <span onClick={() => dismissToast(toast.id)} className="toast-close">
              <X size={14} />
            </span>
          </div>
        ))}
      </div>

      {/* SIMULATOR FLOATING EVENT MANAGER */}
      <div className="simulator-dock">
        <div className="simulator-title">
          <Zap size={16} />
          <span>Real-Time Workflow Simulator</span>
        </div>

        <div className="simulator-controls">
          <button 
            onClick={triggerEmergencySimulator}
            className="hms-btn hms-btn-danger pulse-red-glow"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Play size={12} fill="currentColor" /> Trigger Critical Emergency
          </button>
          
          <button 
            onClick={triggerDatabaseBackup}
            className="hms-btn hms-btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Database size={12} /> Sync Backup
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <HmsProvider>
      <AppContent />
    </HmsProvider>
  )
}

export default App;
