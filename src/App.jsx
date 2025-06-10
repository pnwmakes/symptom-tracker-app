import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SymptomForm from './components/SymptomForm.jsx';
import ViewEntries from './components/ViewEntries';
import Navbar from './components/Navbar.jsx';

function App() {
    const [entries, setEntries] = useState([]);
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

    // Fetch from Firestore for real users
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

    // Demo-only: Add/update/delete local entries
    const addLocalEntry = (entry) => {
        const id = Date.now().toString();
        setEntries((prev) => [{ ...entry, id }, ...prev]);
    };

    const updateLocalEntry = (updatedEntry) => {
        setEntries((prev) =>
            prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
        );
    };

    const deleteLocalEntry = (id) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        if (user && !isDemoUser) fetchEntries();
    }, [user]);

    if (!user) return null;

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-10 px-4'>
            <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8'>
                {/* Branding Header */}
                <div className='text-center mb-6'>
                    <h1 className='text-4xl font-extrabold text-indigo-600 tracking-tight'>
                        Symptom Tracker
                    </h1>
                    <p className='text-sm text-gray-500 mt-1'>
                        Track your health. Understand your patterns.
                    </p>
                </div>

                <div className='flex justify-center mb-4'>
                    <button
                        onClick={() => auth.signOut()}
                        className='flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow'
                    >
                        Log Out
                    </button>
                </div>

                {isDemoUser && (
                    <div className='bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 text-center font-semibold shadow mb-4 rounded-md'>
                        🧪 You’re using demo mode. Entries are stored locally
                        and not saved to the cloud.
                    </div>
                )}

                <SymptomForm
                    onSave={isDemoUser ? addLocalEntry : fetchEntries}
                    onUpdate={isDemoUser ? updateLocalEntry : null}
                    entryToEdit={editingEntry}
                    clearEdit={() => setEditingEntry(null)}
                    isDemoUser={isDemoUser}
                />

                <hr className='my-8' />

                <ViewEntries
                    entries={entries}
                    onEdit={handleEdit}
                    refreshEntries={isDemoUser ? null : fetchEntries}
                    deleteLocalEntry={isDemoUser ? deleteLocalEntry : null}
                    isDemoUser={isDemoUser}
                />
            </div>
        </div>
    );
}

export default App;
