import React from 'react';

export default function Timetable() {
    const timeData = [
        { period: 'Daily', hours: [15.5, 4.5, 4], days: [0.646, 0.188, 0.167] },
        { period: 'Weekly', hours: [108.5, 31.5, 28], days: [4.521, 1.313, 1.167] },
        { period: 'Monthly', hours: [465, 135, 120], days: [19.375, 5.625, 5] },
        { period: '1st Year', hours: [5580, 1620, 1440], days: [232.5, 67.5, 60], years: 1 },
        { period: '2nd Year', hours: [11160, 3240, 2880], days: [465, 135, 120], fractionalYears: ['1.27', '0.37', '0.33'] },
        { period: '3rd Year', hours: [16740, 4860, 4320], days: [697.5, 202.5, 180], fractionalYears: ['1.91', '0.56', '0.49'] },
        { period: '4th Year', hours: [22320, 6480, 5760], days: [930, 270, 240], fractionalYears: ['2.55', '0.74', '0.66'] },
        { period: '5th Year', hours: [27900, 8100, 7200], days: [1162.5, 337.5, 300], fractionalYears: ['3.19', '0.93', '0.82'] },
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
                    <h3 style={styles.timeBlockHeading}>1:00 AM - 6:30AM</h3>
                    <p style={styles.timeBlockText}>DSA</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.physical }}>
                    <h3 style={styles.timeBlockHeading}>6:30 AM - 8:00 AM</h3>
                    <p style={styles.timeBlockText}>Gym</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>8:00 AM - 4:00 PM</h3>
                    <p style={styles.timeBlockText}>Development</p>
                </div>
                <div style={{ ...styles.timeBlock, ...styles.study }}>
                    <h3 style={styles.timeBlockHeading}>4:00 AM - 6:00</h3>
                    <p style={styles.timeBlockText}>Apply</p>
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
