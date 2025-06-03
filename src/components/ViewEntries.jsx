// src/components/ViewEntries.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../fireBaseConfig';
import { exportToPDF } from '../utils/exportToPDF';
import { exportToCSV } from '../utils/exportToCSV';

function ViewEntries() {
    const [entries, setEntries] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const entriesRef = collection(db, 'symptomEntries');
                const q = query(entriesRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEntries(data);
            } catch (err) {
                console.error('Error fetching entries:', err);
            }
        };

        fetchEntries();
    }, []);

    const filteredEntries = entries.filter((entry) => {
        if (!entry.createdAt?.seconds) return false;

        const entryDate = new Date(entry.createdAt.seconds * 1000);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && entryDate < start) return false;
        if (end && entryDate > end) return false;

        return true;
    });

    const handlePDFExport = () => {
        exportToPDF(filteredEntries);
    };

    const handleCSVExport = () => {
        exportToCSV(filteredEntries);
    };

    return (
        <div className='p-4'>
            <h2 className='text-xl font-bold mb-4'>Saved Entries</h2>

            {/* Date Filter Controls */}
            <div className='flex flex-col md:flex-row gap-4 mb-4'>
                <label>
                    Start Date:{' '}
                    <input
                        type='date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className='border px-2 py-1 rounded'
                    />
                </label>
                <label>
                    End Date:{' '}
                    <input
                        type='date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className='border px-2 py-1 rounded'
                    />
                </label>
                <button
                    onClick={handlePDFExport}
                    className='bg-blue-600 text-white px-4 py-2 rounded'
                >
                    Export Filtered PDF
                </button>
                <button
                    onClick={handleCSVExport}
                    className='bg-green-600 text-white px-4 py-2 rounded'
                >
                    Export Filtered CSV
                </button>
            </div>

            {/* Mobile Card View */}
            <div className='space-y-4 md:hidden'>
                {filteredEntries.map((entry) => (
                    <div
                        key={entry.id}
                        className='bg-white shadow-md rounded-lg p-4'
                    >
                        <p>
                            <strong>Date:</strong>{' '}
                            {entry.createdAt?.seconds
                                ? new Date(
                                      entry.createdAt.seconds * 1000
                                  ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                  })
                                : 'No Date'}
                        </p>
                        <p>
                            <strong>Pain:</strong> {entry.pain}
                        </p>
                        <p>
                            <strong>Fatigue:</strong> {entry.fatigue}
                        </p>
                        <p>
                            <strong>Memory:</strong> {entry.memory}
                        </p>
                        <p>
                            <strong>Notes:</strong> {entry.notes}
                        </p>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className='w-full overflow-x-auto hidden md:block'>
                <div className='inline-block min-w-full align-middle'>
                    <table className='min-w-full border-collapse border border-gray-300 text-sm'>
                        <thead>
                            <tr>
                                <th className='border px-4 py-2'>Date</th>
                                <th className='border px-4 py-2'>Pain</th>
                                <th className='border px-4 py-2'>Fatigue</th>
                                <th className='border px-4 py-2'>Memory</th>
                                <th className='border px-4 py-2'>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map((entry) => (
                                <tr
                                    key={entry.id}
                                    className='odd:bg-white even:bg-gray-50 hover:bg-yellow-100'
                                >
                                    <td className='border border-gray-300 px-4 py-2'>
                                        {entry.createdAt?.seconds
                                            ? new Date(
                                                  entry.createdAt.seconds * 1000
                                              ).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              })
                                            : 'No Date'}
                                    </td>
                                    <td className='border border-gray-300 px-4 py-2 capitalize'>
                                        {entry.pain}
                                    </td>
                                    <td className='border border-gray-300 px-4 py-2 capitalize'>
                                        {entry.fatigue}
                                    </td>
                                    <td className='border border-gray-300 px-4 py-2 capitalize'>
                                        {entry.memory}
                                    </td>
                                    <td className='border border-gray-300 px-4 py-2 capitalize'>
                                        {entry.notes}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewEntries;
