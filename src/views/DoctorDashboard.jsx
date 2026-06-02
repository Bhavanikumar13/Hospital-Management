import React, { useState } from 'react';
import { useHms } from '../context/HmsContext';
import { Calendar, User, FileText, Plus, CheckCircle, Activity, Heart } from 'lucide-react';

const DoctorDashboard = () => {
  const { 
    appointments, 
    patients, 
    inventory, 
    completeConsultation 
  } = useHms();

  const [selectedAptId, setSelectedAptId] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [selectedMed, setSelectedMed] = useState('');
  const [medQty, setMedQty] = useState(10);
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [admissionRecommended, setAdmissionRecommended] = useState(false);

  // Get active doctor appointments (for the demo, showing Dr. Pierce and Dr. House's list)
  const pendingApts = appointments.filter(apt => apt.status === 'Pending');
  const activeApt = appointments.find(apt => apt.id === selectedAptId);
  const activePatient = activeApt ? patients.find(p => p.id === activeApt.patientId) : null;

  const handleSelectApt = (aptId) => {
    setSelectedAptId(aptId);
    setDiagnosisNotes('');
    setPrescriptionList([]);
    setSelectedLabs([]);
    setAdmissionRecommended(false);
  };

  const handleAddMedicine = () => {
    if (!selectedMed) return;
    if (prescriptionList.some(item => item.name === selectedMed)) return;
    setPrescriptionList([...prescriptionList, { name: selectedMed, qty: medQty }]);
    setSelectedMed('');
  };

  const handleRemoveMedicine = (name) => {
    setPrescriptionList(prescriptionList.filter(item => item.name !== name));
  };

  const handleToggleLab = (labName) => {
    if (selectedLabs.includes(labName)) {
      setSelectedLabs(selectedLabs.filter(l => l !== labName));
    } else {
      setSelectedLabs([...selectedLabs, labName]);
    }
  };

  const handleSubmitConsultation = (e) => {
    e.preventDefault();
    if (!selectedAptId) return;

    completeConsultation(
      selectedAptId,
      diagnosisNotes,
      prescriptionList,
      selectedLabs,
      admissionRecommended
    );

    // Reset Form
    setSelectedAptId('');
    setDiagnosisNotes('');
    setPrescriptionList([]);
    setSelectedLabs([]);
    setAdmissionRecommended(false);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Physician Clinical Workspace</h2>
          <p>Examine symptoms, update health charts, write prescriptions, and review histories.</p>
        </div>
      </div>

      <div className="grid-main-side">
        {/* CLINICAL PANEL & WORKSPACE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {activeApt && activePatient ? (
            <form onSubmit={handleSubmitConsultation} className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div className="flex-align-center gap-12">
                  <span className="logo-icon" style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--color-primary)' }}>
                    <User size={20} />
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>Consultation: {activePatient.name}</h3>
                    <p style={{ fontSize: '0.8rem' }}>Age: {activePatient.age} | Gender: {activePatient.gender} | Blood: {activePatient.bloodType}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="hms-badge badge-primary">{activeApt.type}</span>
                  <p style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-muted)' }}>ID: {activePatient.id}</p>
                </div>
              </div>

              {/* Patient Vitals Card */}
              {activePatient.vitals && (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '12px 18px', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Recent Patient Vitals</h4>
                  <div className="vitals-monitor" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '0' }}>
                    <div className="vital-box">
                      <div className="vital-label">BP</div>
                      <div className="vital-value normal">{activePatient.vitals.bp}</div>
                    </div>
                    <div className="vital-box">
                      <div className="vital-label">HR (bpm)</div>
                      <div className="vital-value normal">{activePatient.vitals.heartRate}</div>
                    </div>
                    <div className="vital-box">
                      <div className="vital-label">Temp (°F)</div>
                      <div className="vital-value normal">{activePatient.vitals.temp}</div>
                    </div>
                    <div className="vital-box">
                      <div className="vital-label">SpO2 (%)</div>
                      <div className={`vital-value ${activePatient.vitals.spo2 < 95 ? 'warning' : 'normal'}`}>{activePatient.vitals.spo2}%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Diagnosis inputs */}
              <div className="hms-form-group">
                <label>Diagnosis & Consultation Notes</label>
                <textarea 
                  value={diagnosisNotes}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  placeholder="Record symptoms, physical exam findings, and clinical diagnosis details..."
                  className="hms-textarea"
                  rows={4}
                  required
                />
              </div>

              {/* e-Prescription creator */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Prescribe Medicines</h4>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ flexGrow: 1 }}>
                    <select 
                      value={selectedMed} 
                      onChange={(e) => setSelectedMed(e.target.value)}
                      className="hms-select"
                    >
                      <option value="">-- Select Medicine Formulary --</option>
                      {inventory.map(med => (
                        <option key={med.id} value={med.name} disabled={med.qty <= 0}>
                          {med.name} ({med.qty} left) {med.qty <= 0 ? '- OUT OF STOCK' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '80px' }}>
                    <input 
                      type="number" 
                      value={medQty} 
                      onChange={(e) => setMedQty(e.target.value)}
                      className="hms-input"
                      min={1} 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddMedicine}
                    className="hms-btn hms-btn-secondary hms-btn-icon-only"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {prescriptionList.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {prescriptionList.map(item => (
                      <span key={item.name} className="hms-badge badge-info" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {item.name} ({item.qty} units)
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMedicine(item.name)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '1rem', padding: '0 2px' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No prescription medications drafted yet.</p>
                )}
              </div>

              {/* Lab Request and Hospitalization */}
              <div className="grid-2">
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Order Diagnostic Lab Tests</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Complete Blood Count (CBC)', 'Basic Metabolic Panel (BMP)', 'Chest X-Ray Digital', 'Brain MRI Scan'].map(lab => (
                      <label key={lab} className="flex-align-center gap-8" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedLabs.includes(lab)}
                          onChange={() => handleToggleLab(lab)}
                        />
                        {lab}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Hospitalization Order</h4>
                  <p style={{ fontSize: '0.8rem', marginBottom: '12px' }}>Check if this patient requires overnight ward admission for clinical monitoring.</p>
                  <label className="flex-align-center gap-8" style={{ fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', color: admissionRecommended ? 'var(--color-warning)' : 'var(--text-secondary)' }}>
                    <input 
                      type="checkbox" 
                      checked={admissionRecommended}
                      onChange={(e) => setAdmissionRecommended(e.target.checked)}
                    />
                    Recommend Ward Admission
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setSelectedAptId('')} 
                  className="hms-btn hms-btn-secondary"
                >
                  Postpone
                </button>
                <button 
                  type="submit" 
                  className="hms-btn hms-btn-primary"
                >
                  <CheckCircle size={18} />
                  Complete Consultation & Publish Records
                </button>
              </div>
            </form>
          ) : (
            <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '350px', borderStyle: 'dashed' }}>
              <Activity size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>Select a Patient from the Queue</h3>
              <p style={{ maxWidth: '340px', textAlign: 'center', marginTop: '6px' }}>Click on a patient listed in the queue to open their chart and load the consultation panel.</p>
            </div>
          )}

          {/* ACTIVE PATIENT EMR HISTORY (If selected) */}
          {activePatient && (
            <div className="hms-card">
              <h3>Health History & EMR Ledger ({activePatient.name})</h3>
              <p style={{ marginBottom: '20px' }}>Historical treatment events, laboratory logs, and active diagnostics.</p>
              
              <div className="emr-timeline">
                {activePatient.emr.map((record, index) => (
                  <div key={index} className="timeline-item">
                    <span className={`timeline-dot ${record.type === 'Prescription' ? 'info' : record.type === 'Lab Report' ? 'success' : 'primary'}`}></span>
                    <div className="timeline-card">
                      <div className="timeline-time">{record.date}</div>
                      <div className="timeline-title flex-between">
                        <span>{record.title}</span>
                        <span className="hms-badge badge-primary" style={{ fontSize: '0.65rem' }}>{record.type}</span>
                      </div>
                      <div className="timeline-details">{record.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* APPOINTMENTS SIDEBAR QUEUE */}
        <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <div className="flex-align-center gap-8">
            <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
            <h3>Today's Patient Queue</h3>
          </div>
          <p style={{ fontSize: '0.82rem' }}>Queue updates in real time upon receptionist check-in.</p>
          
          <div className="queue-list">
            {pendingApts.length > 0 ? (
              pendingApts.map(apt => (
                <div 
                  key={apt.id} 
                  onClick={() => handleSelectApt(apt.id)}
                  className="queue-item"
                  style={{ 
                    cursor: 'pointer',
                    borderColor: selectedAptId === apt.id ? 'var(--color-primary)' : '',
                    background: selectedAptId === apt.id ? 'rgba(0, 240, 255, 0.05)' : ''
                  }}
                >
                  <div className="queue-item-info">
                    <h5>{apt.patientName}</h5>
                    <p style={{ color: 'var(--color-primary)' }}>{apt.time} - {apt.doctorName.split(' ')[1]}</p>
                    <p style={{ fontSize: '0.72rem', marginTop: '2px', color: 'var(--text-muted)' }}>Type: {apt.type}</p>
                  </div>
                  <span className="hms-badge badge-warning" style={{ fontSize: '0.68rem' }}>Pending</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No pending consultations in the queue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
