import React, { createContext, useContext, useState, useEffect } from 'react';

const HmsContext = createContext();

export const useHms = () => {
  const context = useContext(HmsContext);
  if (!context) {
    throw new Error('useHms must be used within an HmsProvider');
  }
  return context;
};

export const HmsProvider = ({ children }) => {
  // --- REAL-TIME NOTIFICATION SYSTEM ---
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'System Initialized', message: 'Smart HMS is running on Local Database Engine.', time: new Date().toLocaleTimeString() },
    { id: 2, type: 'warning', title: 'Low Stock Alert', message: 'Atorvastatin (Cholesterol) is low in pharmacy inventory (8 units remaining).', time: new Date().toLocaleTimeString() }
  ]);

  const addNotification = (type, title, message) => {
    const newAlert = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // --- INITIAL MOCK DATA ---
  
  // 1. Patient Profiles
  const [patients, setPatients] = useState([
    {
      id: 'PAT-001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      contact: '+1 (555) 123-4567',
      disease: 'Hypertension',
      bloodType: 'O+',
      insuranceProvider: 'Blue Cross Shield',
      insurancePolicyNo: 'BCS-998822',
      vitals: { bp: '135/85', heartRate: 78, temp: 98.6, spo2: 98, lastUpdated: '10:30 AM' },
      status: 'Outpatient', // Admitted, Outpatient, Discharged, Emergency
      admittedBed: null,
      emr: [
        { date: '2026-05-10', type: 'Diagnosis', title: 'Chronic Hypertension', details: 'Patient has consistently elevated blood pressure. Recommended diet changes and daily medication.' },
        { date: '2026-05-10', type: 'Prescription', title: 'Metoprolol 50mg', details: 'Take 1 tablet daily in the morning.' }
      ],
      billing: [
        { id: 'BIL-501', title: 'Cardiology Consultation', amount: 150.00, status: 'Paid', date: '2026-05-10' }
      ]
    },
    {
      id: 'PAT-002',
      name: 'Sarah Connor',
      age: 38,
      gender: 'Female',
      contact: '+1 (555) 987-6543',
      disease: 'Migraine / Cluster Headaches',
      bloodType: 'A-',
      insuranceProvider: 'Aetna Healthcare',
      insurancePolicyNo: 'AET-112233',
      vitals: { bp: '120/80', heartRate: 72, temp: 98.4, spo2: 99, lastUpdated: '09:15 AM' },
      status: 'Admitted',
      admittedBed: 'B-102',
      emr: [
        { date: '2026-05-25', type: 'Diagnosis', title: 'Acute Migraine Flare-up', details: 'Admitted for IV pain management and hydration due to severe nausea and headache.' },
        { date: '2026-05-25', type: 'Lab Report', title: 'Brain MRI Scan', details: 'No acute structural brain pathology. Mild mucosal thickening in paranasal sinuses.' }
      ],
      billing: [
        { id: 'BIL-502', title: 'Ward Admission & IV Therapy', amount: 1200.00, status: 'Unpaid', date: '2026-05-25' }
      ]
    },
    {
      id: 'PAT-003',
      name: 'Bruce Wayne',
      age: 42,
      gender: 'Male',
      contact: '+1 (555) 777-8888',
      disease: 'Multiple Fractures & Contusions',
      bloodType: 'AB-',
      insuranceProvider: 'Wayne Enterprises Insurance',
      insurancePolicyNo: 'WAYNE-007',
      vitals: { bp: '115/75', heartRate: 82, temp: 99.1, spo2: 97, lastUpdated: '10:45 AM' },
      status: 'Admitted',
      admittedBed: 'ICU-301',
      emr: [
        { date: '2026-05-28', type: 'Diagnosis', title: 'Rib Fractures & Severe Bruising', details: 'Patient admitted following traumatic fall. Rest, rib compression wrap, and active vital monitoring.' }
      ],
      billing: [
        { id: 'BIL-503', title: 'ICU Bed Charges & Specialist Visit', amount: 4500.00, status: 'Claimed-Pending', date: '2026-05-28' }
      ]
    }
  ]);

  // 2. Doctor Profiles
  const [doctors] = useState([
    { id: 'DOC-001', name: 'Dr. Alexander Pierce', specialty: 'Cardiology', availability: 'Available', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100' },
    { id: 'DOC-002', name: 'Dr. Meredith Grey', specialty: 'General Surgery', availability: 'Available', photo: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=100' },
    { id: 'DOC-003', name: 'Dr. Gregory House', specialty: 'Diagnostics & Neurology', availability: 'In Surgery', photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100' },
    { id: 'DOC-004', name: 'Dr. Elizabeth Blackwell', specialty: 'Pediatrics', availability: 'On Break', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100' }
  ]);

  // 3. Appointments Database
  const [appointments, setAppointments] = useState([
    { id: 'APT-101', patientId: 'PAT-001', patientName: 'John Doe', doctorId: 'DOC-001', doctorName: 'Dr. Alexander Pierce', date: '2026-05-29', time: '11:00 AM', status: 'Pending', type: 'Cardiology Follow-up' },
    { id: 'APT-102', patientId: 'PAT-002', patientName: 'Sarah Connor', doctorId: 'DOC-003', doctorName: 'Dr. Gregory House', date: '2026-05-29', time: '01:30 PM', status: 'Consulted', type: 'Neurological Checkup' }
  ]);

  // 4. Laboratory Database (Lab Reports Request Queue)
  const [labTests, setLabTests] = useState([
    { id: 'LAB-201', patientId: 'PAT-002', patientName: 'Sarah Connor', doctorId: 'DOC-003', doctorName: 'Dr. Gregory House', testName: 'Complete Blood Count (CBC)', status: 'Pending', notes: 'Assess electrolyte balance and hematocrit levels.', report: '', date: '2026-05-29' }
  ]);

  // 5. Pharmacy Inventory & Prescription Queue
  const [prescriptions, setPrescriptions] = useState([
    { id: 'PRX-301', patientId: 'PAT-001', patientName: 'John Doe', doctorId: 'DOC-001', doctorName: 'Dr. Alexander Pierce', medicineName: 'Metoprolol 50mg', qty: 30, status: 'Dispensed', date: '2026-05-29' },
    { id: 'PRX-302', patientId: 'PAT-002', patientName: 'Sarah Connor', doctorId: 'DOC-003', doctorName: 'Dr. Gregory House', medicineName: 'Ibuprofen 400mg', qty: 20, status: 'Pending', date: '2026-05-29' }
  ]);

  const [inventory, setInventory] = useState([
    { id: 'MED-001', name: 'Amoxicillin 500mg', category: 'Antibiotic', qty: 45, unitPrice: 15.00, expiryDate: '2028-09-12' },
    { id: 'MED-002', name: 'Ibuprofen 400mg', category: 'Pain Reliever', qty: 100, unitPrice: 8.50, expiryDate: '2027-11-20' },
    { id: 'MED-003', name: 'Atorvastatin 20mg', category: 'Cholesterol', qty: 8, unitPrice: 22.00, expiryDate: '2027-02-15' }, // Alert triggers
    { id: 'MED-004', name: 'Metformin 850mg', category: 'Diabetes', qty: 80, unitPrice: 12.00, expiryDate: '2028-04-30' },
    { id: 'MED-005', name: 'Albuterol Inhaler', category: 'Asthma/Respiratory', qty: 12, unitPrice: 35.00, expiryDate: '2026-10-18' }, // Alert triggers
    { id: 'MED-006', name: 'Metoprolol 50mg', category: 'Beta Blocker', qty: 30, unitPrice: 18.00, expiryDate: '2027-05-01' }
  ]);

  // 6. Hospital Beds Layout
  const [beds, setBeds] = useState([
    { id: 'B-101', type: 'General Ward', patientId: null, status: 'Available' },
    { id: 'B-102', type: 'General Ward', patientId: 'PAT-002', status: 'Occupied' },
    { id: 'B-103', type: 'General Ward', patientId: null, status: 'Available' },
    { id: 'B-104', type: 'General Ward', patientId: null, status: 'Available' },
    { id: 'ICU-301', type: 'ICU', patientId: 'PAT-003', status: 'Occupied' },
    { id: 'ICU-302', type: 'ICU', patientId: null, status: 'Available' },
    { id: 'ICU-303', type: 'ICU', patientId: null, status: 'Available' },
    { id: 'EMG-01', type: 'Emergency Bay', patientId: null, status: 'Available' },
    { id: 'EMG-02', type: 'Emergency Bay', patientId: null, status: 'Available' }
  ]);

  // 7. Insurance Claims Database
  const [insuranceClaims, setInsuranceClaims] = useState([
    { id: 'CLM-401', patientId: 'PAT-003', patientName: 'Bruce Wayne', billingId: 'BIL-503', policyName: 'Wayne Enterprises Insurance', policyNo: 'WAYNE-007', amount: 4500.00, status: 'Pending', fileDate: '2026-05-28' }
  ]);

  // 8. Ambulance Dispatch System
  const [ambulances, setAmbulances] = useState([
    { id: 'AMB-01', driver: 'Marcus Miller', status: 'Available', eta: 0, progress: 0, location: 'Hospital Base' },
    { id: 'AMB-02', driver: 'Sarah Connor', status: 'In Service', eta: 0, progress: 100, location: 'City Center' },
    { id: 'AMB-03', driver: 'Clark Kent', status: 'Available', eta: 0, progress: 0, location: 'Hospital Base' }
  ]);

  // 9. Backups logs list
  const [backupLogs, setBackupLogs] = useState([
    { time: '2026-05-28 00:00:01', action: 'SYSTEM_BACKUP_AUTO', status: 'SUCCESS', details: 'Encrypted daily backup stored on Azure Cloud S3. Size: 1.2 GB.' }
  ]);

  // --- REAL-TIME AMBULANCE SIMULATION TIMER ---
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Ambulance ETA Progress
      setAmbulances(prev => 
        prev.map(amb => {
          if (amb.status === 'Dispatched' && amb.eta > 0) {
            const nextProgress = Math.min(amb.progress + 15, 100);
            const nextEta = Math.max(amb.eta - 1, 0);
            
            if (nextEta === 0) {
              // Ambulance arrived at scene/hospital, trigger triage admission simulation!
              setTimeout(() => {
                handleAmbulanceArrival(amb.id);
              }, 500);
              return { ...amb, status: 'Arrived', eta: 0, progress: 100, location: 'Hospital ER Gate' };
            }
            return { ...amb, progress: nextProgress, eta: nextEta, location: `En Route (${nextProgress}% finished)` };
          }
          return amb;
        })
      );

      // 2. Micro-simulate vital signs fluctuation for admitted patients (gives a living sense to Nurse Dashboard)
      setPatients(prev => 
        prev.map(p => {
          if (p.status === 'Admitted' && p.vitals) {
            const bpParts = p.vitals.bp.split('/');
            let systolic = parseInt(bpParts[0]) + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
            let diastolic = parseInt(bpParts[1]) + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
            let hr = p.vitals.heartRate + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2);
            let temp = p.vitals.temp + (Math.random() > 0.5 ? 0.1 : -0.1) * Math.floor(Math.random() * 2) * 0.1;
            
            systolic = Math.max(90, Math.min(systolic, 180));
            diastolic = Math.max(60, Math.min(diastolic, 110));
            hr = Math.max(60, Math.min(hr, 120));
            temp = Math.max(96.0, Math.min(temp, 104.0));

            return {
              ...p,
              vitals: {
                ...p.vitals,
                bp: `${systolic}/${diastolic}`,
                heartRate: hr,
                temp: parseFloat(temp.toFixed(1)),
                lastUpdated: new Date().toLocaleTimeString()
              }
            };
          }
          return p;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAmbulanceArrival = (ambId) => {
    addNotification('danger', 'Ambulance Arrived', `${ambId} has brought a critical patient to the ER Bay. Immediately assign triage priority.`);
    
    // Auto register a dummy emergency patient
    const newEmergencyPatient = {
      id: `PAT-EMG-${Math.floor(100 + Math.random() * 900)}`,
      name: 'Trauma Victim (Unknown)',
      age: 30,
      gender: 'Unknown',
      contact: 'N/A',
      disease: 'Severe Trauma / Internal Bleeding',
      bloodType: 'O-',
      insuranceProvider: 'N/A',
      insurancePolicyNo: 'N/A',
      vitals: { bp: '90/55', heartRate: 110, temp: 97.8, spo2: 91, lastUpdated: new Date().toLocaleTimeString() },
      status: 'Emergency',
      admittedBed: 'EMG-01',
      emr: [
        { date: new Date().toISOString().split('T')[0], type: 'Diagnosis', title: 'Acute Shock & Haemorrhage', details: 'ER admission via Ambulance. Patient is unresponsive. Active blood transfusion recommended.' }
      ],
      billing: [
        { id: `BIL-${Math.floor(600 + Math.random() * 300)}`, title: 'Emergency Room Resuscitation', amount: 950.00, status: 'Unpaid', date: new Date().toISOString().split('T')[0] }
      ]
    };

    setPatients(prev => [newEmergencyPatient, ...prev]);
    
    // Allocate emergency bed EMG-01
    setBeds(prev => 
      prev.map(bed => {
        if (bed.id === 'EMG-01') {
          return { ...bed, patientId: newEmergencyPatient.id, status: 'Occupied' };
        }
        return bed;
      })
    );
  };

  // --- ACTIONS & OPERATIONS ---

  // 1. Patient Registration
  const registerPatient = (patientData) => {
    const nextId = `PAT-00${patients.length + 1}`;
    const newPatient = {
      id: nextId,
      name: patientData.name,
      age: parseInt(patientData.age),
      gender: patientData.gender,
      contact: patientData.contact,
      disease: patientData.disease || 'General Symptoms',
      bloodType: patientData.bloodType || 'O+',
      insuranceProvider: patientData.insuranceProvider || 'N/A',
      insurancePolicyNo: patientData.insurancePolicyNo || 'N/A',
      vitals: { bp: '120/80', heartRate: 72, temp: 98.6, spo2: 98, lastUpdated: new Date().toLocaleTimeString() },
      status: 'Outpatient',
      admittedBed: null,
      emr: [
        { date: new Date().toISOString().split('T')[0], type: 'Diagnosis', title: 'Initial Consultation', details: `Registered patient with complaints of: ${patientData.disease}.` }
      ],
      billing: []
    };

    setPatients(prev => [...prev, newPatient]);
    addNotification('success', 'Patient Registered', `Patient ${newPatient.name} successfully registered. ID: ${newPatient.id}`);
    return newPatient;
  };

  // 2. Book Appointment
  const bookAppointment = (patientId, doctorId, date, time, type) => {
    const patientObj = patients.find(p => p.id === patientId);
    const doctorObj = doctors.find(d => d.id === doctorId);

    if (!patientObj || !doctorObj) return null;

    const newApt = {
      id: `APT-${Math.floor(200 + Math.random() * 800)}`,
      patientId,
      patientName: patientObj.name,
      doctorId,
      doctorName: doctorObj.name,
      date,
      time,
      status: 'Pending',
      type: type || 'General Consultation'
    };

    setAppointments(prev => [...prev, newApt]);
    addNotification('info', 'Appointment Booked', `${patientObj.name} booked with ${doctorObj.name} for ${date} at ${time}.`);
    
    // Add bill for Consultation
    const billingId = `BIL-${Math.floor(600 + Math.random() * 300)}`;
    const consultationBill = {
      id: billingId,
      title: `${type || 'General'} Consultation (${doctorObj.name})`,
      amount: 150.00,
      status: 'Unpaid',
      date
    };

    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          return { ...p, billing: [consultationBill, ...p.billing] };
        }
        return p;
      })
    );

    return newApt;
  };

  // 3. Cancel Appointment
  const cancelAppointment = (aptId) => {
    setAppointments(prev => 
      prev.map(apt => {
        if (apt.id === aptId) {
          addNotification('warning', 'Appointment Canceled', `Appointment ${aptId} has been canceled.`);
          return { ...apt, status: 'Canceled' };
        }
        return apt;
      })
    );
  };

  // 4. Complete Doctor Consultation (Diagnosis, Prescriptions, Lab Tests, Admission)
  const completeConsultation = (aptId, diagnosisNotes, prescriptionItems, requestedLabs, admissionRecommended) => {
    const aptObj = appointments.find(a => a.id === aptId);
    if (!aptObj) return;

    // Update appointment status to Consulted
    setAppointments(prev => 
      prev.map(a => (a.id === aptId ? { ...a, status: 'Consulted' } : a))
    );

    const patientId = aptObj.patientId;
    const doctorName = aptObj.doctorName;
    const currentDate = new Date().toISOString().split('T')[0];

    // Create EMR Record
    const emrEntries = [];
    if (diagnosisNotes) {
      emrEntries.push({
        date: currentDate,
        type: 'Diagnosis',
        title: `Consultation with ${doctorName}`,
        details: diagnosisNotes
      });
    }

    // Process Prescriptions
    if (prescriptionItems && prescriptionItems.length > 0) {
      prescriptionItems.forEach(item => {
        const prxId = `PRX-${Math.floor(400 + Math.random() * 600)}`;
        const newPrx = {
          id: prxId,
          patientId,
          patientName: aptObj.patientName,
          doctorId: aptObj.doctorId,
          doctorName: aptObj.doctorName,
          medicineName: item.name,
          qty: parseInt(item.qty),
          status: 'Pending',
          date: currentDate
        };

        setPrescriptions(prev => [newPrx, ...prev]);

        emrEntries.push({
          date: currentDate,
          type: 'Prescription',
          title: `E-Prescription: ${item.name} (${item.qty} units)`,
          details: `Prescribed by ${doctorName}. Pending pharmacy verification.`
        });
      });

      addNotification('info', 'Prescription Written', `E-Prescription generated for ${aptObj.patientName}. Sent to Pharmacy.`);
    }

    // Process Lab Request
    if (requestedLabs && requestedLabs.length > 0) {
      requestedLabs.forEach(labName => {
        const labId = `LAB-${Math.floor(300 + Math.random() * 700)}`;
        const newLab = {
          id: labId,
          patientId,
          patientName: aptObj.patientName,
          doctorId: aptObj.doctorId,
          doctorName: aptObj.doctorName,
          testName: labName,
          status: 'Pending',
          notes: 'Doctor requested diagnostic review.',
          report: '',
          date: currentDate
        };

        setLabTests(prev => [newLab, ...prev]);

        emrEntries.push({
          date: currentDate,
          type: 'Lab Request',
          title: `Diagnostic Request: ${labName}`,
          details: `Requested by ${doctorName}. Pending technician assessment.`
        });
      });

      addNotification('info', 'Lab Test Ordered', `Lab Diagnostics ordered for ${aptObj.patientName}. Sent to Laboratory.`);
    }

    // Process Admission Recommendation
    let bedAllocationText = '';
    if (admissionRecommended) {
      // Set patient status to Recommended Admission, Nurse handles allocation
      setPatients(prev => 
        prev.map(p => {
          if (p.id === patientId) {
            return { ...p, status: 'Recommended Admission' };
          }
          return p;
        })
      );
      addNotification('warning', 'Admission Recommended', `Admission order filed for ${aptObj.patientName}. Shift to ward queue.`);
    }

    // Update Patient EMR and add consultation charges
    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            emr: [...emrEntries, ...p.emr]
          };
        }
        return p;
      })
    );
  };

  // 5. Allocate Ward Bed (Nurse)
  const allocateBed = (patientId, bedId) => {
    const bed = beds.find(b => b.id === bedId);
    const patientObj = patients.find(p => p.id === patientId);

    if (!bed || !patientObj || bed.status !== 'Available') return;

    // Occupy bed
    setBeds(prev => 
      prev.map(b => (b.id === bedId ? { ...b, patientId, status: 'Occupied' } : b))
    );

    // Update Patient Profile
    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'Admitted',
            admittedBed: bedId,
            emr: [
              {
                date: new Date().toISOString().split('T')[0],
                type: 'Admission',
                title: `Room Allocation: Bed ${bedId}`,
                details: `Admitted into ${bed.type}. Nurse assigned for monitoring.`
              },
              ...p.emr
            ],
            // Append bed charges
            billing: [
              {
                id: `BIL-${Math.floor(700 + Math.random() * 300)}`,
                title: `Room Charges: Bed ${bedId} (${bed.type})`,
                amount: bed.type === 'ICU' ? 1500.00 : 400.00,
                status: 'Unpaid',
                date: new Date().toISOString().split('T')[0]
              },
              ...p.billing
            ]
          };
        }
        return p;
      })
    );

    addNotification('success', 'Bed Allocated', `${patientObj.name} has been assigned Bed ${bedId}.`);
  };

  // 6. Discharge Patient
  const dischargePatient = (patientId) => {
    const patientObj = patients.find(p => p.id === patientId);
    if (!patientObj) return;

    const bedId = patientObj.admittedBed;

    // Free bed
    if (bedId) {
      setBeds(prev => 
        prev.map(b => (b.id === bedId ? { ...b, patientId: null, status: 'Available' } : b))
      );
    }

    // Update Patient Profile
    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'Discharged',
            admittedBed: null,
            emr: [
              {
                date: new Date().toISOString().split('T')[0],
                type: 'Discharge',
                title: 'Hospital Discharge Summary',
                details: 'Patient treated successfully, vitals stable. Discharged with home care guidelines.'
              },
              ...p.emr
            ]
          };
        }
        return p;
      })
    );

    addNotification('success', 'Patient Discharged', `${patientObj.name} discharged. Bed ${bedId || ''} is now vacant.`);
  };

  // 7. Nurse updates Vitals
  const saveVitals = (patientId, bp, heartRate, temp, spo2) => {
    const patientObj = patients.find(p => p.id === patientId);
    if (!patientObj) return;

    const newVitals = {
      bp,
      heartRate: parseInt(heartRate),
      temp: parseFloat(temp),
      spo2: parseInt(spo2),
      lastUpdated: new Date().toLocaleTimeString()
    };

    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          return { ...p, vitals: newVitals };
        }
        return p;
      })
    );

    // Dynamic alert trigger based on vitals
    if (newVitals.spo2 < 92) {
      addNotification('danger', 'Critical Vitals Alert', `Low oxygen levels (SpO2: ${newVitals.spo2}%) reported for patient ${patientObj.name}. Immediate review required!`);
    } else if (newVitals.heartRate > 115 || newVitals.heartRate < 50) {
      addNotification('warning', 'Vitals Warning', `Abnormal Heart Rate (${newVitals.heartRate} bpm) flagged for patient ${patientObj.name}.`);
    } else {
      addNotification('success', 'Vitals Updated', `Vitals updated for ${patientObj.name}. (SpO2: ${newVitals.spo2}%, Temp: ${newVitals.temp}°F)`);
    }
  };

  // 8. Pharmacist processes e-prescription
  const dispensePrescription = (prxId) => {
    const prx = prescriptions.find(p => p.id === prxId);
    if (!prx || prx.status !== 'Pending') return;

    // Check inventory availability
    const medItem = inventory.find(m => m.name.toLowerCase().includes(prx.medicineName.toLowerCase()) || prx.medicineName.toLowerCase().includes(m.name.toLowerCase()));
    
    if (!medItem) {
      addNotification('danger', 'Pharmacy Error', `Medicine "${prx.medicineName}" not found in hospital Formulary database.`);
      return;
    }

    if (medItem.qty < prx.qty) {
      addNotification('danger', 'Stock Out Alert', `Insufficient pharmacy stock. Required: ${prx.qty}, Available: ${medItem.qty} of ${medItem.name}.`);
      return;
    }

    // Deduct stock
    setInventory(prev => 
      prev.map(m => {
        if (m.id === medItem.id) {
          const nextQty = m.qty - prx.qty;
          if (nextQty < 15) {
            // Send restock alert to admin/dashboard
            setTimeout(() => {
              addNotification('warning', 'Low Stock Triggered', `${m.name} is running critically low. Only ${nextQty} units left in central Pharmacy.`);
            }, 1000);
          }
          return { ...m, qty: nextQty };
        }
        return m;
      })
    );

    // Update prescription status
    setPrescriptions(prev => 
      prev.map(p => (p.id === prxId ? { ...p, status: 'Dispensed' } : p))
    );

    // Add medicine invoice to patient's bill
    const price = medItem.unitPrice * prx.qty;
    const pharmacyBill = {
      id: `BIL-${Math.floor(800 + Math.random() * 200)}`,
      title: `Pharmacy Dispensed: ${medItem.name} (${prx.qty} units)`,
      amount: price,
      status: 'Unpaid',
      date: new Date().toISOString().split('T')[0]
    };

    setPatients(prev => 
      prev.map(p => {
        if (p.id === prx.patientId) {
          return {
            ...p,
            billing: [pharmacyBill, ...p.billing]
          };
        }
        return p;
      })
    );

    addNotification('success', 'Prescription Dispensed', `Medicines dispensed to ${prx.patientName}. Invoice added: $${price.toFixed(2)}.`);
  };

  // Restock Pharmacy Medicine (Pharmacist/Admin)
  const restockMedicine = (medId, amount) => {
    setInventory(prev => 
      prev.map(m => {
        if (m.id === medId) {
          const nextQty = m.qty + parseInt(amount);
          addNotification('success', 'Inventory Updated', `Restocked ${m.name} (+${amount} units). New Qty: ${nextQty}.`);
          return { ...m, qty: nextQty };
        }
        return m;
      })
    );
  };

  // 9. Lab Technician uploads report
  const submitLabReport = (labId, reportDetails) => {
    const labTest = labTests.find(t => t.id === labId);
    if (!labTest) return;

    // Update lab request status
    setLabTests(prev => 
      prev.map(t => (t.id === labId ? { ...t, status: 'Completed', report: reportDetails } : t))
    );

    const currentDate = new Date().toISOString().split('T')[0];

    // Add diagnostic results to patient's EMR
    setPatients(prev => 
      prev.map(p => {
        if (p.id === labTest.patientId) {
          return {
            ...p,
            emr: [
              {
                date: currentDate,
                type: 'Lab Report',
                title: `Lab Results: ${labTest.testName}`,
                details: `Report Details: ${reportDetails}. Uploaded by Laboratory.`
              },
              ...p.emr
            ],
            // Add lab charges
            billing: [
              {
                id: `BIL-${Math.floor(900 + Math.random() * 100)}`,
                title: `Lab Test: ${labTest.testName}`,
                amount: 250.00,
                status: 'Unpaid',
                date: currentDate
              },
              ...p.billing
            ]
          };
        }
        return p;
      })
    );

    addNotification('success', 'Lab Report Published', `Lab results uploaded for ${labTest.patientName} (${labTest.testName}).`);
  };

  // 10. Patient Pays Bill (Credit Card, Cash, etc.)
  const payPatientBill = (patientId, billId) => {
    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          const updatedBilling = p.billing.map(b => {
            if (b.id === billId) {
              addNotification('success', 'Invoice Paid', `Payment received for ${b.title}: $${b.amount.toFixed(2)}.`);
              return { ...b, status: 'Paid' };
            }
            return b;
          });
          return { ...p, billing: updatedBilling };
        }
        return p;
      })
    );
  };

  // 11. Patient claims insurance
  const claimInsurance = (patientId, billId) => {
    const patientObj = patients.find(p => p.id === patientId);
    if (!patientObj) return;

    const billObj = patientObj.billing.find(b => b.id === billId);
    if (!billObj) return;

    // Update patient billing status to claimed-pending
    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          const updatedBilling = p.billing.map(b => (b.id === billId ? { ...b, status: 'Claimed-Pending' } : b));
          return { ...p, billing: updatedBilling };
        }
        return p;
      })
    );

    // Add to Insurance Claims database
    const claimId = `CLM-${Math.floor(400 + Math.random() * 600)}`;
    const newClaim = {
      id: claimId,
      patientId,
      patientName: patientObj.name,
      billingId: billId,
      policyName: patientObj.insuranceProvider || 'Default Healthcare Policy',
      policyNo: patientObj.insurancePolicyNo || 'DEF-129381',
      amount: billObj.amount,
      status: 'Pending',
      fileDate: new Date().toISOString().split('T')[0]
    };

    setInsuranceClaims(prev => [newClaim, ...prev]);
    addNotification('info', 'Insurance Claim Submitted', `Claim filed for ${billObj.title}. Sent to Insurance Provider.`);
  };

  // 12. Insurance Officer processes claims (Approve/Reject)
  const processClaim = (claimId, isApproved) => {
    const claim = insuranceClaims.find(c => c.id === claimId);
    if (!claim) return;

    // Update Claim Status
    setInsuranceClaims(prev => 
      prev.map(c => (c.id === claimId ? { ...c, status: isApproved ? 'Approved' : 'Rejected' } : c))
    );

    // Update Patient bill
    const nextBillStatus = isApproved ? 'Paid' : 'Unpaid';
    
    setPatients(prev => 
      prev.map(p => {
        if (p.id === claim.patientId) {
          const updatedBilling = p.billing.map(b => {
            if (b.id === claim.billingId) {
              return { 
                ...b, 
                status: nextBillStatus,
                title: isApproved ? `${b.title} (Covered by ${claim.policyName})` : `${b.title} (Insurance Denied)`
              };
            }
            return b;
          });
          return { ...p, billing: updatedBilling };
        }
        return p;
      })
    );

    if (isApproved) {
      addNotification('success', 'Claim Approved', `Claim ${claimId} approved. Cover amount: $${claim.amount.toFixed(2)} paid directly to hospital.`);
    } else {
      addNotification('danger', 'Claim Rejected', `Claim ${claimId} rejected by insurance carrier. Balance shifted to Patient liability.`);
    }
  };

  // 13. Dispatch Ambulance (Emergency Controller)
  const dispatchAmbulance = (ambId) => {
    setAmbulances(prev => 
      prev.map(amb => {
        if (amb.id === ambId) {
          addNotification('danger', 'Ambulance Dispatched', `${ambId} dispatched under Sirens & Lights. Emergency GPS tracking activated.`);
          return {
            ...amb,
            status: 'Dispatched',
            eta: 10, // 10 ticks (approx 30 seconds)
            progress: 0,
            location: 'Navigating to Accident Site'
          };
        }
        return amb;
      })
    );
  };

  // 14. Trigger System Database Backup (Admin Tool)
  const triggerDatabaseBackup = () => {
    addNotification('info', 'Backup Triggered', 'Compiling and encrypting local records database.');
    
    setTimeout(() => {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newLog = {
        time: timestamp,
        action: 'SYSTEM_BACKUP_MANUAL',
        status: 'SUCCESS',
        details: `Manual backup successful. Encrypted GZIP package uploaded. Patients: ${patients.length}, Appointments: ${appointments.length}, Beds Occupied: ${beds.filter(b=>b.status==='Occupied').length}.`
      };
      
      setBackupLogs(prev => [newLog, ...prev]);
      addNotification('success', 'Database Backup Successful', 'Data snapshots backed up to secondary secure server node.');
    }, 2000);
  };

  // 15. Trigger Emergency Simulator (Simulator Dock Event)
  const triggerEmergencySimulator = () => {
    // Find available ambulance
    const availableAmb = ambulances.find(a => a.status === 'Available');
    
    if (!availableAmb) {
      addNotification('warning', 'Emergency Dispatch Delayed', 'All ambulances currently deployed. Routing emergency calls to secondary regional providers.');
      return;
    }

    addNotification('danger', 'CRITICAL ER EVENT RECEIVED', '911 Dispatcher reports multiple automobile collision with trauma victims. Ambulance dispatched.');
    dispatchAmbulance(availableAmb.id);
  };

  // --- STATS COMPUTATION FOR ADMIN ---
  const getAdminStats = () => {
    // Total Revenue (all paid bills)
    let totalRevenue = 0;
    patients.forEach(p => {
      p.billing.forEach(b => {
        if (b.status === 'Paid') {
          totalRevenue += b.amount;
        }
      });
    });

    const totalBedsCount = beds.length;
    const occupiedBedsCount = beds.filter(b => b.status === 'Occupied').length;
    const occupancyRate = Math.round((occupiedBedsCount / totalBedsCount) * 100);
    
    // Inventory shortages count
    const lowStockItemsCount = inventory.filter(m => m.qty < 15).length;

    return {
      totalRevenue,
      bedOccupancyRate: occupancyRate,
      occupiedBeds: occupiedBedsCount,
      totalBeds: totalBedsCount,
      lowStockCount: lowStockItemsCount,
      patientsCount: patients.length,
      appointmentsCount: appointments.filter(a => a.status === 'Pending').length
    };
  };

  return (
    <HmsContext.Provider value={{
      patients,
      doctors,
      appointments,
      labTests,
      prescriptions,
      inventory,
      beds,
      insuranceClaims,
      ambulances,
      notifications,
      backupLogs,
      
      // Actions
      registerPatient,
      bookAppointment,
      cancelAppointment,
      completeConsultation,
      allocateBed,
      dischargePatient,
      saveVitals,
      dispensePrescription,
      restockMedicine,
      submitLabReport,
      payPatientBill,
      claimInsurance,
      processClaim,
      dispatchAmbulance,
      triggerDatabaseBackup,
      triggerEmergencySimulator,
      
      // Stats
      getAdminStats
    }}>
      {children}
    </HmsContext.Provider>
  );
};
