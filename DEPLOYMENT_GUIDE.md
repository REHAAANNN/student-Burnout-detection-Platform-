# Deployment Guide for Vercel

## 📋 Overview
This project has **two parts** that need separate deployment:
1. **Backend** (Node.js + Express) → Can deploy as Vercel Serverless Functions
2. **Frontend** (React + Vite) → Deploy as Vercel Static Site

---

## 🚀 Step 1: Deploy Backend to Vercel

### 1.1 Create `vercel.json` in backend folder

<write_to_file path="backend/vercel.json">
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
</write_to_file>

### 1.2 Update `backend/server.js` for Vercel compatibility

The file already exports `app` via `module.exports = app` in `src/app.js`. We need to update `server.js`:

<write_to_file path="backend/server.js">
require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/db')
const { configureCloudinary } = require('./src/config/cloudinary')

// Connect to database (non-blocking for Vercel)
connectDB()
configureCloudinary()

// For local development
const PORT = process.env.PORT || 5000

// For Vercel serverless - export the app
module.exports = app

// Start server only if NOT in Vercel (for local dev)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
</write_to_file>

### 1.3 Deploy Backend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Go to backend folder
cd backend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 1.4 Set Environment Variables in Vercel Dashboard

After deployment, go to your project on Vercel → **Settings** → **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random secret key |
| `JWT_EXPIRES_IN` | `7d` |
| `OTP_EXPIRES_IN_MINUTES` | `10` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your email |
| `SMTP_PASS` | Your app password |
| `SMTP_FROM` | Your email |
| `FRONTEND_URL` | Your frontend URL, for example `https://burnout-guard.vercel.app` |
| `FRONTEND_URLS` | Optional comma-separated allowlist if you have multiple frontend URLs/previews |
| `CLOUDINARY_CLOUD_NAME` | From .env |
| `CLOUDINARY_API_KEY` | From .env |
| `CLOUDINARY_API_SECRET` | From .env |

> **Note:** MongoDB Atlas must whitelist Vercel's IPs. Add `0.0.0.0/0` in Network Access for development.

---

## 🚀 Step 2: Deploy Frontend to Vercel

### 2.1 Update `frontend/.env` for production

Create a `.env.production` file:

<write_to_file path="frontend/.env.production">
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_API_URL=https://your-backend.vercel.app/api
VITE_APP_NAME=Burnout Guard
VITE_APP_ENV=production
</write_to_file>

Replace `https://your-backend.vercel.app` with your actual backend URL after deployment.

Important: never deploy the frontend with `VITE_API_URL=http://localhost:5000/api`. Vite bakes this value into the production JavaScript bundle during build, so deployed users' browsers will try to call their own computer instead of your backend.

### 2.2 Deploy Frontend

```bash
# Go to frontend folder
cd frontend

# Deploy to Vercel
vercel --prod
```

Or connect your GitHub repo directly:
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. Set **Root Directory** to `frontend`
5. Add environment variable: `VITE_API_URL` = your backend URL with `/api`, for example `https://your-backend.vercel.app/api`
6. Click **Deploy**

After changing any Vercel environment variable, redeploy the frontend so Vite rebuilds with the new value.

---

## 🎯 Step 3: Update CORS in Backend

Set your backend Vercel environment variable:

```env
FRONTEND_URL=https://burnout-guard.vercel.app
```

If you need to allow more than one frontend origin, use:

```env
FRONTEND_URLS=http://localhost:5173,https://burnout-guard.vercel.app
```

Then redeploy backend:
```bash
cd backend
vercel --prod
```

After changing `FRONTEND_URL` or `FRONTEND_URLS`, redeploy the backend so the CORS allowlist updates.

---

## ✅ Step 4: Verify Deployment

1. **Backend health check:** Visit `https://your-backend.vercel.app/api/health`
   - You should see: `{ "success": true, "message": "Backend running" }`

2. **Frontend:** Visit your frontend URL
   - Register a user
   - Check OTP in backend logs (Vercel dashboard → Functions → View logs)
   - Complete OTP verification

---

## 📝 Notes

- **Vercel Free Plan Limitations:**
  - Serverless functions timeout after 10s (fine for auth)
  - 100 deployments per day
  - 60 requests per second

- **MongoDB Atlas:** Make sure to whitelist `0.0.0.0/0` for Vercel IPs

- **CORS Issues:** If login/register fails with CORS error, double-check the `FRONTEND_URL` env variable and redeploy

- **OTP in Production:** Users will receive actual emails. For testing, you can add a console log to see OTPs in Vercel function logs.

---

## 🔧 Alternative: Deploy Backend to Render (Free)

If Vercel serverless doesn't work well, use Render for the backend:

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables
6. Click **"Create Web Service"**

Then update frontend `.env.production`:
```
VITE_API_URL=https://your-app.onrender.com/api
