import React from 'react';
import { Chart } from 'primereact/chart';
import './styleDashBoard/DashboardCard.css';

const DashboardCard = ({ title, value, percentage, color, icon, chartData }) => {
    const options = {
        maintainAspectRatio: false,
        aspectRatio: 1.5,
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    };

    return (
        <div className={`card ${color}`}>
            <div className="card-header">
                <span className={`card-icon ${icon}`} />
                <h5>{title}</h5>
            </div>
            <div className="card-body">
                <p className="value">{value}</p>
                <p className="percentage">{percentage}</p>
                <Chart type="line" data={chartData} options={options} />
            </div>
        </div>
    );
};

export default DashboardCard;
