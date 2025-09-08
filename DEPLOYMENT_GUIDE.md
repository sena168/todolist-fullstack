# 🚀 Deployment Guide

## Overview
This guide will help you deploy your Todo application using:
- **Render** for backend + database
- **Vercel** for frontend

## 📋 Prerequisites
- GitHub account (✅ Done - Repository: https://github.com/sena168/todolist-fullstack)
- Render account (free)
- Vercel account (free)

## 🔧 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub account

### 1.2 Deploy Backend Service
1. Click **"New +"** → **"Web Service"**
2. Connect your repository: `sena168/todolist-fullstack`
3. Configure the service:
   - **Name**: `todolist-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 1.3 Set Environment Variables
In Render dashboard, go to your service → Environment:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app
```

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://todolist-backend-xxxx.onrender.com`

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 2.2 Deploy Frontend
1. Click **"New Project"**
2. Import `sena168/todolist-fullstack`
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Set Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://todolist-backend-xxxx.onrender.com
```

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Copy your frontend URL: `https://your-project.vercel.app`

## 🔄 Step 3: Update CORS Configuration

### 3.1 Update Backend Environment
Go back to Render → Your Backend Service → Environment:
```
FRONTEND_URL=https://your-actual-frontend.vercel.app
```

### 3.2 Redeploy Backend
1. Go to Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## 🧪 Step 4: Test Your Application

1. Open your frontend URL: `https://your-project.vercel.app`
2. Test creating a todo
3. Test updating/deleting todos
4. Check browser console for any errors

## 🗄️ Step 5: Add Database (Optional - Later)

### 5.1 Create PostgreSQL Database on Render
1. In Render dashboard: **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `todolist-database`
   - **Database**: `todolist`
   - **User**: `todolist_user`
   - **Instance Type**: `Free`

### 5.2 Update Backend for Database
1. Add database connection code
2. Update environment variables
3. Migrate from in-memory storage

## 📝 Quick Commands Summary

```bash
# If you need to make changes and redeploy:
git add .
git commit -m "Update: description of changes"
git push origin main

# Both Render and Vercel will auto-deploy on push!
```

## 🔗 Your Deployment URLs

- **GitHub Repository**: https://github.com/sena168/todolist-fullstack
- **Backend (Render)**: `https://todolist-backend-xxxx.onrender.com`
- **Frontend (Vercel)**: `https://your-project.vercel.app`
- **API Documentation**: `https://todolist-backend-xxxx.onrender.com/api-docs`

## 🚨 Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set
- Ensure build command completed successfully

### Frontend Issues
- Check Vercel deployment logs
- Verify `VITE_API_BASE_URL` is set correctly
- Check browser console for CORS errors

### CORS Issues
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Redeploy backend after updating environment variables

## 🎉 Success!

Your Todo application is now live and accessible worldwide! 🌍

---

**Next Steps:**
1. Share your app with friends
2. Add more features
3. Set up a real database
4. Add user authentication
5. Implement push notifications