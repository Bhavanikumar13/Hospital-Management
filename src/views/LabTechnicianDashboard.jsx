import React, { useState } from 'react';
import { useHms } from '../context/HmsContext';
import { Activity, Beaker, FileText, Send, User } from 'lucide-react';

const LabTechnicianDashboard = () => {
  const { labTests, submitLabReport } = useHms();

  const [activeTestId, setActiveTestId] = useState('');
  const [reportText, setReportText] = useState('');

  const pendingTests = labTests.filter(t => t.status === 'Pending');
  const activeTest = labTests.find(t => t.id === activeTestId);

  const handleSelectTest = (testId) => {
    setActiveTestId(testId);
    setReportText('');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!activeTestId || !reportText) return;

    submitLabReport(activeTestId, reportText);
    setActiveTestId('');
    setReportText('');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Diagnostic Laboratories Portal</h2>
          <p>Collect laboratory samples, run biochemical testing panel, draft findings, and upload reports.</p>
        </div>
      </div>

      <div className="grid-main-side">
        {/* REPORT EDITOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {activeTestId && activeTest ? (
            <form onSubmit={handlePublish} className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <div className="flex-align-center gap-12">
                  <span className="logo-icon" style={{ background: 'rgba(0, 255, 135, 0.1)', color: 'var(--color-success)' }}>
                    <Beaker size={20} />
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>Test Entry: {activeTest.testName}</h3>
                    <p style={{ fontSize: '0.8rem' }}>Patient: {activeTest.patientName} | Ordered by: {activeTest.doctorName}</p>
                  </div>
                </div>
                <span className="hms-badge badge-primary">{activeTest.id}</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', fontSize: '0.82rem' }}>
                <strong>Clinician's Clinical Indication notes:</strong>
                <p style={{ marginTop: '4px', fontSize: '0.8rem' }}>{activeTest.notes}</p>
              </div>

              <div className="hms-form-group">
                <label>Diagnostic Test Metrics & Findings</label>
                <textarea 
                  value={reportText} 
                  onChange={(e) => setReportText(e.target.value)} 
                  className="hms-textarea"
                  placeholder="Input detailed values (e.g. WBC count, hemoglobin, imaging notes, structural annotations)..."
                  rows={6}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setActiveTestId('')} className="hms-btn hms-btn-secondary">
                  Close Form
                </button>
                <button type="submit" className="hms-btn hms-btn-success">
                  <Send size={16} /> Publish Digital Report
                </button>
              </div>
            </form>
          ) : (
            <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '320px', borderStyle: 'dashed' }}>
              <Beaker size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>Load Lab Specimen Order</h3>
              <p style={{ maxWidth: '340px', textAlign: 'center', marginTop: '6px' }}>Click on a pending test item in the right-hand panel queue to open the biochemical report writer.</p>
            </div>
          )}
        </div>

        {/* LAB SPECIMENS QUEUE */}
        <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <div className="flex-align-center gap-8">
            <Activity size={20} style={{ color: 'var(--color-primary)' }} />
            <h3>Lab Test Requests</h3>
          </div>
          <p style={{ fontSize: '0.8rem' }}>Active sample requests pending technician testing.</p>

          <div className="queue-list">
            {pendingTests.length > 0 ? (
              pendingTests.map(test => (
                <div 
                  key={test.id} 
                  onClick={() => handleSelectTest(test.id)}
                  className="queue-item"
                  style={{ 
                    cursor: 'pointer',
                    borderColor: activeTestId === test.id ? 'var(--color-success)' : '',
                    background: activeTestId === test.id ? 'rgba(0, 255, 135, 0.05)' : ''
                  }}
                >
                  <div className="queue-item-info">
                    <h5>{test.testName}</h5>
                    <p style={{ color: 'var(--color-success)' }}>{test.patientName}</p>
                    <p style={{ fontSize: '0.72rem', marginTop: '2px', color: 'var(--text-muted)' }}>Request: {test.doctorName}</p>
                  </div>
                  <span className="hms-badge badge-warning" style={{ fontSize: '0.65rem' }}>Pending</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ✓ Laboratory specimen queue is empty.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTechnicianDashboard;
