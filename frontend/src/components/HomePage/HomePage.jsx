import React from 'react'
import './homemain.css'
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";
export const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="home-main">
            <div className="hometext">
                <h1 id="h1-home-title">Hospital <br /> Management System</h1>
                <p id="p-home-text">Easy to get analyst information about patients,<br />doctors,and employees</p>
                <button className='btn-grad' onClick={() => { navigate('/dashboard') }}>Start Now</button>
            </div>
            <div className="outerchart">
                <Doughnut
                    data={{
                        labels: [
                            'Male      ',
                            'Female',
                        ],
                        datasets: [
                            {

                                data: [60, 100],
                                backgroundColor: [
                                    "#F875AA",
                                    "#C5FFF8",
                                ],
                                borderRadius: 5,
                                hoverOffset: 5,
                            },
                        ],
                    }}
                />
            </div>
            <div className="chartall">
                <div className="chart1">
                    <Bar
                        data={{
                            labels: ["", "", "", "", "", ""],
                            datasets: [
                                {
                                    label: "Gender",
                                    data: [200, 300, 400, 100, 200, 50],
                                    backgroundColor: [
                                        "#C5FFF8",
                                        "#F875AA",
                                    ],


                                },
                            ],
                        }}

                    />
                </div>
                <div className="charts2section">
                    <div className="chart2">
                        <Line
                            data={{
                                labels: ["", "", "", "", "", ""],
                                datasets: [
                                    {
                                        label: "Gender",
                                        data: [200, 300, 400, 100, 200, 50],
                                        backgroundColor: [
                                            "#C5FFF8",
                                            "#F875AA",
                                        ],
                                        borderColor: "#929AAB",

                                    },
                                ],
                            }}
                            options={
                                {
                                    elements: {
                                        line: {
                                            tension: 0.5,
                                        },
                                    },
                                }
                            }
                        />
                    </div>
                    <div className="chart3">
                        <Doughnut
                            data={{

                                datasets: [
                                    {
                                        label: "Revenue",
                                        data: [300, 100],
                                        backgroundColor: [
                                            "#929AAB",
                                            "white",
                                        ],
                                        borderRadius: 5,

                                    },
                                ],
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

