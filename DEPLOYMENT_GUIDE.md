# TodoList App - Vercel Deployment Guide

## Overview
This guide will help you deploy both the backend and frontend to Vercel for 24/7 online access.

## Backend Deployment Steps

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Login to Vercel** (first time only):
   ```bash
   vercel login
   ```

3. **Deploy backend**:
   ```bash
   vercel --prod
   ```
   - Choose "Link to existing project?" → **N** (No)
   - Project name: `todolist-backend` (or your preferred name)
   - Directory: `.` (current directory)
   - Override settings? → **N** (No)

4. **Copy the deployment URL** - you'll need this for the frontend!

## Frontend Deployment Steps

1. **Navigate to frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Update API URL** in `src/lib/api.ts`:
   Replace `http://localhost:8080` with your backend deployment URL

3. **Deploy frontend**:
   ```bash
   vercel --prod
   ```
   - Choose "Link to existing project?" → **N** (No)
   - Project name: `todolist-frontend` (or your preferred name)
   - Directory: `.` (current directory)
   - Override settings? → **N** (No)

## Final Steps

1. **Test your deployed app** using the frontend URL
2. **Update CORS settings** if needed (backend automatically allows all origins)
3. **Your app is now live 24/7!**

## URLs After Deployment
- **Backend API**: `https://your-backend-name.vercel.app`
- **Frontend App**: `https://your-frontend-name.vercel.app`

## Notes
- Both applications will auto-deploy on future git pushes
- The backend uses in-memory storage, so data resets on each deployment
- Consider upgrading to a database (MongoDB, PostgreSQL) for persistent data