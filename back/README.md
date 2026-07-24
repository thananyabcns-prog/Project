# HOS Backend

Backend API สำหรับ Pre-OR Safety Checklist

ตอนนี้ใช้ JSON file storage ชั่วคราวที่ `data/patient-records.json` เพื่อให้ frontend เรียก API ได้ก่อนมี database จริง โครงสร้างแยก repository ไว้แล้วเพื่อเปลี่ยนเป็น database ภายหลัง

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

API จะรันที่ `http://localhost:4000`

## Storage Driver

เลือก backend storage ได้จาก `.env`

```env
STORAGE_DRIVER=mongodb
MONGODB_URI=mongodb+srv://USER:PASSWORD@HOST/?appName=Cluster0
MONGODB_DB_NAME=hos
MONGODB_COLLECTION=patient_records
```

ถ้าต้องการใช้ไฟล์ JSON ชั่วคราว:

```env
STORAGE_DRIVER=json
JSON_DATA_FILE=./data/patient-records.json
```

## Endpoints

```text
GET    /health
GET    /health/db
GET    /api/patient-records?search=keyword
POST   /api/patient-records
GET    /api/patient-records/:id
PUT    /api/patient-records/:id
DELETE /api/patient-records/:id
```

## Payload

```json
{
  "form": {
    "patientName": "ชื่อผู้ป่วย",
    "hn": "HN001"
  },
  "checks": {
    "identifyNameDob": true
  }
}
```

## Database Schema

MongoDB ใช้งานได้ทันทีผ่าน collection `patient_records`

ถ้าภายหลังจะย้ายไป PostgreSQL ดูตัวอย่าง schema ได้ที่ `docs/database-schema.sql`
