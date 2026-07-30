# Deploy Guide

This project has 3 parts:

- Frontend: `front/hospi` on Vercel
- Backend API: `back` on Render
- Database: MongoDB Atlas

## Render Backend

Create a new Render Web Service from the GitHub repository.

If Render asks for manual settings:

```text
Root Directory: back
Runtime: Node
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

Environment variables on Render:

```text
NODE_ENV=production
STORAGE_DRIVER=mongodb
FRONTEND_ORIGIN=https://YOUR-FRONTEND-DOMAIN
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
MONGODB_DB_NAME=hos
MONGODB_COLLECTION=patient_records
MONGODB_ACTIVITY_COLLECTION=admin_activity
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
```

Use comma-separated origins if you need more than one frontend origin, for example:

```text
FRONTEND_ORIGIN=http://localhost:5173,https://YOUR-FRONTEND-DOMAIN
```

Do not commit `.env` or database passwords.

After Render deploys, test:

```text
https://YOUR-RENDER-SERVICE.onrender.com/health
https://YOUR-RENDER-SERVICE.onrender.com/health/db
```

## Vercel Frontend

Create a Vercel project from the same GitHub repository.

Settings:

```text
Root Directory: front/hospi
Build Command: npm run build
Output Directory: dist
```

Environment variable on Vercel:

```text
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com
```
