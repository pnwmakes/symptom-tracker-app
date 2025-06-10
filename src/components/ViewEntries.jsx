import React, { useEffect, useState } from 'react';
import {
    collection,
    getDocs,
    orderBy,
    query,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Pencil, Trash2 } from 'lucide-react';

const ViewEntries = ({
    entries,
    onEdit,
    refreshEntries,
    isDemoUser,
    setDemoEntries,
}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filtered = entries.filter((entry) => {
        const createdAt = entry.createdAt?.seconds
            ? new Date(entry.createdAt.seconds * 1000)
            : new Date(entry.createdAt);

        if (!createdAt || isNaN(createdAt.getTime())) return false;

        const createdDate = createdAt.toISOString().split('T')[0];
        return (
            (!startDate || createdDate >= startDate) &&
            (!endDate || createdDate <= endDate)
        );
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this entry?'))
            return;

        if (isDemoUser) {
            setDemoEntries((prev) => prev.filter((entry) => entry.id !== id));
            return;
        }

        try {
            await deleteDoc(doc(db, 'symptomEntries', id));
            refreshEntries();
        } catch (err) {
            console.error('Failed to delete:', err);
            alert('Error deleting entry.');
        }
    };

    const exportCSV = () => {
        const filteredData = filtered.map((entry) => ({
            date:
                entry.date ||
                new Date(entry.createdAt.seconds * 1000)
                    .toISOString()
                    .split('T')[0],
            anxiety: Number(entry.anxiety ?? 0),
            depression: Number(entry.depression ?? 0),
            sleep: Number(entry.sleep ?? 0),
            fatigue: Number(entry.fatigue ?? 0),
            pain: Number(entry.pain ?? 0),
            memory: Number(entry.memory ?? 0),
            triggers: Number(entry.triggers ?? 0),
            notes: entry.notes || '',
        }));

        const avg = (key) =>
            filteredData.length
                ? (
                      filteredData.reduce((sum, e) => sum + (e[key] || 0), 0) /
                      filteredData.length
                  ).toFixed(1)
                : 'N/A';

        const avgLine = `Avg Anxiety: ${avg(
            'anxiety'
        )}  |  Avg Depression: ${avg('depression')}  |  Avg Fatigue: ${avg(
            'fatigue'
        )}  |  Avg Pain: ${avg('pain')}  |  Avg Memory: ${avg('memory')}`;

        const header =
            'Date,Anxiety,Depression,Sleep,Fatigue,Pain,Memory,Triggers,Notes';
        const rows = filteredData.map((row) =>
            [
                row.date,
                row.anxiety,
                row.depression,
                row.sleep,
                row.fatigue,
                row.pain,
                row.memory,
                row.triggers,
                `"${row.notes.replace(/"/g, '""')}"`,
            ].join(',')
        );

        const csvContent = [
            'Symptom Tracker Report',
            'All Entries',
            avgLine,
            'Scale: 0=None, 1=Mild, 2=Moderate, 3=Severe  |  Pain: 1–10',
            '',
            header,
            ...rows,
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'symptom-report.csv');
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const filteredData = filtered.map((entry) => ({
            date:
                entry.date ||
                new Date(entry.createdAt.seconds * 1000)
                    .toISOString()
                    .split('T')[0],
            anxiety: Number(entry.anxiety ?? 0),
            depression: Number(entry.depression ?? 0),
            sleep: Number(entry.sleep ?? 0),
            fatigue: Number(entry.fatigue ?? 0),
            pain: Number(entry.pain ?? 0),
            memory: Number(entry.memory ?? 0),
            triggers: Number(entry.triggers ?? 0),
            notes: entry.notes || '',
        }));

        const avg = (key) =>
            filteredData.length
                ? (
                      filteredData.reduce((sum, e) => sum + (e[key] || 0), 0) /
                      filteredData.length
                  ).toFixed(1)
                : 'N/A';

        const avgLine = `Avg Anxiety: ${avg(
            'anxiety'
        )}  |  Avg Depression: ${avg('depression')}  |  Avg Fatigue: ${avg(
            'fatigue'
        )}  |  Avg Pain: ${avg('pain')}  |  Avg Memory: ${avg('memory')}`;

        doc.setFontSize(18);
        doc.text('Symptom Tracker Report', 14, 20);
        doc.setFontSize(12);
        doc.text('All Entries', 14, 28);
        doc.text(avgLine, 14, 36);
        doc.text(
            'Scale: 0=None, 1=Mild, 2=Moderate, 3=Severe  |  Pain: 1–10',
            14,
            44
        );

        const rows = filteredData.map((entry) => [
            entry.date,
            entry.anxiety,
            entry.depression,
            entry.sleep,
            entry.fatigue,
            entry.pain,
            entry.memory,
            entry.triggers,
            entry.notes,
        ]);

        autoTable(doc, {
            head: [
                [
                    'Date',
                    'Anxiety',
                    'Depression',
                    'Sleep',
                    'Fatigue',
                    'Pain',
                    'Memory',
                    'Triggers',
                    'Notes',
                ],
            ],
            body: rows,
            startY: 50,
            styles: { fontSize: 10 },
            theme: 'grid',
        });

        const today = new Date().toISOString().split('T')[0];
        doc.save(`symptom-report-${today}.pdf`);
    };

    return (
        <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row gap-4 w-full sm:items-end mb-4'>
                <div className='flex flex-col w-full sm:w-auto'>
                    <label className='text-sm font-medium text-gray-700 mb-1'>
                        Start Date
                    </label>
                    <input
                        type='date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className='border rounded px-3 py-2 w-full sm:w-48'
                    />
                </div>
                <div className='flex flex-col w-full sm:w-auto'>
                    <label className='text-sm font-medium text-gray-700 mb-1'>
                        End Date
                    </label>
                    <input
                        type='date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className='border rounded px-3 py-2 w-full sm:w-48'
                    />
                </div>
                <div className='flex gap-2 mt-2 sm:mt-0'>
                    <button
                        onClick={exportCSV}
                        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm'
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={exportPDF}
                        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm'
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className='text-center text-gray-500'>
                    No entries found for the selected dates.
                </p>
            ) : (
                filtered.map((entry) => (
                    <div
                        key={entry.id}
                        className='bg-white shadow rounded-lg p-4 space-y-2 text-sm'
                    >
                        <div className='font-semibold text-gray-800'>
                            {entry.date ||
                                new Date(
                                    entry.createdAt.seconds * 1000
                                ).toLocaleDateString()}
                        </div>

                        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2'>
                            {[
                                'anxiety',
                                'depression',
                                'sleep',
                                'fatigue',
                                'pain',
                                'memory',
                                'triggers',
                            ].map((symptom) => (
                                <div key={symptom} className='mb-1'>
                                    <strong className='capitalize'>
                                        {symptom}:
                                    </strong>{' '}
                                    {entry[symptom] ?? 'N/A'}
                                </div>
                            ))}
                        </div>

                        {entry.notes && (
                            <div className='mt-2'>
                                <strong>Notes:</strong> {entry.notes}
                            </div>
                        )}

                        <div className='flex gap-4 justify-end pt-3 text-sm'>
                            <button
                                onClick={() => onEdit(entry)}
                                disabled={isDemoUser}
                                className={`flex items-center gap-1 text-blue-600 hover:underline ${
                                    isDemoUser
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                <Pencil size={16} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(entry.id)}
                                disabled={isDemoUser}
                                className={`flex items-center gap-1 text-red-600 hover:underline ${
                                    isDemoUser
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ViewEntries;
