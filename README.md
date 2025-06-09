# Symptom Tracker App

A responsive web application built with React, Firebase, and TailwindCSS to help users track and export their daily physical and mental health symptoms.

## Features

-   User authentication (signup, login, logout, remember me)
-   Password visibility toggle on login and signup forms
-   Daily symptom tracking for anxiety, depression, sleep, fatigue, memory, pain, and notes
-   Date-based entries with accurate timestamps
-   View, edit, and delete entries in a responsive layout
-   Export entries to PDF and CSV with doctor-friendly print styling and symptom scale legend
-   Mobile-optimized card view and centered desktop layout
-   Firestore security rules for per-user data protection

## Tech Stack

-   Frontend: React, Vite, TailwindCSS
-   Backend: Firebase Authentication and Firestore
-   PDF/CSV: jsPDF, autoTable, FileSaver.js
-   Deployment: Netlify

## Security

-   Each entry is tied to the logged-in user's unique Firebase `userId`
-   Firestore rules restrict read/write access to authenticated users
-   API keys are excluded from the repository using `.env` files

## Local Setup

```bash
git clone https://github.com/your-username/symptom-tracker-app.git
cd symptom-tracker-app
npm install
npm run dev
```

Create a `.env` file with your Firebase configuration:

```
VITE_API_KEY=your-api-key
VITE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-project.appspot.com
VITE_MESSAGING_SENDER_ID=your-sender-id
VITE_APP_ID=your-app-id


```

## 🔍 Demo Account

You can try the app live without signing up:

**Demo Login:**  
Email: `demo@symptomtracker.com`  
Password: `symptomDemo2024!`

Please don’t store sensitive information when using the demo.

## Live Demo

[https://symptomtrackerapp.netlify.app](https://symptomtrackerapp.netlify.app)

## Future Plans

-   Add email or push notification reminders
-   Visualize symptom trends with charts
-   Allow users to define and track custom symptoms
-   Optional demo mode for showcasing app without exposing private data

---

_Last updated: June 8, 2025_
