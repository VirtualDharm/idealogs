import React from 'react';

export default function Timetable() {
    const timeData = [
        { period: 'Daily', hours: [17.0, 2.5, 4.5], days: [0.709, 0.104, 0.188] },
        { period: 'Weekly', hours: [119.0, 17.5, 31.5], days: [4.959, 0.729, 1.313] },
        { period: 'Monthly', hours: [510.0, 75.0, 135.0], days: [21.25, 3.125, 5.625] },
        { period: '1st Year', hours: [6120.0, 900.0, 1620.0], days: [255.0, 37.5, 67.5], years: 1 },
        { period: '2nd Year', hours: [12240.0, 1800.0, 3240.0], days: [510.0, 75.0, 135.0], fractionalYears: ['1.39', '0.21', '0.37'] },
        { period: '3rd Year', hours: [18360.0, 2700.0, 4860.0], days: [765.0, 112.5, 202.5], fractionalYears: ['2.09', '0.31', '0.56'] },
        { period: '4th Year', hours: [24480.0, 3600.0, 6480.0], days: [1020.0, 150.0, 270.0], fractionalYears: ['2.79', '0.41', '0.74'] },
        { period: '5th Year', hours: [30600.0, 4500.0, 8100.0], days: [1275.0, 187.5, 337.5], fractionalYears: ['3.49', '0.52', '0.93'] },
    ];

    return (
        <div style={styles.container}>
            <h2 style={{ ...styles.heading, textAlign: 'left' }}>Total Hours (Study, Social and Sleep)</h2>
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
                    <h3 style={styles.timeBlockHeading}>12:00 AM - 2:00</h3>
                    <p style={styles.timeBlockText}>Apply 1</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>2:00 AM - 6:30AM</h3>
                    <p style={styles.timeBlockText}>Open Source ya DSA</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>6:30 AM - 9:30 PM</h3>
                    <p style={styles.timeBlockText}>TA</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>9:30 AM - 3:00 PM</h3>
                    <p style={styles.timeBlockText}>Open Source ya DSA ya Revision</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>3:00 PM - 5:00</h3>
                    <p style={styles.timeBlockText}>Apply 2</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.physical, opacity: 0.77 }}>
                    <h3 style={styles.timeBlockHeading}>5:00 PM - 7:00 PM</h3>
                    <p style={styles.timeBlockText}>Friends</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.physical, opacity: 0.77 }}>
                    <h3 style={styles.timeBlockHeading}>7:00 PM - 8:00 PM</h3>
                    <p style={styles.timeBlockText}>check UP</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.sleep }}>
                    <h3 style={styles.timeBlockHeading}>8:00 PM - 12:00 AM</h3>
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
