import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { serverTimestamp } from 'firebase/firestore';

const SymptomForm = ({ onSave }) => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'symptomEntries'), {
                ...formData,
                createdAt: serverTimestamp(),
            });

            alert('Entry saved!');
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
            component;
        } catch (err) {
            console.error('Error saving entry:', err);
            alert('Failed to save entry');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className='w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-800'
        >
            <h2 className='text-3xl font-bold text-center'>
                Daily Symptom Check
            </h2>

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
                { name: 'anxiety', label: 'Anxiety' },
                { name: 'depression', label: 'Depression' },
                { name: 'sleep', label: 'Trouble Sleeping' },
                { name: 'fatigue', label: 'Fatigue' },
                { name: 'memory', label: 'Memory/Focus Issues' },
                { name: 'triggers', label: 'Triggers or Stressors' },
            ].map((symptom) => (
                <div key={symptom.name}>
                    <label className='block font-medium mb-2'>
                        {symptom.label}:
                    </label>
                    <div className='flex flex-wrap gap-4'>
                        {['0', '1', '2', '3'].map((val) => (
                            <label
                                key={val}
                                className='flex items-center gap-2 text-sm'
                            >
                                <input
                                    type='radio'
                                    name={symptom.name}
                                    value={val}
                                    checked={formData[symptom.name] === val}
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
            {/* Physical Pain (1-10 slider) */}
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
                    className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow'
                >
                    Save Entry
                </button>
            </div>
        </form>
    );
};

export default SymptomForm;
