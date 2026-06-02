import React, { useState } from 'react';
import { useHms } from '../context/HmsContext';
import { UserPlus, Calendar, Plus, Truck, Bell, ShieldAlert, Key } from 'lucide-react';

const ReceptionistDashboard = () => {
  const { 
    patients, 
    doctors, 
    beds, 
    ambulances, 
    registerPatient, 
    bookAppointment, 
    allocateBed,
    dispatchAmbulance
  } = useHms();

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regContact, setRegContact] = useState('');
  const [regDisease, setRegDisease] = useState('');
  const [regBlood, setRegBlood] = useState('O+');
  const [regInsurance, setRegInsurance] = useState('N/A');
  const [regPolicy, setRegPolicy] = useState('N/A');

  // Walk-in Appointment Form State
  const [aptPatient, setAptPatient] = useState('');
  const [aptDoctor, setAptDoctor] = useState('');
  const [aptTime, setAptTime] = useState('11:00 AM');
  const [aptDate, setAptDate] = useState(new Date().toISOString().split('T')[0]);
  const [aptType, setAptType] = useState('General Consultation');

  // Bed Allocation State
  const [bedPatId, setBedPatId] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');

  const admittedQueue = patients.filter(p => p.status === 'Recommended Admission');
  const availableBeds = beds.filter(b => b.status === 'Available');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regAge) return;

    registerPatient({
      name: regName,
      age: regAge,
      gender: regGender,
      contact: regContact,
      disease: regDisease,
      bloodType: regBlood,
      insuranceProvider: regInsurance,
      insurancePolicyNo: regPolicy
    });

    // Reset Form
    setRegName('');
    setRegAge('');
    setRegContact('');
    setRegDisease('');
    setRegInsurance('N/A');
    setRegPolicy('N/A');
  };

  const handleWalkinSubmit = (e) => {
    e.preventDefault();
    if (!aptPatient || !aptDoctor) return;

    bookAppointment(aptPatient, aptDoctor, aptDate, aptTime, aptType);

    // Reset Form
    setAptPatient('');
    setAptDoctor('');
  };

  const handleBedSubmit = (e) => {
    e.preventDefault();
    if (!bedPatId || !selectedBedId) return;

    allocateBed(bedPatId, selectedBedId);
    setBedPatId('');
    setSelectedBedId('');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Patient Admission & Front Desk Services</h2>
          <p>Register new patients, manage walk-in queues, assign beds, and coordinate ambulance emergency alerts.</p>
        </div>
      </div>

      <div className="grid-main-side">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* PATIENT REGISTRATION FORM */}
          <form onSubmit={handleRegisterSubmit} className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-align-center gap-8" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <UserPlus size={20} style={{ color: 'var(--color-primary)' }} />
              <h3>Register New Patient</h3>
            </div>

            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="hms-form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Mary Jane"
                  className="hms-input"
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="hms-form-group">
                  <label>Age</label>
                  <input 
                    type="number" 
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    placeholder="e.g. 28"
                    className="hms-input"
                    required
                  />
                </div>
                <div className="hms-form-group">
                  <label>Gender</label>
                  <select 
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="hms-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="hms-form-group">
                <label>Contact Number</label>
                <input 
                  type="text" 
                  value={regContact}
                  onChange={(e) => setRegContact(e.target.value)}
                  placeholder="e.g. +1 (555) 829-1928"
                  className="hms-input"
                  required
                />
              </div>
              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="hms-form-group">
                  <label>Symptoms / Diagnosis</label>
                  <input 
                    type="text" 
                    value={regDisease}
                    onChange={(e) => setRegDisease(e.target.value)}
                    placeholder="e.g. Severe Chest Pain"
                    className="hms-input"
                  />
                </div>
                <div className="hms-form-group">
                  <label>Blood Type</label>
                  <select 
                    value={regBlood}
                    onChange={(e) => setRegBlood(e.target.value)}
                    className="hms-select"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="hms-form-group">
                <label>Insurance Provider</label>
                <input 
                  type="text" 
                  value={regInsurance}
                  onChange={(e) => setRegInsurance(e.target.value)}
                  placeholder="e.g. Aetna (Optional)"
                  className="hms-input"
                />
              </div>
              <div className="hms-form-group">
                <label>Insurance Policy Number</label>
                <input 
                  type="text" 
                  value={regPolicy}
                  onChange={(e) => setRegPolicy(e.target.value)}
                  placeholder="e.g. AET-929312"
                  className="hms-input"
                />
              </div>
            </div>

            <button type="submit" className="hms-btn hms-btn-primary" style={{ alignSelf: 'flex-end' }}>
              <Plus size={16} /> Register Patient Profile
            </button>
          </form>

          {/* QUICK WALKIN APPOINTMENT */}
          <form onSubmit={handleWalkinSubmit} className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-align-center gap-8" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
              <h3>Book Walk-in / Scheduling</h3>
            </div>

            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="hms-form-group">
                <label>Select Registered Patient</label>
                <select 
                  value={aptPatient}
                  onChange={(e) => setAptPatient(e.target.value)}
                  className="hms-select"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="hms-form-group">
                <label>Assign Physician</label>
                <select 
                  value={aptDoctor}
                  onChange={(e) => setAptDoctor(e.target.value)}
                  className="hms-select"
                  required
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-3" style={{ gap: '16px' }}>
              <div className="hms-form-group">
                <label>Booking Date</label>
                <input 
                  type="date" 
                  value={aptDate}
                  onChange={(e) => setAptDate(e.target.value)}
                  className="hms-input"
                  required
                />
              </div>
              <div className="hms-form-group">
                <label>Time Slot</label>
                <select 
                  value={aptTime}
                  onChange={(e) => setAptTime(e.target.value)}
                  className="hms-select"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
              <div className="hms-form-group">
                <label>Clinic Type</label>
                <select 
                  value={aptType}
                  onChange={(e) => setAptType(e.target.value)}
                  className="hms-select"
                >
                  <option value="General Consultation">Walk-in General Clinic</option>
                  <option value="Emergency Consultation">Emergency Clinic</option>
                  <option value="Cardiology Follow-up">Specialist Cardiology</option>
                </select>
              </div>
            </div>

            <button type="submit" className="hms-btn hms-btn-primary" style={{ alignSelf: 'flex-end' }}>
              Confirm Walk-in & Dispatch Ticket
            </button>
          </form>
        </div>

        {/* SIDE BAR: BED WARD ASSIGNMENT & AMBULANCES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* BED ASSIGNMENT CONTROLLER */}
          <div className="hms-card">
            <h3>Ward Bed Assignment Queue</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: '14px' }}>Clinician recommended admissions requiring bed placement.</p>

            {admittedQueue.length > 0 ? (
              <form onSubmit={handleBedSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="hms-form-group">
                  <label>Select Admitting Patient</label>
                  <select 
                    value={bedPatId}
                    onChange={(e) => setBedPatId(e.target.value)}
                    className="hms-select"
                    required
                  >
                    <option value="">-- Choose Patient --</option>
                    {admittedQueue.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.disease})</option>
                    ))}
                  </select>
                </div>

                <div className="hms-form-group">
                  <label>Assign Available Room/Bed</label>
                  <select 
                    value={selectedBedId}
                    onChange={(e) => setSelectedBedId(e.target.value)}
                    className="hms-select"
                    required
                  >
                    <option value="">-- Choose Bed --</option>
                    {availableBeds.map(b => (
                      <option key={b.id} value={b.id}>{b.id} - {b.type}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="hms-btn hms-btn-success" style={{ justifyContent: 'center' }}>
                  Allocate Bed & Assign Nurse
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '16px 0' }}>
                ✓ Bed admission queue is currently empty.
              </div>
            )}
          </div>

          {/* AMBULANCE DISPATCH CONTROLLERS */}
          <div className="hms-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex-align-center gap-8">
              <Truck size={20} style={{ color: 'var(--color-danger)' }} />
              <h3>Ambulance Fleet Status</h3>
            </div>
            <p style={{ fontSize: '0.8rem' }}>Live GPS emergency responses in the municipality.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
              {ambulances.map(amb => (
                <div key={amb.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
                  <div className="flex-between">
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{amb.id} ({amb.driver})</span>
                    <span className={`hms-badge ${
                      amb.status === 'Available' ? 'badge-success' : 
                      amb.status === 'Dispatched' ? 'badge-danger pulse-red-glow' : 'badge-primary'
                    }`} style={{ fontSize: '0.62rem' }}>
                      {amb.status}
                    </span>
                  </div>

                  {amb.status === 'Dispatched' && (
                    <div style={{ marginTop: '10px' }}>
                      <div className="flex-between" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Progress: {amb.progress}%</span>
                        <span>ETA: {amb.eta}s</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ background: 'var(--color-danger)', width: `${amb.progress}%`, height: '100%' }}></div>
                      </div>
                      
                      {/* Active SVG mini-map tracker */}
                      <div className="map-canvas">
                        <div className="map-pickup-node">ER</div>
                        <div className="map-line"></div>
                        <div className="map-ambulance-icon" style={{ left: `${15 + amb.progress * 0.65}%` }}>
                          <Truck size={20} />
                        </div>
                        <div className="map-hospital-node">H</div>
                        <div className="map-legend">
                          <span>Pickup: Accident Site</span>
                          <span>Destination: Hospital ER</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {amb.status === 'Available' && (
                    <button 
                      onClick={() => dispatchAmbulance(amb.id)} 
                      className="hms-btn hms-btn-danger"
                      style={{ padding: '6px 12px', fontSize: '0.72rem', width: '100%', justifyContent: 'center', marginTop: '10px' }}
                    >
                      Emergency Dispatch Ambulance
                    </button>
                  )}
                  {amb.status === 'Arrived' && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '8px', fontWeight: '500', textAlign: 'center' }}>
                      ✓ Patient delivered at ER Bay. Handing off to trauma nurses.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
