# NHS Appointment Management Platform - Datasets

This directory contains publicly available, open-license datasets downloaded for the MSc dissertation project:
**"NHS Appointment Management Platform with Machine Learning-Based Waiting-Time Prediction and Patient Engagement Features"**

All data is aggregate/anonymised statistics. No individual patient data is included.

**Date collected:** 13 March 2026

---

## 1. NHS Referral to Treatment (RTT) Waiting Times

### 1a. `rtt-timeseries-jan26.xlsx`

- **Source:** [NHS England Statistics - RTT Data 2025-26](https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/rtt-data-2025-26/)
- **Direct URL:** `https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/03/RTT-Overview-Timeseries-Including-Estimates-for-Missing-Trusts-Jan26-XLS-116K-WL5BiP.xlsx`
- **Description:** National-level RTT waiting times overview timeseries, including estimates for missing trusts. Monthly time series showing how many patients are waiting and for how long across all treatment functions.
- **Date range:** Historical timeseries up to January 2026
- **Format:** Excel (.xlsx), ~116 KB
- **Key data:** Monthly counts of patients on incomplete pathways, patients treated within/beyond 18 weeks, median/92nd percentile wait times
- **Relevance:** Core dataset for training waiting-time prediction models. Provides the dependent variable (wait times) and historical trends for the ML component.

### 1b. `rtt-full-csv-data-jan26.zip` (extracted to `rtt-full-csv-data-jan26/`)

- **Source:** [NHS England Statistics - RTT Data 2025-26](https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/rtt-data-2025-26/)
- **Direct URL:** `https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/03/Full-CSV-data-file-Jan26-ZIP-4M-WL5BiP.zip`
- **Description:** Full granular RTT data for January 2026 at provider/commissioner/treatment-function level, with waiting time distributions in weekly bands (0-1 weeks through to 104+ weeks).
- **Date range:** January 2026 snapshot
- **Format:** CSV inside ZIP (~85 MB uncompressed)
- **Key columns:**
  - `Period` - Reporting period
  - `Provider Org Code/Name` - Hospital/trust identifier
  - `Commissioner Org Code/Name` - Commissioning body
  - `RTT Part Type/Description` - Pathway type (Admitted, Non-Admitted, Incomplete)
  - `Treatment Function Code/Name` - Medical specialty (e.g., Urology, Gynaecology)
  - `Gt XX To YY Weeks SUM 1` - Count of patients waiting in each weekly band
  - `Total`, `Total All` - Aggregate totals
- **Relevance:** Granular data for building specialty-specific and provider-specific waiting time prediction models. Enables analysis of waiting time distributions across different hospitals and specialties.

### 1c. `rtt-overview-timeseries-dec24.xlsx`

- **Source:** [NHS England Statistics - RTT Data](https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/)
- **Direct URL:** `https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2025/02/RTT-Overview-Timeseries-Including-Estimates-for-Missing-Trusts-Dec24-XLS-108K-69130.xlsx`
- **Description:** Earlier RTT timeseries up to December 2024 for comparison and extended historical analysis.
- **Format:** Excel (.xlsx), ~108 KB

---

## 2. Hospital Outpatient Activity (including DNA rates)

### 2a. `outpatient-summary-tables-2024-25.xlsx`

- **Source:** [NHS England Digital - Hospital Outpatient Activity 2024-25](https://digital.nhs.uk/data-and-information/publications/statistical/hospital-outpatient-activity/2024-25)
- **Direct URL:** `https://files.digital.nhs.uk/37/3A8F4C/hosp-epis-stat-outp-rep-tabs-2024-25-tab.xlsx`
- **Description:** Summary report tables for hospital outpatient activity in England for the financial year 2024-25. Includes breakdown of appointments, attendances, and DNAs by region, specialty, age, gender, ethnicity, and deprivation.
- **Date range:** April 2024 - March 2025
- **Format:** Excel (.xlsx), ~141 KB
- **Key statistics:** 146.1 million outpatient appointments, 113.2 million attended, DNA rate of 5.6%
- **Relevance:** Provides annual DNA rate benchmarks and demographic breakdowns essential for understanding patient non-attendance patterns. Critical for the patient engagement features of the platform.

### 2b. `outpatient-all-attendances-2024-25.csv`

- **Source:** [NHS England Digital - Hospital Outpatient Activity 2024-25](https://digital.nhs.uk/data-and-information/publications/statistical/hospital-outpatient-activity/2024-25)
- **Direct URL:** `https://files.digital.nhs.uk/0B/FFD416/hosp-epis-stat-outp-all-firs-atte-2024-25-data.csv`
- **Description:** Detailed breakdown of all first attendances and follow-up attendances by specialty, age group, and gender.
- **Date range:** 2024-25
- **Format:** CSV, ~1 MB
- **Key columns:**
  - `REPORTING_PERIOD` - Financial year
  - `MEASURE_TYPE` - Type of measure (e.g., "All Attendances by Age and Gender")
  - `MEASURE` - Specific demographic category
  - `MAINSPEF_CODE/DESCRIPTION` - Main specialty
  - `MEASURE_VALUE` - Count
- **Relevance:** Enables analysis of outpatient attendance patterns by demographics and specialty, informing the patient engagement and reminder features.

---

## 3. Hospital Episode Statistics (HES) - Provisional Monthly Data

### 3a. `hes-monthly-open-data-totals-jan2026.csv`

- **Source:** [NHS England Digital - Provisional Monthly HES, Apr 2025 - Jan 2026](https://digital.nhs.uk/data-and-information/publications/statistical/provisional-monthly-hospital-episode-statistics-for-admitted-patient-care-outpatient-and-accident-and-emergency-data/april-2025---january-2026)
- **Direct URL:** `https://files.digital.nhs.uk/24/E06010/HES_M10_OPEN_DATA.csv`
- **Description:** Monthly national totals for inpatient and outpatient activity, including DNA rates. Each row represents one month.
- **Date range:** Monthly data for 2025-26 financial year (up to January 2026)
- **Format:** CSV, ~29 KB
- **Key columns:**
  - `CALENDAR_MONTH_END_DATE` - Month
  - `Outpatient_Total_Appointments` - Total outpatient appointments
  - `Outpatient_Attended_Appointments` - Attended appointments
  - `Outpatient_DNA_Appointment` - Did Not Attend count
  - `Outpatient_Percent_DNA` - DNA rate (e.g., 0.06 = 6%)
  - `Outpatient_Percent_Attended` - Attendance rate
  - `Outpatient_Follow_Up_Attendance` - Follow-up ratio
- **Relevance:** Directly provides monthly DNA rates and attendance metrics -- the core outcome variable for the no-show prediction model. Excellent for time-series analysis of seasonal patterns.

### 3b. `hes-monthly-open-data-age-groups-jan2026.csv`

- **Source:** Same as 3a
- **Direct URL:** `https://files.digital.nhs.uk/2D/BB6997/HES_M10_OPEN_DATA_AGE_GROUPS.csv`
- **Description:** Monthly HES data broken down by age band, including outpatient DNA counts by age group.
- **Format:** CSV, ~275 KB
- **Key columns:**
  - `Month_Ending`, `Age_Band`
  - `Total_Appointments`, `Attended_Appointments`, `DNA_Appointments`
  - `First_Attendance`, `Follow_Up_Attendance`
- **Relevance:** Enables age-stratified analysis of DNA patterns, a key predictor variable for the ML model.

### 3c. `hes-monthly-open-data-treatment-specialty-jan2026.csv`

- **Source:** Same as 3a
- **Direct URL:** `https://files.digital.nhs.uk/97/19EFFE/HES_M10_OPEN_DATA_TREATMENT_SPECIALTY.csv`
- **Description:** Monthly HES data broken down by treatment specialty, with DNA counts per specialty.
- **Format:** CSV, ~1.8 MB
- **Key columns:**
  - `TRETSPEF`, `TRETSPEF_DESCRIPTION` - Treatment specialty code and name
  - `Total_Appointments`, `Attended_Appointments`, `DNA_Appointments`
  - `First_Attendance`, `Follow_Up_Attendance`
  - `Latest_Month_Flag` - Whether this is the most recent month
- **Relevance:** Specialty-level DNA rates are essential for specialty-specific prediction models. Different specialties have very different DNA patterns.

### 3d. `hes-monthly-activity-timeseries-2018-2025.csv`

- **Source:** Same as 3a
- **Direct URL:** `https://files.digital.nhs.uk/57/CB8356/HES%20MAR%20data%20Apr%202018%20to%20Mar%202025.csv`
- **Description:** Long-term monthly activity report (MAR) timeseries from April 2018 to March 2025, at national and provider level.
- **Date range:** April 2018 - March 2025 (~7 years)
- **Format:** CSV, ~18.9 MB
- **Key columns:**
  - `Financial Year`, `Activity Month`, `Org Code/Name`
  - `Specific acute specialties: First attendances DNA`
  - `Specific acute specialties: Subsequent attendances DNA`
  - `All specialties: First attendances DNA`, `All specialties: Subsequent attendances DNA`
  - Plus elective, non-elective, and outpatient seen counts
- **Relevance:** 7-year historical timeseries ideal for training long-term trend models. Includes pre-COVID, COVID, and post-COVID periods showing the impact of the pandemic on appointment patterns.

### 3e. `hes-dashboard-descriptions.xlsx`

- **Source:** Same as 3a
- **Direct URL:** `https://files.digital.nhs.uk/F4/9BD77E/Provisional%20Monthly%20Hospital%20Episode%20Statistics%20...%20Dashboard%20Data%20Descriptions.xlsx`
- **Description:** Metadata file describing all fields in the HES open data files.
- **Format:** Excel (.xlsx), ~47 KB

---

## 4. GP Appointments Data

### 4a. `gp-appointments-summary-dec2025.xlsx`

- **Source:** [NHS England Digital - Appointments in General Practice, December 2025](https://digital.nhs.uk/data-and-information/publications/statistical/appointments-in-general-practice/december-2025)
- **Direct URL:** `https://files.digital.nhs.uk/E1/B52BA0/GP_Appointment_Publication_Summary_December_2025.xlsx`
- **Description:** Summary publication for GP appointments in December 2025, including national-level statistics on appointment volumes, modes (face-to-face, telephone, online), appointment status (attended, DNA), healthcare professional type, and time from booking to appointment.
- **Date range:** December 2025 (with rolling 30-month historical context)
- **Format:** Excel (.xlsx), ~414 KB
- **Relevance:** GP appointment patterns, mode of consultation, and waiting times from booking to appointment are key features for the appointment management platform.

### 4b. `gp-appointments-national-overview-dec2025.csv`

- **Source:** Same as 4a
- **Direct URL:** `https://files.digital.nhs.uk/6D/F9CC45/National_Overview.csv`
- **Description:** National-level GP appointments data with detailed breakdowns by appointment status (Attended, DNA), healthcare professional type (GP, Nurse, Other), appointment mode (Face-to-Face, Telephone, Home Visit, Online/Video), service setting, national category, and time from booking.
- **Date range:** April 2024 - December 2025 (rolling period)
- **Format:** CSV, ~6.1 MB
- **Key columns:**
  - `APPOINTMENT_MONTH` - Month of appointment
  - `APPT_STATUS` - Attended / DNA
  - `HCP_TYPE` - Healthcare professional type
  - `APPT_MODE` - Face-to-Face, Telephone, etc.
  - `SERVICE_SETTING` - Extended Access, General Practice, etc.
  - `NATIONAL_CATEGORY` - Category of care
  - `APPOINTMENTS` - Count of appointments
- **Relevance:** Rich dataset for analysing GP appointment patterns including DNA rates by mode of consultation, professional type, and service category. Directly applicable to the patient engagement features.

### 4c. `gp-appointments-regional-dec2025.zip` (extracted to `gp-appointments-regional-dec2025/`)

- **Source:** Same as 4a
- **Direct URL:** `https://files.digital.nhs.uk/F9/74866D/Appointments_GP_Regional_CSV_Dec_25.zip`
- **Description:** Regional-level GP appointment data broken down by sub-ICB location (42 regions across England). Each CSV file covers one sub-ICB region.
- **Format:** ZIP containing 42 CSV files, ~4.4 MB compressed
- **Relevance:** Enables geographic analysis of GP appointment patterns and regional variation in DNA rates.

---

## 5. Medical Appointment No-Show Dataset (Kaggle/Brazil)

### 5a. `kaggle-medical-no-show-appointments.csv`

- **Source:** [Kaggle - Medical Appointment No Shows](https://www.kaggle.com/datasets/joniarroba/noshowappointments) (via [GitHub mirror](https://github.com/mroker242/no-show-appointments))
- **Description:** Dataset of 110,527 medical appointments from public hospitals in Brazil, focused on predicting patient no-shows. Originally published on Kaggle by JoniHoppen.
- **Date range:** 2016 (Brazilian public health system)
- **Format:** CSV, ~10.7 MB
- **Key columns:**
  - `PatientId` - Patient identifier
  - `AppointmentID` - Appointment identifier
  - `Gender` - M/F
  - `ScheduledDay` - When the appointment was booked
  - `AppointmentDay` - When the appointment was scheduled for
  - `Age` - Patient age
  - `Neighbourhood` - Location
  - `Scholarship` - Whether enrolled in Bolsa Familia welfare programme (0/1)
  - `Hipertension` - Hypertension status (0/1)
  - `Diabetes` - Diabetes status (0/1)
  - `Alcoholism` - Alcoholism status (0/1)
  - `Handcap` - Disability status (0/1)
  - `SMS_received` - Number of SMS reminders received
  - `No-show` - **Target variable** (Yes/No)
- **Relevance:** The most widely-used dataset for training appointment no-show prediction models in healthcare ML research. Useful for:
  - Benchmarking ML models before applying to NHS data
  - Demonstrating the feasibility of no-show prediction
  - Analysing the impact of SMS reminders on attendance (directly relevant to the patient engagement component)
  - Literature comparison (many published papers use this dataset)
- **License:** CC0: Public Domain

---

## Data Sources Summary

| Source | URL | License |
|--------|-----|---------|
| NHS England Statistics | https://www.england.nhs.uk/statistics/ | Open Government Licence v3.0 |
| NHS England Digital | https://digital.nhs.uk/ | Open Government Licence v3.0 |
| Kaggle (JoniHoppen) | https://www.kaggle.com/datasets/joniarroba/noshowappointments | CC0: Public Domain |

---

## How These Datasets Support the Dissertation

### ML-Based Waiting Time Prediction
- **Primary:** RTT timeseries and full CSV data (datasets 1a, 1b, 1c) provide waiting time distributions by specialty and provider
- **Supporting:** HES monthly totals and timeseries (3a, 3d) provide long-term trends and seasonal patterns

### DNA/No-Show Prediction
- **Primary:** HES monthly data with DNA rates by age and specialty (3a, 3b, 3c)
- **Supporting:** Kaggle no-show dataset (5a) for model benchmarking and SMS reminder analysis
- **Supporting:** Outpatient activity data (2a, 2b) for annual DNA patterns

### Patient Engagement Features
- **Primary:** GP appointments data (4a, 4b) showing DNA rates by appointment mode (face-to-face vs telephone vs online)
- **Supporting:** Kaggle dataset (5a) showing impact of SMS reminders on attendance
- **Supporting:** Outpatient data (2a) showing demographic patterns in DNA rates

### Geographic and Specialty Analysis
- **Primary:** RTT full CSV (1b) for specialty-level analysis
- **Supporting:** GP regional data (4c) for geographic variation
- **Supporting:** HES treatment specialty data (3c) for specialty-specific DNA rates

---

## Notes

- All NHS data is published under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
- HES provisional data should be treated as estimates until final annual National Statistics publications
- The Kaggle dataset is from Brazil (not the UK NHS) but is widely used in healthcare ML literature as a benchmark
- ZIP files have been extracted into subdirectories for convenience
- The `rtt-overview-timeseries-dec24.xlsx` file was downloaded as an earlier reference point for comparison
