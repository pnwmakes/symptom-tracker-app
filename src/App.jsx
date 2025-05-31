import SymptomForm from './components/SymptomForm';
import ViewEntries from './components/ViewEntries';

function App() {
    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <div className='max-w-3xl mx-auto'>
                <h1 className='text-2xl font-bold mb-4'>
                    Daily Symptom Tracker
                </h1>
                <SymptomForm />
                <hr className='my-8' />
                <ViewEntries />
            </div>
        </div>
    );
}

export default App;
