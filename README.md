# API Endpoints for Back-Stock Report

### Base URL: [back-stock-report.up.railway.app](https://back-stock-report.up.railway.app)

---

## Endpoints

### General Information

- **Port**: `8080`

---

### QR Code for Frontend

- **GET**:  
  Retrieve the QR code to connect the frontend application.  
  [Get QR Code](https://back-stock-report.up.railway.app/api/qrcode)

---

### Reports

- **POST**:  
  Generate an image report with a warehouse filter passed from the frontend in a JSON format.  
  [POST Report](https://back-stock-report.up.railway.app/api/report)
  
- **GET**:  
  Sends a default message to the number: `+5493816450030`.  
  [Get Report](https://back-stock-report.up.railway.app/api/report)

---

### Excel Export

- **POST**:  
  Upload an Excel file to process the SAP report.  
  [POST Excel](https://back-stock-report.up.railway.app/api/excel)

- **/json**:  
  Convert an uploaded Excel file into a JSON format.  
  [POST Excel to JSON](https://back-stock-report.up.railway.app/api/excel/json)

---

### Contact Information

- **POST**:  
  Return a JSON file with contact details from an uploaded Excel file.  
  [POST Contact Info](https://back-stock-report.up.railway.app/api/contact)
