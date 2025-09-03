// src/hooks/useSymptomFields.js
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const useSymptomFields = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const fieldsRef = collection(db, 'users', user.uid, 'symptomFields');

        const unsubscribe = onSnapshot(fieldsRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFields(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { fields, loading };
};

export default useSymptomFields;
