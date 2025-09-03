// src/components/SymptomSettings.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SymptomSettings = () => {
    const [customSymptoms, setCustomSymptoms] = useState([]);
    const [newSymptom, setNewSymptom] = useState('');
    const navigate = useNavigate();

    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'customSymptoms'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCustomSymptoms(data);
        });

        return () => unsubscribe();
    }, [user]);

    const handleAddSymptom = async () => {
        if (newSymptom.trim() === '' || !user) return;

        await addDoc(collection(db, 'customSymptoms'), {
            name: newSymptom.trim(),
            userId: user.uid,
            createdAt: new Date(),
        });

        setNewSymptom('');
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'customSymptoms', id));
    };

    return (
        <div className='max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10'>
            <h2 className='text-3xl font-bold mb-4 text-center'>
                Manage Custom Symptoms
            </h2>

            <div className='flex gap-2 mb-4'>
                <input
                    type='text'
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    placeholder='Add a custom symptom...'
                    className='flex-grow px-3 py-2 border border-gray-300 rounded-lg'
                />
                <button
                    onClick={handleAddSymptom}
                    className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700'
                >
                    Add
                </button>
            </div>

            <ul className='space-y-2'>
                {customSymptoms.map((symptom) => (
                    <li
                        key={symptom.id}
                        className='flex justify-between items-center border-b pb-1'
                    >
                        <span>{symptom.name}</span>
                        <button
                            onClick={() => handleDelete(symptom.id)}
                            className='text-red-500 text-sm hover:underline'
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <div className='mt-6 text-center'>
                <button
                    onClick={() => navigate('/')}
                    className='text-sm text-indigo-600 underline hover:text-indigo-800'
                >
                    ← Back to Tracker
                </button>
            </div>
        </div>
    );
};

export default SymptomSettings;
