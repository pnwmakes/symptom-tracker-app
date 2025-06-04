// App.jsx
import { useEffect, useState } from 'react';
import {
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import SymptomForm from './components/SymptomForm.jsx';
import ViewEntries from './components/ViewEntries';

function App() {
    const [entries, setEntries] = useState([]);
    const [editingEntry, setEditingEntry] = useState(null);

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

    // const handleDelete = async (id) => {
    //     if (!window.confirm('Are you sure you want to delete this entry?'))
    //         return;
    //     try {
    //         await deleteDoc(doc(db, 'symptomEntries', id));
    //         fetchEntries();
    //     } catch (err) {
    //         console.error('Failed to delete:', err);
    //         alert('Error deleting entry.');
    //     }
    // };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    return (
        <div className='p-4 max-w-4xl mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>Daily Symptom Tracker</h1>
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
    );
}

export default App;
