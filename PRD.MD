# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project: Sheet Reader – Community Monthly Contribution Monitoring

---

## 1. Product Summary

A web application that reads transaction data from Google Sheets (or Excel as initial source), and displays:

* Monthly income vs expenses
* Member payment summary per month
* Detection of members who did not pay in certain months
* Interactive dashboards and visualizations for transparency

---

## 2. Objectives

* The treasurer can quickly monitor monthly cashflow
* The committee can monitor member payment compliance
* Simplify auditing and reporting (no manual calculation)

---

## 3. Target Users

* **Treasurer** – needs transaction tracking & reporting
* **Committee / Chairman** – needs financial summary & trends
* *(Optional)* Members – view personal payment status

---

## 4. Scope

### MVP (Phase 1)

* Connect to 1 Google Sheet
* Read transaction data (income & expense)
* Normalize and validate data
* Dashboard with:

  * Monthly income vs expense chart
  * Expense category breakdown
  * Member compliance heatmap
* Member detail page:

  * Monthly payment history
  * Missing months
  * Annual contribution total

### Out of Scope (Phase 1)

* Editing transactions from the app (read-only)
* Multi-organization support
* Approval workflow

---

## 5. Data Requirements

The system works best if the sheet contains these columns (names can be mapped):

**Required**

* `date`
* `name` (member name)
* `amount`
* `transaction_type` (IN / OUT)

**Optional**

* `category`
* `note`
* `payment_method`
* `contribution_month` (important if payments are sometimes made late for previous months)

Important note:
If members sometimes pay late (e.g., paying February’s fee in March), the sheet must include a `contribution_month` column or structured note parsing (e.g., “Contribution Feb 2026”).
Without that, the system assumes:
**transaction month = contribution month**

---

## 6. Functional Requirements

### FR-1: Data Import & Sync

* Source: Google Sheets (primary), Excel (initial upload)
* Manual refresh + optional scheduled refresh
* Store parsed snapshot for performance

Acceptance Criteria:

* Dashboard updates after sheet refresh
* Proper error handling if columns are missing

---

### FR-2: Data Normalization

* Trim and lowercase names for consistency
* Clean currency formatting (Rp, commas, dots)
* Robust date parsing
* Transaction type detection:

  * From `transaction_type` column, OR
  * From amount sign (positive = IN, negative = OUT)

Acceptance Criteria:

* No unparsed rows in sample dataset
* Invalid rows shown in “Data Issues” page

---

### FR-3: Monthly Cashflow Aggregation

For each month:

* Total income
* Total expense
* Net balance
* Optional running balance

Acceptance Criteria:

* Monthly totals match manual calculation

---

### FR-4: Member Monthly Contribution Matrix

Matrix format:

* Rows = Members
* Columns = Month (YYYY-MM)
* Value = Total amount paid by that member in that month

Status rules:

* PAID → total > 0 (or >= required monthly contribution if defined)
* NOT PAID → total = 0

Acceptance Criteria:

* Multiple payments in the same month are summed
* Name variations (extra spaces, casing) are normalized

---

### FR-5: Missing Payment Detection

* Per member: list of unpaid months
* Per month: % of members who paid

Acceptance Criteria:

* Filter available to show only members with missing payments

---

### FR-6: Visualization Dashboard

Minimum required charts:

1. Line/Bar Chart – Monthly income vs expense
2. Heatmap – Member vs month payment status
3. Donut/Bar Chart – Expense categories
4. Transaction table with filters

---

## 7. Non-Functional Requirements

* Load time < 2 seconds for 10,000 transactions (with caching)
* Drill-down capability (every chart value traceable to source transactions)
* Secure Google Sheets API integration
* Read-only access for safety

---

## 8. Recommended Technical Architecture

Frontend:

* Next.js + Recharts or Chart.js

Backend:

* Node.js (Express or NestJS) or Next API routes

Integration:

* Google Sheets API (Service Account)

Storage:

* MVP: in-memory cache
* Scalable option: PostgreSQL (e.g., Supabase)

---

## 9. Data Model (Conceptual)

### Transaction

* id
* date
* month_key (YYYY-MM)
* type (IN / OUT)
* member_key (nullable for expense)
* member_name_raw
* amount
* category
* note
* source_row_id

### Member

* member_key
* display_name

---

## 10. Edge Cases

* Member name inconsistencies
* Late payments
* Mixed positive/negative amounts
* Empty category values
* Sheet structure changes
* Multiple payments per month