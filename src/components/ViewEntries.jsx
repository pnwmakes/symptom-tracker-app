// src/components/ViewEntries.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../fireBaseConfig';

function ViewEntries() {
    const [entries, setEntries] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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

    return (
        <div className='p-4'>
            <h2 className='text-xl font-bold mb-4'>Saved Entries</h2>

            {/* Date range filters */}
            <div className='flex flex-col md:flex-row gap-4 mb-4'>
                <div>
                    <label className='block text-sm font-medium mb-1'>
                        Start Date
                    </label>
                    <input
                        type='date'
                        className='border rounded px-2 py-1 w-full'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium mb-1'>
                        End Date
                    </label>
                    <input
                        type='date'
                        className='border rounded px-2 py-1 w-full'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className='w-full overflow-x-auto'>
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
                            {entries
                                .filter((entry) => {
                                    if (!startDate && !endDate) return true;

                                    const entryDate = new Date(
                                        entry.createdAt?.seconds * 1000
                                    );
                                    const start = startDate
                                        ? new Date(startDate)
                                        : null;
                                    const end = endDate
                                        ? new Date(endDate)
                                        : null;

                                    if (start && entryDate < start)
                                        return false;
                                    if (end && entryDate > end) return false;

                                    return true;
                                })
                                .map((entry, idx) => (
                                    <tr
                                        key={entry.id}
                                        className='odd:bg-white even:bg-gray-50 hover:bg-yellow-100'
                                    >
                                        <td className='border border-gray-300 px-4 py-2'>
                                            {entry.createdAt?.seconds
                                                ? new Date(
                                                      entry.createdAt.seconds *
                                                          1000
                                                  ).toLocaleDateString(
                                                      'en-US',
                                                      {
                                                          year: 'numeric',
                                                          month: 'long',
                                                          day: 'numeric',
                                                      }
                                                  )
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
