# 🏥 Smart Hospital Management System (HMS)

Smart HMS is a real-time, role-based healthcare operations dashboard and clinical management system. Built using a modern React & Vite architecture and custom CSS styling, it provides a simulation of real-time patient care, clinical workflows, and administrative logistics.

![Smart HMS Admin Dashboard](public/screenshots/admin_dashboard.png)

---

## 🗺️ Overall System Workflow Diagram

The system coordinates interactions across **8 operational actors**, orchestrating clinical care, laboratory investigations, pharmacy inventory, ward management, billing, and insurance processing.

```mermaid
flowchart TD
    %% Styling definitions
    classDef actor fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef db fill:#0ea5e9,stroke:#0284c7,stroke-width:2px,color:#fff;
    classDef process fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff;
    classDef alert fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#fff;
    classDef queue fill:#f59e0b,stroke:#d97706,stroke-width:1px,color:#fff;

    %% Intake & Scheduling
    Start([Patient Intake]) -->|Standard Arrival| Receptionist[Receptionist Dashboard]:::actor
    Start -->|Critical Emergency Call| Simulator[Ambulance Dispatch Simulator]:::alert
    
    %% Ambulance & ER Flow
    Simulator -->|Dispatch Ambulance| AmbETA[Ambulance En Route / Real-time ETA]:::process
    AmbETA -->|Arrival at ER Gate| ERBay[Auto-Register Trauma Patient & Assign ER Bed]:::alert
    ERBay --> Doctor:::actor

    %% Receptionist Flow
    Receptionist -->|Register Profile| PatientDB[(Central Patient Registry)]:::db
    Receptionist -->|Schedule Visit| AppointmentQueue[Appointment Queue]:::queue
    
    %% Doctor Flow
    AppointmentQueue --> Doctor[Medical Doctor Dashboard]:::actor
    Doctor -->|Review Patient Vitals & History| PatientDB
    Doctor -->|1. Submit Diagnosis & EMR Details| PatientDB
    Doctor -->|2. Prescribe Medications| RxQueue[E-Prescription Queue]:::queue
    Doctor -->|3. Order Labs| LabQueue[Lab Request Queue]:::queue
    Doctor -->|4. Recommend Admission| WardQueue[Admission Queue]:::queue

    %% Pharmacy Flow
    RxQueue --> Pharmacist[Pharmacist Dashboard]:::actor
    Pharmacist --> CheckStock{Stock Check}:::process
    CheckStock -->|Sufficient Stock| DeductInventory[Dispense Medicine & Update Formulary]:::process
    CheckStock -->|Qty < 15 Units| StockAlert[Broadcast Low Stock Alert]:::alert
    DeductInventory --> InvoiceDb[(Billing Database)]:::db
    StockAlert --> Admin:::actor

    %% Lab Flow
    LabQueue --> LabTech[Lab Technician Dashboard]:::actor
    LabTech -->|Analyze Samples & Upload Report| LabPublish[Sync Report to EMR & Add Charges]:::process
    LabPublish --> PatientDB
    LabPublish --> InvoiceDb

    %% Inpatient / Ward Flow
    WardQueue --> WardNurse[Ward Nurse Dashboard]:::actor
    WardNurse -->|Allocate Bed: General/ICU| BedAssign[Occupy Bed & Start Vital Tracking]:::process
    BedAssign -->|Live Fluctuations SpO2, HR, BP| VitalMonitor[Continuous Vitals Feed]:::process
    VitalMonitor -->|SpO2 Alert < 92%| CriticalAlert[Broadcast Critical Vitals Alert]:::alert
    WardNurse -->|Stablized & Recovered| Discharge[Discharge Patient & Vacate Bed]:::process
    Discharge --> InvoiceDb

    %% Billing & Insurance Flow
    InvoiceDb --> PatientPortal[Patient Portal]:::actor
    PatientPortal -->|View Billing Statements| PayChoice{Payment Mode}:::process
    PayChoice -->|Direct Payment| SettleDirect[Mark Invoice Paid]:::process
    PayChoice -->|Submit Claim| InsuranceQueue[Insurance Claim Queue]:::queue
    
    InsuranceQueue --> InsOfficer[Insurance Officer Dashboard]:::actor
    InsOfficer -->|Review Claim & Policy| ProcessClaim{Coverage Determination}:::process
    ProcessClaim -->|Approve| InsPaid[Direct Settle - Paid by Insurance]:::process
    ProcessClaim -->|Reject| InsDenied[Shift Liability to Patient - Unpaid]:::process
    
    SettleDirect --> InvoiceDb
    InsPaid --> InvoiceDb
    InsDenied --> InvoiceDb

    %% System Admin and Simulation Operations
    Admin[System Admin Dashboard]:::actor -->|Monitor Ops KPI| AdminStats[Real-time Revenue, Occupancy, Shortages]:::process
    Admin -->|Sync System Node| DBBackup[Generate Encrypted GZIP Backup]:::process
    DBBackup --> PatientDB
    CriticalAlert --> WardNurse & Admin
```

---

## ✨ Core Features & Roles

The system is split into specialized views, each tailored to specific hospital roles:

### 1. 🛡️ System Administrator
* **KPI Operational Stats**: Live overview of hospital financials (total revenue), bed occupancy rate, active outpatient consultations, and low pharmacy stock levels.
* **Encrypted Database Backups**: Trigger manual snapshots of the centralized database. It tracks historical backup logs with detailed metrics (time, patients, appointments, and beds).
* **Low Stock Broadcaster**: Receives real-time warnings from the pharmacy regarding inventory shortages.

![System Admin Dashboard](public/screenshots/admin_dashboard.png)

### 2. 📅 Receptionist
* **Patient Registration**: Profile builder capturing name, age, gender, contact info, blood type, and insurance credentials.
* **Scheduling Engine**: Real-time appointment builder linking registered patients with specialized doctors, dates, times, and consultation types.
* **Consultation Billing**: Automatically flags initial consultation invoices in the patient’s invoice records.

![Receptionist Dashboard](public/screenshots/receptionist_dashboard.png)

### 3. 🩺 Medical Doctor
* **Electronic Medical Records (EMR)**: Access to clinical history, past diagnoses, treatment timelines, and diagnostic reports.
* **Diagnostics Order**: Instantly request laboratory workups (e.g., Complete Blood Count, Brain MRI) routed to the Lab Technician.
* **E-Prescribing**: Order medications directly to the Pharmacy Formulary with quantity requirements.
* **Admission Referral**: Direct orders to admit unstable patients, transferring them to the Nurse ward queue.

![Medical Doctor Dashboard](public/screenshots/doctor_dashboard.png)

### 4. 🛏️ Ward Nurse
* **Bed Management**: Graphic visual layout of General Ward, ICU, and ER beds (Available vs Occupied).
* **Admission Allocation**: Assign patients recommended for admission to available beds, dynamically adding daily room charges to their bills.
* **Patient Discharge**: Complete patient discharge protocols, vacating beds in real-time.
* **Live Vitals Tracking**: Updates, monitors, and processes patient blood pressure, heart rate, temperature, and SpO2 levels.

### 5. 💊 Pharmacist
* **Formulary Inventory Manager**: Real-time tracking of medicine stock levels (Amoxicillin, Metoprolol, Atorvastatin, etc.).
* **Prescription Dispatch**: Review, verify, and dispense incoming prescriptions, automatically subtracting stock quantities.
* **Automated Low-Stock Trigger**: Warns the system if any drug count drops below 15 units.
* **Restock Protocol**: Reorder and restock items to maintain formulary supply levels.

### 6. 🔬 Lab Technician
* **Lab Work Orders**: Centralized queue showing test requests ordered by medical doctors.
* **Lab Report Publisher**: Process diagnostic tests, upload findings, write reports, and sync results back to the patient’s EMR.
* **Automatic Billing Sync**: Appends corresponding laboratory diagnostic charges to the patient’s ledger.

### 7. 💼 Insurance Officer
* **Claim Assessment**: Review insurance claims submitted by patients, checking the patient’s policy details, provider name, and claim amount.
* **Coverage Processing**: Approve or reject claims in a single click, instantly updating the patient's billing status.

![Insurance Officer Dashboard](public/screenshots/insurance_dashboard.png)

### 8. 👤 Patient Portal
* **EMR Portal**: Self-service portal where patients view their diagnosis timeline, prescriptions, and laboratory reports.
* **Billing Desk**: View and track billing details (consultations, ward fees, lab work, pharmacy costs).
* **Payment Processing**: Settle bills directly or file claims to their designated insurance provider.

![Patient Portal Dashboard](public/screenshots/patient_dashboard.png)

---

## ⚡ Real-Time Simulation Engine

The application incorporates a background simulation layer to demonstrate system interactivity without a backend database:

1. **Ambulance Dispatch & Triage Simulator**:
   * Simulates emergency calls dispatching an ambulance (lights & sirens active).
   * Real-time GPS travel tracking computes ETA and progress indicators.
   * Upon arrival, it registers a dummy patient record (Trauma Victim) and assigns them to an Emergency ER Bay.

2. **Fluctuating Inpatient Vitals**:
   * Background timers apply minor fluctuations to vital signs (heart rate, temperature, blood pressure) for admitted patients.
   * Prompts visual changes on the Nurse Dashboard when metrics fluctuate.

3. **Vital Signs & Stock Alerts**:
   * Generates critical alerts (e.g., SpO2 drops below 92%) with live desktop toast notifications.
   * Monitors drug inventories and generates low-stock warning banners.

---

## 🛠️ Technology Stack

* **Frontend Library**: React (v19)
* **Build Tooling & Server**: Vite (v8)
* **Icons Library**: Lucide React
* **Styling**: Pure CSS (utilizing variable tokens, responsive layouts, glassmorphism UI elements, and custom micro-animations)

---



