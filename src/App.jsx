import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SymptomForm from './components/SymptomForm.jsx';
import ViewEntries from './components/ViewEntries';
import Navbar from './components/Navbar.jsx';
import { where } from 'firebase/firestore';

function App() {
    const [entries, setEntries] = useState([]);
    const [editingEntry, setEditingEntry] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 🔐 Track login state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) navigate('/login');
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchEntries = async () => {
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

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        if (user) fetchEntries();
    }, [user]);

    if (!user) return null; // optional loading indicator

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
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1'
                            />
                        </svg>
                        Log Out
                    </button>
                </div>

                <SymptomForm
                    onSave={fetchEntries}
                    entryToEdit={editingEntry}
                    clearEdit={() => setEditingEntry(null)}
                />

                <hr className='my-8' />

                <ViewEntries
                    entries={entries}
                    onEdit={handleEdit}
                    refreshEntries={fetchEntries}
                />
            </div>
        </div>
    );
}

export default App;
