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

const ViewEntries = ({ entries, onEdit, refreshEntries }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // Tailwind's "md" breakpoint
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filtered = entries.filter((entry) => {
        const createdAt = entry.createdAt?.seconds
            ? new Date(entry.createdAt.seconds * 1000)
            : null;
        if (!createdAt) return false;

        const afterStart = !startDate || createdAt >= new Date(startDate);
        const beforeEnd = !endDate || createdAt <= new Date(endDate);

        return afterStart && beforeEnd;
    });

    const calculateAverage = (field) => {
        const validValues = filtered
            .map((entry) => Number(entry[field]))
            .filter((val) => !isNaN(val));
        if (!validValues.length) return 'N/A';
        const sum = validValues.reduce((acc, val) => acc + val, 0);
        return (sum / validValues.length).toFixed(1);
    };

    const exportToCSV = () => {
        const headers = [
            'Date',
            'Anxiety',
            'Depression',
            'Sleep',
            'Fatigue',
            'Pain',
            'Memory',
            'Triggers',
            'Notes',
        ];

        const legendComment =
            '# Scale: 0=None, 1=Mild, 2=Moderate, 3=Severe (except Pain: 1–10)';

        const csvRows = [
            legendComment,
            headers.join(','),
            ...filtered.map((entry) => {
                const date = entry.createdAt?.seconds
                    ? new Date(
                          entry.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : '';
                return [
                    date,
                    entry.anxiety ?? '',
                    entry.depression ?? '',
                    entry.sleep ?? '',
                    entry.fatigue ?? '',
                    entry.pain ?? '',
                    entry.memory ?? '',
                    entry.triggers ?? '',
                    `"${(entry.notes || '').replace(/"/g, '""')}"`,
                ].join(',');
            }),
        ];

        const blob = new Blob([csvRows.join('\n')], {
            type: 'text/csv;charset=utf-8;',
        });
        saveAs(
            blob,
            `symptom-entries-${new Date().toISOString().slice(0, 10)}.csv`
        );
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text('Symptom Tracker Report', 14, 20);

        const dateRange =
            startDate || endDate
                ? `Date Range: ${startDate || '...'} – ${endDate || '...'}`
                : 'All Entries';

        doc.setFontSize(10);
        doc.text(dateRange, 14, 28);

        // Add symptom scale legend
        doc.setFontSize(8);
        doc.text(
            'Symptom Scale (0–3): 0=None | 1=Mild | 2=Moderate | 3=Severe',
            14,
            34
        );
        doc.text('Pain Scale: 1–10', 14, 38);

        // Return to standard font size for averages
        doc.setFontSize(10);
        doc.text(
            `Avg Anxiety: ${calculateAverage(
                'anxiety'
            )}  |  Avg Depression: ${calculateAverage(
                'depression'
            )}  |  Avg Fatigue: ${calculateAverage(
                'fatigue'
            )}  |  Avg Pain: ${calculateAverage(
                'pain'
            )}  |  Avg Memory: ${calculateAverage('memory')}`,
            14,
            45
        );

        autoTable(doc, {
            startY: 50, // Moved down to fit legend
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
            body: filtered.map((entry) => [
                entry.createdAt?.seconds
                    ? new Date(
                          entry.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : '',
                entry.anxiety,
                entry.depression,
                entry.sleep,
                entry.fatigue,
                entry.pain,
                entry.memory,
                entry.triggers,
                entry.notes,
            ]),
        });

        doc.save(`symptom-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this entry?'
        );
        if (!confirmed) return;

        try {
            await deleteDoc(doc(db, 'symptomEntries', id));
            alert('Entry deleted.');
            refreshEntries?.();
        } catch (err) {
            console.error('Error deleting entry:', err);
            alert('Failed to delete entry.');
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex gap-4 flex-wrap'>
                <label>
                    Start Date:
                    <input
                        type='date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className='ml-2 border px-2 py-1 rounded'
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type='date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className='ml-2 border px-2 py-1 rounded'
                    />
                </label>
                <button
                    onClick={exportToCSV}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded'
                >
                    Export CSV
                </button>
                <button
                    onClick={exportToPDF}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
                >
                    Export PDF
                </button>
            </div>

            {isMobile ? (
                <div className='space-y-4'>
                    {filtered.map((entry) => (
                        <div
                            key={entry.id}
                            className='border p-4 rounded shadow bg-white'
                        >
                            <p className='text-sm text-gray-500'>
                                {entry.createdAt?.seconds
                                    ? new Date(
                                          entry.createdAt.seconds * 1000
                                      ).toLocaleDateString()
                                    : 'No date'}
                            </p>
                            <p>
                                <strong>Anxiety:</strong> {entry.anxiety}
                            </p>
                            <p>
                                <strong>Depression:</strong> {entry.depression}
                            </p>
                            <p>
                                <strong>Sleep:</strong> {entry.sleep}
                            </p>
                            <p>
                                <strong>Fatigue:</strong> {entry.fatigue}
                            </p>
                            <p>
                                <strong>Pain:</strong> {entry.pain}
                            </p>
                            <p>
                                <strong>Memory:</strong> {entry.memory}
                            </p>
                            <p>
                                <strong>Triggers:</strong> {entry.triggers}
                            </p>
                            <p>
                                <strong>Notes:</strong> {entry.notes}
                            </p>
                            <div className='mt-2 flex gap-4'>
                                <button
                                    onClick={() => onEdit(entry)}
                                    className='text-blue-600 underline'
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    className='text-red-600 underline'
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <p className='text-center text-gray-500'>
                            No entries found for the selected range.
                        </p>
                    )}
                </div>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='w-full table-auto border-collapse mt-4'>
                        <thead>
                            <tr className='bg-gray-200 text-sm'>
                                <th className='p-2'>Date</th>
                                <th>Anxiety</th>
                                <th>Depression</th>
                                <th>Sleep</th>
                                <th>Fatigue</th>
                                <th>Pain</th>
                                <th>Memory</th>
                                <th>Triggers</th>
                                <th>Notes</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((entry) => (
                                <tr key={entry.id} className='text-sm border-t'>
                                    <td className='p-2'>
                                        {entry.createdAt?.seconds
                                            ? new Date(
                                                  entry.createdAt.seconds * 1000
                                              ).toLocaleDateString()
                                            : 'No date'}
                                    </td>
                                    <td>{entry.anxiety}</td>
                                    <td>{entry.depression}</td>
                                    <td>{entry.sleep}</td>
                                    <td>{entry.fatigue}</td>
                                    <td>{entry.pain}</td>
                                    <td>{entry.memory}</td>
                                    <td>{entry.triggers}</td>
                                    <td className='max-w-xs break-words whitespace-pre-wrap'>
                                        {entry.notes}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => onEdit(entry)}
                                            className='text-blue-600 underline'
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleDelete(entry.id)
                                            }
                                            className='text-red-600 underline'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan='11'
                                        className='text-center p-4 text-gray-500'
                                    >
                                        No entries found for the selected range.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewEntries;
