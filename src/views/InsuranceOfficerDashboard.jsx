import React, { useState } from 'react';
import { useHms } from '../context/HmsContext';
import { ShieldCheck, FileText, Check, X, AlertCircle } from 'lucide-react';

const InsuranceOfficerDashboard = () => {
  const { insuranceClaims, processClaim } = useHms();

  const [selectedClaimId, setSelectedClaimId] = useState('');
  
  const pendingClaims = insuranceClaims.filter(c => c.status === 'Pending');
  const activeClaim = insuranceClaims.find(c => c.id === selectedClaimId);

  const handleProcess = (claimId, isApproved) => {
    processClaim(claimId, isApproved);
    setSelectedClaimId('');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Insurance Claims Assessment</h2>
          <p>Verify medical policy guidelines, check coverage details, and approve/reject claims.</p>
        </div>
      </div>

      <div className="grid-main-side">
        {/* CLAIM DETAILS ASSESSOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedClaimId && activeClaim ? (
            <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <div className="flex-align-center gap-12">
                  <span className="logo-icon" style={{ background: 'rgba(123, 44, 255, 0.1)', color: 'var(--color-info)' }}>
                    <ShieldCheck size={20} />
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>Claim Review: {activeClaim.id}</h3>
                    <p style={{ fontSize: '0.8rem' }}>Carrier: {activeClaim.policyName}</p>
                  </div>
                </div>
                <span className="hms-badge badge-warning">Pending Review</span>
              </div>

              {/* Policy Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Insured Patient</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '2px' }}>{activeClaim.patientName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {activeClaim.patientId}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Policy Details</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '2px' }}>No: {activeClaim.policyNo}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date Filed: {activeClaim.fileDate}</div>
                </div>
              </div>

              {/* Charges Summary */}
              <div className="flex-between" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hospital Consultation & Treatment Fees</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Ledger ID: {activeClaim.billingId}</div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                  ${activeClaim.amount.toFixed(2)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setSelectedClaimId('')} 
                  className="hms-btn hms-btn-secondary"
                >
                  Postpone
                </button>
                <button 
                  type="button" 
                  onClick={() => handleProcess(activeClaim.id, false)} 
                  className="hms-btn hms-btn-danger"
                >
                  <X size={16} /> Deny Claim
                </button>
                <button 
                  type="button" 
                  onClick={() => handleProcess(activeClaim.id, true)} 
                  className="hms-btn hms-btn-success"
                >
                  <Check size={16} /> Approve & Settle Coverage
                </button>
              </div>
            </div>
          ) : (
            <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '320px', borderStyle: 'dashed' }}>
              <ShieldCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>Inspect Insurance Claim</h3>
              <p style={{ maxWidth: '340px', textAlign: 'center', marginTop: '6px' }}>Select an active health insurance claim from the audit queue to inspect policy parameters, coverage values, and medical records codes.</p>
            </div>
          )}
        </div>

        {/* CLAIMS AUDIT QUEUE */}
        <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <div className="flex-align-center gap-8">
            <FileText size={20} style={{ color: 'var(--color-primary)' }} />
            <h3>Claims Audit Queue</h3>
          </div>
          <p style={{ fontSize: '0.8rem' }}>Active bills submitted for hospital co-pay / insurance validation.</p>

          <div className="queue-list">
            {pendingClaims.length > 0 ? (
              pendingClaims.map(claim => (
                <div 
                  key={claim.id} 
                  onClick={() => setSelectedClaimId(claim.id)}
                  className="queue-item"
                  style={{ 
                    cursor: 'pointer',
                    borderColor: selectedClaimId === claim.id ? 'var(--color-info)' : '',
                    background: selectedClaimId === claim.id ? 'rgba(123, 44, 255, 0.05)' : ''
                  }}
                >
                  <div className="queue-item-info">
                    <h5>{claim.patientName}</h5>
                    <p style={{ color: 'var(--color-info)', fontWeight: '500' }}>${claim.amount.toFixed(2)}</p>
                    <p style={{ fontSize: '0.72rem', marginTop: '2px', color: 'var(--text-muted)' }}>Policy: {claim.policyName.split(' ')[0]}</p>
                  </div>
                  <span className="hms-badge badge-warning" style={{ fontSize: '0.65rem' }}>Review</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ✓ Insurance claims queue is fully cleared.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceOfficerDashboard;
