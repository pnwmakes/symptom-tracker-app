import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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

    // 🔐 Track login state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) navigate('/login');
        });
        return () => unsubscribe();
    }, [navigate]);

    // 📋 Fetch entries if logged in
    const fetchEntries = async () => {
        const q = query(
            collection(db, 'symptomEntries'),
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
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-100 py-10 px-4'>
                <div className='max-w-4xl mx-auto bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold mb-6 text-gray-800 text-center'>
                        Daily Symptom Tracker
                    </h1>

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
        </>
    );
}

export default App;
