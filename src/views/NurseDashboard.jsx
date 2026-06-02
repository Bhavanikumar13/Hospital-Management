import React, { useState } from 'react';
import { useHms } from '../context/HmsContext';
import { Activity, Heart, Clock, Check, ShieldAlert, Thermometer, Droplet } from 'lucide-react';

const NurseDashboard = () => {
  const { patients, saveVitals, dischargePatient } = useHms();

  const admittedPatients = patients.filter(p => p.status === 'Admitted' || p.status === 'Emergency');

  // Vitals Update Form State
  const [selectedPatId, setSelectedPatId] = useState('');
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState(72);
  const [temp, setTemp] = useState(98.6);
  const [spo2, setSpo2] = useState(98);

  const handleOpenVitals = (patient) => {
    setSelectedPatId(patient.id);
    if (patient.vitals) {
      setBp(patient.vitals.bp);
      setHr(patient.vitals.heartRate);
      setTemp(patient.vitals.temp);
      setSpo2(patient.vitals.spo2);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedPatId) return;

    saveVitals(selectedPatId, bp, hr, temp, spo2);
    setSelectedPatId('');
  };

  const activeVitalsPatient = patients.find(p => p.id === selectedPatId);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Ward Nursing & Patient Watchlist</h2>
          <p>Monitor vitals of admitted ward/ICU patients, log treatments, and report critical shifts.</p>
        </div>
      </div>

      <div className="grid-main-side">
        {/* WARD WATCHLIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="hms-card">
            <h3>Admitted Ward & ER Patient List</h3>
            <p style={{ marginBottom: '20px' }}>Active bed patients requiring regular round checks.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {admittedPatients.length > 0 ? (
                admittedPatients.map(p => {
                  const isCritical = p.vitals && (p.vitals.spo2 < 93 || p.vitals.heartRate > 110);
                  
                  return (
                    <div 
                      key={p.id} 
                      className={`hms-card ${isCritical ? 'danger-alert' : ''}`}
                      style={{ padding: '20px', background: 'rgba(255,255,255,0.015)' }}
                    >
                      <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {p.name}{' '}
                            {isCritical && (
                              <span className="hms-badge badge-danger" style={{ fontSize: '0.65rem' }}>
                                <ShieldAlert size={12} /> CRITICAL VITALS
                              </span>
                            )}
                          </h4>
                          <p style={{ fontSize: '0.78rem' }}>Condition: {p.disease} | Bed: <strong style={{ color: 'var(--color-primary)' }}>{p.admittedBed}</strong></p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="hms-badge badge-info">{p.status}</span>
                        </div>
                      </div>

                      {/* Display Vitals */}
                      {p.vitals && (
                        <div className="vitals-monitor">
                          <div className="vital-box">
                            <div className="vital-label flex-align-center gap-8 justify-center">
                              <Activity size={12} style={{ color: 'var(--color-primary)' }} />
                              Blood Pressure
                            </div>
                            <div className="vital-value normal">{p.vitals.bp}</div>
                          </div>
                          <div className="vital-box">
                            <div className="vital-label flex-align-center gap-8 justify-center">
                              <Heart size={12} style={{ color: 'var(--color-danger)' }} />
                              Heart Rate
                            </div>
                            <div className={`vital-value ${p.vitals.heartRate > 105 ? 'danger' : 'normal'}`}>{p.vitals.heartRate} bpm</div>
                          </div>
                          <div className="vital-box">
                            <div className="vital-label flex-align-center gap-8 justify-center">
                              <Thermometer size={12} style={{ color: 'var(--color-warning)' }} />
                              Body Temp
                            </div>
                            <div className={`vital-value ${p.vitals.temp > 100.5 ? 'warning' : 'normal'}`}>{p.vitals.temp} °F</div>
                          </div>
                          <div className="vital-box">
                            <div className="vital-label flex-align-center gap-8 justify-center">
                              <Droplet size={12} style={{ color: 'var(--color-primary)' }} />
                              Oxygen SpO2
                            </div>
                            <div className={`vital-value ${p.vitals.spo2 < 93 ? 'danger' : 'normal'}`}>{p.vitals.spo2} %</div>
                          </div>
                        </div>
                      )}

                      <div className="flex-between" style={{ marginTop: '16px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>Last check: {p.vitals ? p.vitals.lastUpdated : 'No log yet'}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleOpenVitals(p)}
                            className="hms-btn hms-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            Update Vitals
                          </button>
                          <button 
                            onClick={() => dischargePatient(p.id)}
                            className="hms-btn hms-btn-danger"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            Approve Discharge
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  No patients are currently admitted in the general wards or ICU.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDE ACTIONS: VITALS INPUT MODULE & DUTY SHEET */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* VITALS FORM WORKSPACE */}
          {selectedPatId && activeVitalsPatient ? (
            <form onSubmit={handleSave} className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="flex-align-center gap-8" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <Activity size={18} style={{ color: 'var(--color-primary)' }} />
                <h3>Log Patient Vitals</h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Patient: {activeVitalsPatient.name}</p>

              <div className="hms-form-group">
                <label>Blood Pressure (BP)</label>
                <input 
                  type="text" 
                  value={bp} 
                  onChange={(e) => setBp(e.target.value)} 
                  className="hms-input"
                  placeholder="e.g. 120/80" 
                  required
                />
              </div>

              <div className="hms-form-group">
                <label>Heart Rate (bpm)</label>
                <input 
                  type="number" 
                  value={hr} 
                  onChange={(e) => setHr(e.target.value)} 
                  className="hms-input" 
                  required
                />
              </div>

              <div className="hms-form-group">
                <label>Temperature (°F)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={temp} 
                  onChange={(e) => setTemp(e.target.value)} 
                  className="hms-input" 
                  required
                />
              </div>

              <div className="hms-form-group">
                <label>Blood Oxygen (SpO2 %)</label>
                <input 
                  type="number" 
                  value={spo2} 
                  onChange={(e) => setSpo2(e.target.value)} 
                  className="hms-input" 
                  max={100}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" onClick={() => setSelectedPatId('')} className="hms-btn hms-btn-secondary" style={{ padding: '8px 14px' }}>
                  Cancel
                </button>
                <button type="submit" className="hms-btn hms-btn-success" style={{ padding: '8px 14px' }}>
                  Save Vitals
                </button>
              </div>
            </form>
          ) : (
            <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex-align-center gap-8">
                <Clock size={18} style={{ color: 'var(--color-primary)' }} />
                <h3>Active Nursing Shift</h3>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                <div className="flex-between">
                  <span>Shift:</span>
                  <strong>Day Shift A (08:00 - 16:00)</strong>
                </div>
                <div className="flex-between" style={{ marginTop: '6px' }}>
                  <span>Duty Lead:</span>
                  <span>Nurse Clara Oswald</span>
                </div>
                <div className="flex-between" style={{ marginTop: '6px' }}>
                  <span>Coverage:</span>
                  <span>Beds B101-B104, ICU301</span>
                </div>
              </div>
              
              <div style={{ background: 'rgba(0, 255, 135, 0.05)', border: '1px solid rgba(0, 255, 135, 0.15)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--color-success)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Check size={16} />
                Duty attendance checked in at 07:58 AM.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
