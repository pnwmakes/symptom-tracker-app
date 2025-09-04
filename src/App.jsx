// import { useEffect, useState } from 'react';
// import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
// import { db, auth } from './firebaseConfig';
// import { onAuthStateChanged } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import SymptomForm from './components/SymptomForm.jsx';
// import ViewEntries from './components/ViewEntries';
// import Navbar from './components/Navbar.jsx';

// function App() {
//     const [entries, setEntries] = useState([]);
//     const [demoEntries, setDemoEntries] = useState([]);
//     const [editingEntry, setEditingEntry] = useState(null);
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

//     const isDemoUser = user?.email === 'demo@symptomtracker.com';

//     // Track login state
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setUser(currentUser);
//             if (!currentUser) navigate('/login');
//         });
//         return () => unsubscribe();
//     }, [navigate]);

//     // Fetch real entries from Firestore
//     const fetchEntries = async () => {
//         if (isDemoUser) return;
//         const q = query(
//             collection(db, 'symptomEntries'),
//             where('userId', '==', auth.currentUser.uid),
//             orderBy('createdAt', 'desc')
//         );
//         const snapshot = await getDocs(q);
//         const data = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//         }));
//         setEntries(data);
//     };

//     // Local-only entry handlers for demo mode
//     const addLocalEntry = (entry) => {
//         const id = Date.now().toString();
//         setDemoEntries((prev) => [{ ...entry, id }, ...prev]);
//     };

//     const updateLocalEntry = (updatedEntry) => {
//         setDemoEntries((prev) =>
//             prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
//         );
//     };

//     const deleteLocalEntry = (id) => {
//         setDemoEntries((prev) => prev.filter((e) => e.id !== id));
//     };

//     const handleEdit = (entry) => {
//         setEditingEntry(entry);
//         window.scrollTo(0, 0);
//     };

//     // Fetch from Firestore if real user
//     useEffect(() => {
//         if (user && !isDemoUser) fetchEntries();
//     }, [user]);

//     // Prepopulate demo entries on first login
//     useEffect(() => {
//         if (user && isDemoUser && demoEntries.length === 0) {
//             const now = new Date();
//             const formatDate = (offset) =>
//                 new Date(now.getTime() - offset * 86400000)
//                     .toISOString()
//                     .split('T')[0];

//             const sample = [
//                 {
//                     id: '1',
//                     date: formatDate(0),
//                     anxiety: 2,
//                     depression: 1,
//                     sleep: 3,
//                     fatigue: 2,
//                     pain: 5,
//                     memory: 2,
//                     triggers: 1,
//                     notes: 'Mild headache today.',
//                     createdAt: now,
//                 },
//                 {
//                     id: '2',
//                     date: formatDate(1),
//                     anxiety: 1,
//                     depression: 1,
//                     sleep: 2,
//                     fatigue: 1,
//                     pain: 4,
//                     memory: 2,
//                     triggers: 0,
//                     notes: '',
//                     createdAt: new Date(now.getTime() - 1 * 86400000),
//                 },
//                 {
//                     id: '3',
//                     date: formatDate(2),
//                     anxiety: 3,
//                     depression: 2,
//                     sleep: 1,
//                     fatigue: 3,
//                     pain: 6,
//                     memory: 1,
//                     triggers: 2,
//                     notes: 'Stressful workday.',
//                     createdAt: new Date(now.getTime() - 2 * 86400000),
//                 },
//                 {
//                     id: '4',
//                     date: formatDate(3),
//                     anxiety: 0,
//                     depression: 0,
//                     sleep: 3,
//                     fatigue: 0,
//                     pain: 2,
//                     memory: 3,
//                     triggers: 0,
//                     notes: 'Felt great.',
//                     createdAt: new Date(now.getTime() - 3 * 86400000),
//                 },
//                 {
//                     id: '5',
//                     date: formatDate(4),
//                     anxiety: 2,
//                     depression: 1,
//                     sleep: 2,
//                     fatigue: 2,
//                     pain: 3,
//                     memory: 2,
//                     triggers: 1,
//                     notes: '',
//                     createdAt: new Date(now.getTime() - 4 * 86400000),
//                 },
//             ];

//             setDemoEntries(sample);
//         }
//     }, [user, isDemoUser, demoEntries.length]);

//     if (!user) return null;

//     return (
//         <div className='min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-10 px-4'>
//             <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8'>
//                 {/* Header */}
//                 <div className='text-center mb-6'>
//                     <h1 className='text-4xl font-extrabold text-indigo-600 tracking-tight'>
//                         Symptom Tracker
//                     </h1>
//                     <p className='text-sm text-gray-500 mt-1'>
//                         Track your health. Understand your patterns.
//                     </p>
//                 </div>

//                 {/* Log Out */}
//                 <div className='flex justify-center mb-4'>
//                     <button
//                         onClick={() => auth.signOut()}
//                         className='flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow'
//                     >
//                         Log Out
//                     </button>
//                 </div>

//                 {/* Demo Banner */}
//                 {isDemoUser && (
//                     <div className='bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 text-center font-semibold shadow mb-4 rounded-md'>
//                         🧪 You’re using demo mode. Entries are stored locally
//                         and not saved to the cloud.
//                     </div>
//                 )}

//                 {/* Symptom Form */}
//                 <SymptomForm
//                     onSave={isDemoUser ? addLocalEntry : fetchEntries}
//                     onUpdate={isDemoUser ? updateLocalEntry : null}
//                     entryToEdit={editingEntry}
//                     clearEdit={() => setEditingEntry(null)}
//                     isDemoUser={isDemoUser}
//                     demoEntries={demoEntries}
//                     setDemoEntries={setDemoEntries}
//                 />

//                 <hr className='my-8' />

//                 {/* Entry Viewer */}
//                 <ViewEntries
//                     entries={isDemoUser ? demoEntries : entries}
//                     onEdit={handleEdit}
//                     refreshEntries={isDemoUser ? null : fetchEntries}
//                     deleteLocalEntry={isDemoUser ? deleteLocalEntry : null}
//                     isDemoUser={isDemoUser}
//                     setDemoEntries={setDemoEntries}
//                 />
//             </div>
//         </div>
//     );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import SymptomForm from './components/SymptomForm.jsx';
import ViewEntries from './components/ViewEntries';
import Navbar from './components/Navbar.jsx'; // keep if you use it
import Header from './components/Header.jsx';

function App() {
    const [entries, setEntries] = useState([]);
    const [demoEntries, setDemoEntries] = useState([]);
    const [editingEntry, setEditingEntry] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const isDemoUser = user?.email === 'demo@symptomtracker.com';

    // Track login state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) navigate('/login');
        });
        return () => unsubscribe();
    }, [navigate]);

    // Fetch real entries from Firestore
    const fetchEntries = async () => {
        if (isDemoUser) return;
        const q = query(
            collection(db, 'symptomEntries'),
            where('userId', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setEntries(data);
    };

    // Local-only entry handlers for demo mode
    const addLocalEntry = (entry) => {
        const id = Date.now().toString();
        setDemoEntries((prev) => [{ ...entry, id }, ...prev]);
    };

    const updateLocalEntry = (updatedEntry) => {
        setDemoEntries((prev) =>
            prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
        );
    };

    const deleteLocalEntry = (id) => {
        setDemoEntries((prev) => prev.filter((e) => e.id !== id));
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        window.scrollTo(0, 0);
    };

    // Fetch from Firestore if real user
    useEffect(() => {
        if (user && !isDemoUser) fetchEntries();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // Prepopulate demo entries on first login
    useEffect(() => {
        if (user && isDemoUser && demoEntries.length === 0) {
            const now = new Date();
            const formatDate = (offset) =>
                new Date(now.getTime() - offset * 86400000)
                    .toISOString()
                    .split('T')[0];

            const sample = [
                {
                    id: '1',
                    date: formatDate(0),
                    anxiety: 2,
                    depression: 1,
                    sleep: 3,
                    fatigue: 2,
                    pain: 5,
                    memory: 2,
                    triggers: 1,
                    notes: 'Mild headache today.',
                    createdAt: now,
                },
                {
                    id: '2',
                    date: formatDate(1),
                    anxiety: 1,
                    depression: 1,
                    sleep: 2,
                    fatigue: 1,
                    pain: 4,
                    memory: 2,
                    triggers: 0,
                    notes: '',
                    createdAt: new Date(now.getTime() - 1 * 86400000),
                },
                {
                    id: '3',
                    date: formatDate(2),
                    anxiety: 3,
                    depression: 2,
                    sleep: 1,
                    fatigue: 3,
                    pain: 6,
                    memory: 1,
                    triggers: 2,
                    notes: 'Stressful workday.',
                    createdAt: new Date(now.getTime() - 2 * 86400000),
                },
                {
                    id: '4',
                    date: formatDate(3),
                    anxiety: 0,
                    depression: 0,
                    sleep: 3,
                    fatigue: 0,
                    pain: 2,
                    memory: 3,
                    triggers: 0,
                    notes: 'Felt great.',
                    createdAt: new Date(now.getTime() - 3 * 86400000),
                },
                {
                    id: '5',
                    date: formatDate(4),
                    anxiety: 2,
                    depression: 1,
                    sleep: 2,
                    fatigue: 2,
                    pain: 3,
                    memory: 2,
                    triggers: 1,
                    notes: '',
                    createdAt: new Date(now.getTime() - 4 * 86400000),
                },
            ];

            setDemoEntries(sample);
        }
    }, [user, isDemoUser, demoEntries.length]);

    if (!user) return null;

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200'>
            {/* Global header with user info and Sign Out */}
            <Header />

            {/* Optional site nav */}
            {/* <Navbar /> */}

            <div className='py-10 px-4'>
                <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8'>
                    {/* Demo Banner */}
                    {isDemoUser && (
                        <div className='bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 text-center font-semibold shadow mb-4 rounded-md'>
                            🧪 You are using demo mode. Entries are stored
                            locally and not saved to the cloud.
                        </div>
                    )}

                    {/* Symptom Form */}
                    <SymptomForm
                        onSave={isDemoUser ? addLocalEntry : fetchEntries}
                        onUpdate={isDemoUser ? updateLocalEntry : null}
                        entryToEdit={editingEntry}
                        clearEdit={() => setEditingEntry(null)}
                        isDemoUser={isDemoUser}
                        demoEntries={demoEntries}
                        setDemoEntries={setDemoEntries}
                    />

                    <hr className='my-8' />

                    {/* Entry Viewer */}
                    <ViewEntries
                        entries={isDemoUser ? demoEntries : entries}
                        onEdit={handleEdit}
                        refreshEntries={isDemoUser ? null : fetchEntries}
                        deleteLocalEntry={isDemoUser ? deleteLocalEntry : null}
                        isDemoUser={isDemoUser}
                        setDemoEntries={setDemoEntries}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
