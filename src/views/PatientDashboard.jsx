import React, { useState } from 'react';
import { useHms } from '../context/HmsContext';
import { User, Calendar, FileText, CreditCard, Activity, Clock, Check, AlertCircle } from 'lucide-react';

const PatientDashboard = () => {
  const { 
    patients, 
    doctors, 
    appointments, 
    bookAppointment, 
    payPatientBill, 
    claimInsurance 
  } = useHms();

  // For the demonstration, we'll login as "John Doe" (PAT-001) by default.
  // The user can interact as PAT-001.
  const patientId = 'PAT-001'; 
  const patient = patients.find(p => p.id === patientId);

  const [bookingDoc, setBookingDoc] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingDate, setBookingDate] = useState('2026-05-30');
  const [bookingType, setBookingType] = useState('General Consultation');

  const myAppointments = appointments.filter(apt => apt.patientId === patientId);

  const handleBook = (e) => {
    e.preventDefault();
    if (!bookingDoc) return;
    bookAppointment(patientId, bookingDoc, bookingDate, bookingTime, bookingType);
    setBookingDoc('');
  };

  if (!patient) {
    return <div className="hms-card">Loading patient profile...</div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Patient Health & Services Portal</h2>
          <p>Schedule doctor appointments, monitor EMR health ledger, process invoices, and file insurance claims.</p>
        </div>
        <div className="flex-align-center gap-12" style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <User size={18} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{patient.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MRN: {patient.id}</div>
          </div>
        </div>
      </div>

      <div className="grid-main-side">
        {/* HEALTH TIMELINE & EMR LEDGER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="hms-card">
            <h3>My Electronic Medical Record (EMR)</h3>
            <p style={{ marginBottom: '20px' }}>Your central digital health ledger. Managed and encrypted by hospital clinicians.</p>
            
            <div className="emr-timeline">
              {patient.emr && patient.emr.length > 0 ? (
                patient.emr.map((record, index) => (
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
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No medical records logged yet.
                </div>
              )}
            </div>
          </div>

          {/* BILLING AND INVOICES */}
          <div className="hms-card">
            <div className="flex-align-center gap-8" style={{ marginBottom: '16px' }}>
              <CreditCard size={20} style={{ color: 'var(--color-primary)' }} />
              <h3>Financial Ledger & Claims</h3>
            </div>
            <p style={{ marginBottom: '16px' }}>View outstanding medical bills, process instant payments, or dispatch insurance claims.</p>

            <div className="hms-table-container">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Invoice Detail</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.billing && patient.billing.length > 0 ? (
                    patient.billing.map(bill => (
                      <tr key={bill.id}>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bill.date}</td>
                        <td>
                          <div style={{ fontWeight: '500' }}>{bill.title}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>INV: {bill.id}</div>
                        </td>
                        <td style={{ fontWeight: '600' }}>${bill.amount.toFixed(2)}</td>
                        <td>
                          <span className={`hms-badge ${
                            bill.status === 'Paid' ? 'badge-success' : 
                            bill.status === 'Claimed-Pending' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {bill.status === 'Paid' && <Check size={12} />}
                            {bill.status === 'Claimed-Pending' && <Clock size={12} />}
                            {bill.status === 'Unpaid' && <AlertCircle size={12} />}
                            {bill.status}
                          </span>
                        </td>
                        <td>
                          {bill.status === 'Unpaid' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => payPatientBill(patient.id, bill.id)} 
                                className="hms-btn hms-btn-success"
                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                              >
                                Pay Now
                              </button>
                              {patient.insuranceProvider !== 'N/A' && (
                                <button 
                                  onClick={() => claimInsurance(patient.id, bill.id)} 
                                  className="hms-btn hms-btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                >
                                  Claim Insurance
                                </button>
                              )}
                            </div>
                          )}
                          {bill.status === 'Claimed-Pending' && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending Insur. Approval</span>
                          )}
                          {bill.status === 'Paid' && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '500' }}>Cleared</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px' }}>
                        No outstanding or historical invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOOKING APPOINTMENTS DRAWER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <form onSubmit={handleBook} className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-align-center gap-8">
              <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
              <h3>Book a Consultation</h3>
            </div>
            
            <div className="hms-form-group">
              <label>Select Physician</label>
              <select 
                value={bookingDoc} 
                onChange={(e) => setBookingDoc(e.target.value)}
                className="hms-select"
                required
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="hms-form-group">
              <label>Type of Consultation</label>
              <select 
                value={bookingType} 
                onChange={(e) => setBookingType(e.target.value)}
                className="hms-select"
              >
                <option value="General Consultation">General Checkup</option>
                <option value="Cardiology Follow-up">Cardiology Review</option>
                <option value="Neurology Checkup">Neurology Diagnostic</option>
                <option value="Surgical Evaluation">Surgical Consultation</option>
              </select>
            </div>

            <div className="hms-form-group">
              <label>Consultation Date</label>
              <input 
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="hms-input"
                required
              />
            </div>

            <div className="hms-form-group">
              <label>Select Time Slot</label>
              <select 
                value={bookingTime} 
                onChange={(e) => setBookingTime(e.target.value)}
                className="hms-select"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
              </select>
            </div>

            <button type="submit" className="hms-btn hms-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Confirm Booking & File Invoice
            </button>
          </form>

          {/* MY APPOINTMENTS LIST */}
          <div className="hms-card">
            <h3>My Scheduled Bookings</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: '14px' }}>Timeline of upcoming visits.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myAppointments.length > 0 ? (
                myAppointments.map(apt => (
                  <div key={apt.id} className="queue-item" style={{ background: 'rgba(255,255,255,0.01)', padding: '10px 14px' }}>
                    <div>
                      <h5 style={{ fontSize: '0.85rem' }}>{apt.doctorName}</h5>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-primary)' }}>{apt.date} at {apt.time}</p>
                    </div>
                    <span className={`hms-badge ${apt.status === 'Consulted' ? 'badge-success' : apt.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                      {apt.status}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No historical appointments booked.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
