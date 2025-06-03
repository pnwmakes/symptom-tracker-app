// src/utils/exportToPDF.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToPDF(entries, startDate, endDate) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Symptom Tracker Report', 14, 20);

    // Summary title
    doc.setFontSize(12);
    let subtitle = 'Full History';
    if (startDate || endDate) {
        subtitle = `From ${startDate || 'Start'} to ${endDate || 'End'}`;
    }
    doc.text(subtitle, 14, 28);

    // Filter valid entries with numeric fields
    const validEntries = entries.filter((e) => e.pain || e.fatigue || e.memory);

    const calculateAverage = (field) => {
        const values = validEntries
            .map((e) => parseInt(e[field], 10))
            .filter((v) => !isNaN(v));
        const sum = values.reduce((a, b) => a + b, 0);
        return values.length ? (sum / values.length).toFixed(2) : 'N/A';
    };

    const summaryLines = [
        `Avg Pain: ${calculateAverage('pain')}`,
        `Avg Fatigue: ${calculateAverage('fatigue')}`,
        `Avg Memory: ${calculateAverage('memory')}`,
        `Avg Anxiety: ${calculateAverage('anxiety')}`,
        `Avg Depression: ${calculateAverage('depression')}`,
        `Avg Sleep: ${calculateAverage('sleep')}`,
    ];

    doc.setFontSize(10);
    summaryLines.forEach((line, idx) => {
        doc.text(line, 14, 36 + idx * 6);
    });

    // Table column setup
    const tableColumn = [
        'Date',
        'Pain',
        'Fatigue',
        'Memory',
        'Anxiety',
        'Depression',
        'Sleep',
        'Triggers',
        'Notes',
    ];

    // Sort oldest → newest
    const sortedEntries = [...entries].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.seconds - b.createdAt.seconds;
    });

    const tableRows = sortedEntries.map((entry) => {
        const date = entry.createdAt?.seconds
            ? new Date(entry.createdAt.seconds * 1000).toLocaleDateString()
            : 'No Date';

        return [
            date,
            entry.pain || '',
            entry.fatigue || '',
            entry.memory || '',
            entry.anxiety || '',
            entry.depression || '',
            entry.sleep || '',
            entry.triggers || '',
            entry.notes || '',
        ];
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [52, 58, 64] },
        margin: { top: 10 },
        didDrawPage: (data) => {
            const pageCount = doc.internal.getNumberOfPages();
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height || pageSize.getHeight();

            // Footer only
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${
                    doc.internal.getCurrentPageInfo().pageNumber
                } of ${pageCount}`,
                data.settings.margin.left,
                pageHeight - 10
            );
        },
    });

    doc.save('symptom-report.pdf');
}
