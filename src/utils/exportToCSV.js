// src/utils/exportToCSV.js
export function exportToCSV(entries, filename = 'symptom-entries.csv') {
    const headers = ['Date', 'Pain', 'Fatigue', 'Memory', 'Notes'];
    const rows = entries.map((entry) => {
        const date = entry.createdAt?.seconds
            ? new Date(entry.createdAt.seconds * 1000).toLocaleDateString()
            : 'No Date';

        return [
            date,
            entry.pain ?? '',
            entry.fatigue ?? '',
            entry.memory ?? '',
            entry.notes?.replace(/\n/g, ' ') ?? '',
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
