import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateFibonacciSequence = (maxValue) => {
    const sequence = [1, 2];
    while (sequence[sequence.length - 1] < maxValue) {
        sequence.push(sequence[sequence.length - 1] + sequence[sequence.length - 2]);
    }
    return sequence;
};

const findNearestFibonacci = (num) => {
    if (num <= 1) return 1;
    let a = 1, b = 2;
    while (b < num) {
        [a, b] = [b, a + b];
    }
    return b - num < num - a ? b : a;
};

const FibonacciVoteStatisticsDashboard = ({ data }) => {
    const stats = useMemo(() => {
        const votes = Object.values(data.users)
            .map(user => Number(user?.vote))
            .filter(vote => !isNaN(vote) && vote > 0);

        const max = Math.max(...votes);
        const min = Math.min(...votes);
        const avg = votes.reduce((sum, vote) => sum + vote, 0) / votes.length;
        const nearestFib = findNearestFibonacci(Math.ceil(avg));

        const fibSequence = generateFibonacciSequence(Math.max(max, nearestFib));
        const voteCounts = fibSequence.reduce((acc, fib) => {
            acc[fib] = votes.filter(vote => findNearestFibonacci(vote) === fib).length;
            return acc;
        }, {});

        return { max, min, avg, nearestFib, voteCounts, fibSequence };
    }, [data]);

    const chartData = useMemo(() =>
        stats.fibSequence.map(fib => ({
            fibonacci: fib,
            votes: stats.voteCounts[fib] || 0
        }))
        , [stats]);

    return (
        <div className="vote-statistics-dashboard">
            <h2 className="dashboard-title">Fibonacci Vote Statistics for {data.name}</h2>
            <div className="statistics-grid">
                <div className="stat-item">Max Vote: {stats.max}</div>
                <div className="stat-item">Min Vote: {stats.min}</div>
                <div className="stat-item">Average Vote: {stats.avg.toFixed(2)}</div>
                <div className="stat-item">Nearest Fibonacci to Avg: {stats.nearestFib}</div>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width={400} height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="fibonacci" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="votes" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FibonacciVoteStatisticsDashboard;