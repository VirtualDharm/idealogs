import React from 'react';

export default function Timetable() {
    const timeData = [
        { period: 'Daily', hours: [15, 5, 4], days: [0.625, 0.208, 0.167] },
        { period: 'Weekly', hours: [105, 35, 28], days: [4.375, 1.458, 1.167] },
        { period: 'Monthly', hours: [420, 140, 112], days: [17.5, 5.833, 4.667] },
        { period: '1st Year', hours: [5040, 1680, 1344], days: [210, 70, 56], years: 1 },
        { period: '2nd Year', hours: [10080, 3360, 2688], days: [420, 140, 112], fractionalYears: ['1.2', '0.4', '0.3'] },
        { period: '3rd Year', hours: [15120, 5040, 4032], days: [630, 210, 168], fractionalYears: ['1.7', '0.6', '0.5'] },
        { period: '4th Year', hours: [20160, 6720, 5376], days: [840, 280, 224], fractionalYears: ['2.3', '0.8', '0.6'] },
        { period: '5th Year', hours: [25200, 8400, 6720], days: [1050, 350, 280], fractionalYears: ['2.9', '1.0', '0.8'] },
    ];

    return (
        <div style={styles.container}>
            <h2 style={{ ...styles.heading, textAlign: 'left' }}>Total Hours (Physical/Social, Study, and Sleep)</h2>
            <div style={styles.timeList}>
                {timeData.map((item, index) => (
                    <p key={index} style={styles.timeItem}>
                        <strong>{item.period}:</strong> {item.hours.join(', ')} hours 
                        ({item.days.join(', ')} days) 
                        {item.years ? ` (${item.years} year${item.years > 1 ? 's' : ''})` : ''}
                        {item.fractionalYears ? ` (${item.fractionalYears.join(', ')} years)` : ''}
                    </p>
                ))}
            </div>

            <h1 style={styles.heading}>Daily Time Scheduler</h1>

            <div style={styles.schedule}>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>1:00 AM - 6:00 AM</h3>
                    <p style={styles.timeBlockText}>DSA</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.physical }}>
                    <h3 style={styles.timeBlockHeading}>6:00 AM - 7:00 AM</h3>
                    <p style={styles.timeBlockText}>Family Work</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.physical }}>
                    <h3 style={styles.timeBlockHeading}>7:00 AM - 8:00 AM</h3>
                    <p style={styles.timeBlockText}>Training</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>8:00 AM - 10:00 AM</h3>
                    <p style={styles.timeBlockText}>Apply</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>10:00 AM - 6:00 PM</h3>
                    <p style={styles.timeBlockText}>Development</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.physical, opacity: 0.77 }}>
                    <h3 style={styles.timeBlockHeading}>6:00 PM - 9:00 PM</h3>
                    <p style={styles.timeBlockText}>Friends</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.sleep }}>
                    <h3 style={styles.timeBlockHeading}>9:00 PM - 1:00 AM</h3>
                    <p style={styles.timeBlockText}>Sleep</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
    },
    timeList: {
        paddingLeft: '0',
    },
    timeItem: {
        fontSize: '16px',
        padding: '0', // Removes default padding
        margin: '0',  // Removes default margins
        backgroundColor: '#fff',
        lineHeight: '1.5',
    },
    schedule: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
    },
    timeBlock: {
        padding: '20px',
        borderRadius: '10px',
        color: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    timeBlockHeading: {
    },
    timeBlockText: {
        margin: 0,
    },
    study: {
        backgroundColor: '#4CAF50', // Green for study
    },
    physical: {
        backgroundColor: '#FF9800', // Orange for physical activities
    },
    sleep: {
        backgroundColor: '#2196F3', // Blue for sleep
    },
};
