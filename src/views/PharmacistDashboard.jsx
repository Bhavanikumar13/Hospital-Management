import React, { useState } from 'react';
import { useHms } from '../context/HmsContext';
import { Clipboard, ShieldAlert, Package, Check, ArrowUpRight, DollarSign } from 'lucide-react';

const PharmacistDashboard = () => {
  const { 
    prescriptions, 
    inventory, 
    dispensePrescription, 
    restockMedicine 
  } = useHms();

  const [restockId, setRestockId] = useState('');
  const [restockAmt, setRestockAmt] = useState(50);

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending');

  const handleRestock = (e) => {
    e.preventDefault();
    if (!restockId || restockAmt <= 0) return;

    restockMedicine(restockId, restockAmt);
    setRestockId('');
    setRestockAmt(50);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Pharmacy Formulary & Inventory</h2>
          <p>Verify e-prescriptions, dispense prescription sheets, check expiry terms, and request stock refills.</p>
        </div>
      </div>

      <div className="grid-main-side">
        {/* INVENTORY DATABASE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="hms-card">
            <div className="flex-align-center gap-8" style={{ marginBottom: '16px' }}>
              <Package size={20} style={{ color: 'var(--color-primary)' }} />
              <h3>Medicine Formulary Inventory</h3>
            </div>
            
            <div className="hms-table-container">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Medicine Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Count</th>
                    <th>Expiry Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(med => {
                    const isLow = med.qty < 15;
                    return (
                      <tr key={med.id} style={{ background: isLow ? 'rgba(255, 183, 3, 0.02)' : '' }}>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{med.id}</td>
                        <td>
                          <div style={{ fontWeight: '500', color: isLow ? 'var(--color-warning)' : 'var(--text-primary)' }}>{med.name}</div>
                          {isLow && (
                            <div style={{ fontSize: '0.68rem', color: 'var(--color-warning)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                              <ShieldAlert size={10} /> Low Stock Limit Reached
                            </div>
                          )}
                        </td>
                        <td><span className="hms-badge badge-primary">{med.category}</span></td>
                        <td style={{ fontWeight: '600' }}>${med.unitPrice.toFixed(2)}</td>
                        <td>
                          <strong style={{ color: isLow ? 'var(--color-warning)' : 'var(--color-success)' }}>{med.qty}</strong>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{med.expiryDate}</td>
                        <td>
                          <button 
                            onClick={() => { setRestockId(med.id); setRestockAmt(50); }}
                            className="hms-btn hms-btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                          >
                            Refill
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PRESCRIPTION PROCESSING & QUICK REFILL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* PRESCRIPTION DISPENSARY */}
          <div className="hms-card">
            <div className="flex-align-center gap-8" style={{ marginBottom: '14px' }}>
              <Clipboard size={18} style={{ color: 'var(--color-primary)' }} />
              <h3>Doctor E-Prescriptions Queue</h3>
            </div>
            <p style={{ fontSize: '0.8rem', marginBottom: '12px' }}>Verify and dispense electronic prescriptions published by physicians.</p>

            <div className="queue-list">
              {pendingPrescriptions.length > 0 ? (
                pendingPrescriptions.map(prx => (
                  <div key={prx.id} className="queue-item" style={{ background: 'rgba(255,255,255,0.01)', padding: '12px' }}>
                    <div className="queue-item-info">
                      <h5 style={{ fontSize: '0.85rem' }}>{prx.medicineName} ({prx.qty} units)</h5>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Patient: {prx.patientName}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-primary)' }}>Prescribed by: {prx.doctorName}</p>
                    </div>
                    <button 
                      onClick={() => dispensePrescription(prx.id)}
                      className="hms-btn hms-btn-success"
                      style={{ padding: '6px 12px', fontSize: '0.72rem' }}
                    >
                      <Check size={12} /> Dispense
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  ✓ All active prescriptions dispensed.
                </div>
              )}
            </div>
          </div>

          {/* QUICK STOCK REFILL FORM */}
          {restockId && (
            <form onSubmit={handleRestock} className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="flex-align-center gap-8">
                <ArrowUpRight size={18} style={{ color: 'var(--color-success)' }} />
                <h3>Formulary Restock Form</h3>
              </div>
              <p style={{ fontSize: '0.8rem' }}>Replenish inventory for: <strong style={{ color: 'var(--color-primary)' }}>{inventory.find(m => m.id === restockId)?.name}</strong></p>

              <div className="hms-form-group">
                <label>Restock Quantity (Units)</label>
                <input 
                  type="number" 
                  value={restockAmt} 
                  onChange={(e) => setRestockAmt(e.target.value)} 
                  className="hms-input"
                  min={1} 
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setRestockId('')} className="hms-btn hms-btn-secondary" style={{ padding: '8px 14px' }}>
                  Cancel
                </button>
                <button type="submit" className="hms-btn hms-btn-success" style={{ padding: '8px 14px' }}>
                  Save Stock
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
