import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import SymptomForm from './components/SymptomForm';
import ViewEntries from './components/ViewEntries';

function App() {
    const [entries, setEntries] = useState([]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

    // ✅ Enable notifications only from user-initiated action
    const handleNotificationRequest = () => {
        Notification.requestPermission().then((permission) => {
            console.log('User clicked and gave permission:', permission);
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                new Notification('Notifications enabled!', {
                    body: 'We’ll remind you daily to check your symptoms.',
                });
            } else {
                alert(
                    'Please enable notifications to receive daily reminders.'
                );
            }
        });
    };

    useEffect(() => {
        fetchEntries();

        if (Notification.permission === 'granted') {
            setNotificationsEnabled(true);
        }

        const lastShownKey = 'lastReminderShown';

        const interval = setInterval(() => {
            const now = new Date();
            const lastShown = localStorage.getItem(lastShownKey);
            const today = now.toDateString();

            console.log('⏰ Checking for reminder...', {
                now,
                lastShown,
                today,
            });

            if (
                Notification.permission === 'granted' &&
                lastShown !== today &&
                now.getHours() >= 10 &&
                now.getHours() <= 18
            ) {
                new Notification('Daily Symptom Reminder', {
                    body: 'Don’t forget to fill out your symptom check today!',
                });
                localStorage.setItem(lastShownKey, today);
            }
        }, 60 * 1000); // check every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='p-4 max-w-3xl mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>Daily Symptom Tracker</h1>

            {/* ✅ Notification enable button */}
            {!notificationsEnabled && (
                <div className='mb-4'>
                    <button
                        onClick={handleNotificationRequest}
                        className='bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow'
                    >
                        Enable Daily Notifications
                    </button>
                </div>
            )}

            <SymptomForm onSave={fetchEntries} />
            <hr className='my-8' />
            <ViewEntries entries={entries} />
        </div>
    );
}

export default App;
