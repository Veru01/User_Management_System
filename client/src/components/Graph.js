import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios'; 

const Graph = () => {
    const [setChart] = useState(null);
    const chartRef = useRef();

    const fetchData = async () => {
        try {
            
            const response = await axios.get('/getusers'); 
            const userData = response.data;

           
            const data = processData(userData);

            drawBarGraph(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const processData = (userData) => {
      
        const lastSevenDays = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            lastSevenDays.push(date.toISOString().split('T')[0]);
        }

        
        const userCountByDate = {};
        lastSevenDays.forEach(date => {
            userCountByDate[date] = 0;
        });

        
        userData.forEach(user => {
            const date = user.date.split('T')[0];
            if (userCountByDate[date] !== undefined) {
                userCountByDate[date]++;
            }
        });

        const totalUsers = userData.length;

        // Calculate percentages
        const data = lastSevenDays.map(date => {
            const count = userCountByDate[date] || 0;
            const percentage = (count / totalUsers) * 100;
            return { date, percentage };
        });

        return data;
    };

    const drawBarGraph = (data) => {
        if (data && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.date),
                    datasets: [{
                        label: '% of Users Added',
                        data: data.map(item => item.percentage),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        barThickness: 14
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max:100,
                            title: {
                                display: true,
                               
                                text: 'Number of Users Registered'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date Of Registration'
                            }
                        }
                    }
                }
            });
            setChart(newChart);
        }
    };

    const headingStyle = {
        fontFamily: 'Arial, sans-serif',
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center'
    };

    return (
        <>
            <h4 style={headingStyle}>PERCENTAGE OF USERS ADDED OVER THE LAST SEVEN DAYS</h4>
            <div className="your-component" style={{ margin: '20px' }}>
                <section id="bar-graph" style={{ width: '70%', margin: '0 auto' }}>
                    <canvas ref={chartRef} className="chart-canvas" style={{ width: '100%', height: '400px' }} />
                </section>
            </div>
        </>
    );
};

export default Graph;
