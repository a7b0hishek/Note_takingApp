# 📋 Deployment Guide - Note Taking App

This guide will help you deploy your Note Taking App to production using Render (backend) and Netlify/Vercel (frontend).

## 🚀 **Step 1: Deploy Backend to Render**

### **1.1 Create Render Account**
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### **1.2 Deploy Backend**
1. Click "New" → "Web Service"
2. Connect your GitHub repository: `https://github.com/a7b0hishek/Note_takingApp`
3. Configure deployment settings:
   - **Name**: `note-taking-app-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### **1.3 Set Environment Variables**
In Render dashboard, go to your service → Environment tab and add:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/note-taking-app
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
CLIENT_URL=https://your-frontend-app.netlify.app
FRONTEND_URL=https://your-frontend-app.netlify.app
```

### **1.4 Get Your Backend URL**
After deployment, your backend will be available at:
```
https://note-taking-app-backend.onrender.com
```
**Save this URL - you'll need it for frontend deployment!**

---

## 🌐 **Step 2: Deploy Frontend to Netlify**

### **2.1 Create Netlify Account**
1. Go to [netlify.com](https://netlify.com) and sign up
2. Connect your GitHub account

### **2.2 Deploy Frontend**
1. Click "New site from Git"
2. Choose GitHub and select your repository
3. Configure build settings:
   - **Branch**: `main`
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### **2.3 Set Environment Variables**
In Netlify dashboard, go to Site settings → Environment variables:

```bash
VITE_API_BASE_URL=https://note-taking-app-backend.onrender.com/api
VITE_API_URL=https://note-taking-app-backend.onrender.com/api
VITE_APP_NAME=Note Taking App
VITE_APP_VERSION=1.0.0
```

### **2.4 Update Backend CORS**
After getting your Netlify URL (e.g., `https://amazing-app-123.netlify.app`), update your backend environment variables on Render:

```bash
CLIENT_URL=https://amazing-app-123.netlify.app
FRONTEND_URL=https://amazing-app-123.netlify.app
```

---

## 🔄 **Alternative: Deploy Frontend to Vercel**

### **2.1 Create Vercel Account**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account

### **2.2 Deploy Frontend**
1. Click "New Project"
2. Import your GitHub repository
3. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### **2.3 Set Environment Variables**
In Vercel dashboard, go to Settings → Environment Variables:

```bash
VITE_API_BASE_URL=https://note-taking-app-backend.onrender.com/api
VITE_API_URL=https://note-taking-app-backend.onrender.com/api
VITE_APP_NAME=Note Taking App
VITE_APP_VERSION=1.0.0
```

---

## 🎯 **Step 3: Final Configuration**

### **3.1 Update API URLs**
After both deployments, update your frontend environment:

**For Netlify:**
```bash
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
VITE_API_URL=https://your-backend-name.onrender.com/api
```

**For Vercel:**
```bash
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### **3.2 Trigger Redeploy**
1. Update environment variables in your deployment platform
2. Trigger a manual redeploy or push a small change to your repo

### **3.3 Test Your Live App**
Your app should now be live at:
- **Frontend**: `https://your-app.netlify.app` or `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**: Make sure frontend URL is added to backend CORS configuration
2. **Environment Variables**: Ensure all environment variables are set correctly
3. **API Endpoints**: Verify backend API URL is correct in frontend environment
4. **Build Errors**: Check build logs for missing dependencies or syntax errors

### **Testing Endpoints:**
```bash
# Test backend health
curl https://your-backend.onrender.com/api/health

# Test backend login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sumarduni@gmail.com","password":"password123"}'
```

---

## 🎉 **Success!**

Your Note Taking App is now live in production! 🚀

- **Frontend**: Beautiful React interface with Tailwind CSS
- **Backend**: Robust Node.js API with JWT authentication
- **Database**: MongoDB for data persistence
- **Features**: User authentication, CRUD operations, responsive design

**Next Steps:**
- Set up custom domain (optional)
- Configure monitoring and analytics
- Set up CI/CD for automatic deployments
- Add SSL certificates (usually automatic on Netlify/Vercel)

---

**Need help?** Check the main README.md for detailed documentation and troubleshooting tips!
