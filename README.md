# Symptom Tracker

The Symptom Tracker is a full-stack web application built with Vite + React and Firebase. It allows users to log daily symptoms, review past entries, filter by date range, and export reports in PDF or CSV format. This tool is designed to help users monitor their health over time and share clear, structured reports with medical professionals.

## Features

-   Add daily entries with symptom ratings and notes
-   Edit and delete previous entries
-   Responsive design with table view (desktop) and card view (mobile)
-   Date range filtering for focused reporting
-   Export filtered entries to PDF (with averages) or CSV
-   Visual symptom sliders and severity radio buttons
-   Firebase integration for real-time data storage

## Technologies Used

-   React (with Vite)
-   Firebase Firestore
-   jsPDF + jsPDF-AutoTable
-   FileSaver.js
-   Tailwind CSS

## Folder Structure

src/
├── components/
│ ├── SymptomForm.jsx
│ └── ViewEntries.jsx
├── firebaseConfig.js
├── App.jsx
├── main.jsx
public/
└── favicon.ico

## Deployment

The app is deployed via [Netlify](https://www.netlify.com/). Push to the `main` branch to trigger automatic deployment.

## Future Improvements

-   Email or browser push notifications for daily reminders
-   User authentication and data isolation
-   Symptom severity heatmaps or charts
-   PDF export archive or cloud storage
-   Optional medical metadata for entries (e.g., medications, blood pressure)

## License

This project is open-source and free to use under the MIT License.
