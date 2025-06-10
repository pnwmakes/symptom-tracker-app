import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const SymptomForm = ({
    onSave,
    entryToEdit,
    clearEdit,
    isDemoUser,
    demoEntries = [],
    setDemoEntries,
}) => {
    const [formData, setFormData] = useState({
        date: '',
        anxiety: '',
        depression: '',
        sleep: '',
        fatigue: '',
        pain: '',
        memory: '',
        triggers: '',
        notes: '',
    });

    useEffect(() => {
        if (entryToEdit) {
            let formattedDate = '';
            if (entryToEdit.date) {
                formattedDate = entryToEdit.date;
            } else if (entryToEdit.createdAt?.seconds) {
                formattedDate = new Date(entryToEdit.createdAt.seconds * 1000)
                    .toISOString()
                    .split('T')[0];
            }
            setFormData({ ...entryToEdit, date: formattedDate });
        }
    }, [entryToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const parsedDate = formData.date
            ? new Date(formData.date + 'T12:00:00Z')
            : new Date();

        const newEntry = {
            ...formData,
            createdAt: parsedDate,
        };

        try {
            if (isDemoUser) {
                if (entryToEdit && entryToEdit.id) {
                    setDemoEntries((prev) =>
                        prev.map((entry) =>
                            entry.id === entryToEdit.id
                                ? { ...newEntry, id: entry.id }
                                : entry
                        )
                    );
                    alert('Demo: Entry updated (not saved to server).');
                } else {
                    const fakeId = Date.now().toString();
                    setDemoEntries((prev) => [
                        ...prev,
                        { ...newEntry, id: fakeId },
                    ]);
                    alert('Demo: Entry added (not saved to server).');
                }
            } else {
                if (entryToEdit && entryToEdit.id) {
                    const entryRef = doc(db, 'symptomEntries', entryToEdit.id);
                    await updateDoc(entryRef, {
                        ...formData,
                        createdAt: parsedDate,
                    });
                    alert('Entry updated!');
                    clearEdit();
                } else {
                    await addDoc(collection(db, 'symptomEntries'), {
                        ...formData,
                        createdAt: parsedDate,
                        userId: auth.currentUser.uid,
                    });
                    alert('Entry saved!');
                }
            }

            setFormData({
                date: '',
                anxiety: '',
                depression: '',
                sleep: '',
                fatigue: '',
                pain: '',
                memory: '',
                triggers: '',
                notes: '',
            });

            if (!isDemoUser && onSave) onSave();
        } catch (err) {
            console.error('Error saving entry:', err);
            alert('Failed to save entry');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className='w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-800'
        >
            <h2 className='text-3xl font-bold text-center'>
                {entryToEdit ? 'Edit Symptom Entry' : 'Daily Symptom Check'}
            </h2>
            {isDemoUser && (
                <p className='text-center text-yellow-700 text-sm font-medium'>
                    Demo mode: data is stored only in your browser session.
                </p>
            )}
            {/* Form fields... same as before, unchanged, all disabled={false} now since demo can edit */}
            {/* Leave your inputs and symptom selectors as-is here */}
            {/* Submit button */}
            <div className='text-center'>
                <button
                    type='submit'
                    className='bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition'
                >
                    {entryToEdit ? 'Update Entry' : 'Save Entry'}
                </button>
            </div>
        </form>
    );
};

export default SymptomForm;
