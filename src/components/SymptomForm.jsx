import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { auth } from '../firebaseConfig';

const SymptomForm = ({ onSave, entryToEdit, clearEdit, isDemoUser }) => {
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

            setFormData({
                date: formattedDate,
                anxiety: entryToEdit.anxiety || '',
                depression: entryToEdit.depression || '',
                sleep: entryToEdit.sleep || '',
                fatigue: entryToEdit.fatigue || '',
                pain: entryToEdit.pain || '',
                memory: entryToEdit.memory || '',
                triggers: entryToEdit.triggers || '',
                notes: entryToEdit.notes || '',
            });
        }
    }, [entryToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDemoUser) return;

        try {
            const parsedDate = formData.date
                ? new Date(formData.date + 'T12:00:00Z')
                : new Date();

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

            if (onSave) onSave();
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
                <p className='text-center text-red-500 text-sm font-medium'>
                    Demo mode: entries are not saved to the cloud.
                </p>
            )}

            <div>
                <label className='block font-medium mb-1'>Date:</label>
                <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                />
            </div>

            {[
                'anxiety',
                'depression',
                'sleep',
                'fatigue',
                'memory',
                'triggers',
            ].map((symptom) => (
                <div key={symptom}>
                    <label className='block font-medium mb-2 capitalize'>
                        {symptom}:
                    </label>
                    <div className='flex flex-wrap gap-4'>
                        {['0', '1', '2', '3'].map((val) => (
                            <label
                                key={val}
                                className='flex items-center gap-2 text-sm'
                            >
                                <input
                                    type='radio'
                                    name={symptom}
                                    value={val}
                                    checked={formData[symptom] === val}
                                    onChange={handleChange}
                                    required
                                />
                                {val === '0'
                                    ? 'None'
                                    : val === '1'
                                    ? 'Mild'
                                    : val === '2'
                                    ? 'Moderate'
                                    : 'Severe'}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <div>
                <label className='block font-medium mb-2'>
                    Physical Pain (1–10):
                </label>
                <input
                    type='range'
                    name='pain'
                    min='1'
                    max='10'
                    value={formData.pain}
                    onChange={handleChange}
                    className='w-full'
                />
                <div className='text-sm text-gray-700 mt-1'>
                    Current: <strong>{formData.pain || 'N/A'}</strong>
                </div>
            </div>

            <div>
                <label className='block font-medium mb-1'>Notes:</label>
                <textarea
                    name='notes'
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder='Any additional context...'
                    className='w-full border border-gray-300 rounded-lg px-3 py-2'
                    rows='4'
                />
            </div>

            <div className='text-center'>
                <button
                    type='submit'
                    className={`bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition ${
                        isDemoUser ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isDemoUser}
                >
                    {isDemoUser
                        ? 'Demo Mode – Cannot Save'
                        : entryToEdit
                        ? 'Update Entry'
                        : 'Save Entry'}
                </button>
                {isDemoUser && (
                    <p className='mt-2 text-xs text-gray-500'>
                        You can try the form, but changes won't be saved.
                    </p>
                )}
            </div>
        </form>
    );
};

export default SymptomForm;
