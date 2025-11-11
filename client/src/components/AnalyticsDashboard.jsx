import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { trickleListObjects } from '../utils/apiClient.js';

export default function AnalyticsDashboard() {
  try {
    const [stats, setStats] = useState({ total: 0, avgPerService: 0, mostExpensive: '', vehicleCount: 0 });
    const [loading, setLoading] = useState(true);
    const monthlyChartRef = useRef(null);
    const typeChartRef = useRef(null);

    useEffect(() => {
      const loadAnalytics = async () => {
        try {
          const maintenance = await trickleListObjects('maintenance', 500, true);
          const vehicles = await trickleListObjects('vehicle', 100, true);
          const records = maintenance.items || [];

          const total = records.reduce((sum, record) => sum + (record.objectData.Cost || 0), 0);
          const avgPerService = records.length > 0 ? total / records.length : 0;

          const byType = {};
          records.forEach((record) => {
            const type = record.objectData.ServiceType || 'Other';
            byType[type] = (byType[type] || 0) + (record.objectData.Cost || 0);
          });
          const mostExpensive =
            Object.keys(byType).reduce((prev, curr) => (byType[prev] > byType[curr] ? prev : curr), 'N/A') || 'N/A';

          setStats({
            total,
            avgPerService,
            mostExpensive,
            vehicleCount: vehicles.items?.length || 0
          });

          createMonthlyChart(records);
          createTypeChart(byType);
        } catch (error) {
          console.error('Error loading analytics:', error);
        } finally {
          setLoading(false);
        }
      };

      loadAnalytics();

      return () => {
        if (monthlyChartRef.current) monthlyChartRef.current.destroy();
        if (typeChartRef.current) typeChartRef.current.destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createMonthlyChart = (records) => {
      const monthlyData = {};
      records.forEach((record) => {
        const month = new Date(record.objectData.Date || record.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        });
        monthlyData[month] = (monthlyData[month] || 0) + (record.objectData.Cost || 0);
      });

      const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b)).slice(-6);
      const ctx = document.getElementById('monthlyChart');

      if (monthlyChartRef.current) {
        monthlyChartRef.current.destroy();
      }
      if (!ctx) return;

      monthlyChartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedMonths,
          datasets: [
            {
              label: 'Monthly Spending (EGP)',
              data: sortedMonths.map((month) => monthlyData[month]),
              backgroundColor: '#DC143C'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    };

    const createTypeChart = (byType) => {
      const ctx = document.getElementById('typeChart');
      if (typeChartRef.current) {
        typeChartRef.current.destroy();
      }
      if (!ctx) return;

      typeChartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(byType),
          datasets: [
            {
              data: Object.values(byType),
              backgroundColor: ['#DC143C', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    };

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Expense Analytics</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Spent</p>
              <div className="icon-dollar-sign text-xl text-green-600" />
            </div>
            <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.total.toLocaleString()} EGP</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Avg per Service</p>
              <div className="icon-trending-up text-xl text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.avgPerService.toFixed(0)} EGP</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Most Expensive</p>
              <div className="icon-alert-circle text-xl text-orange-600" />
            </div>
            <p className="text-lg font-bold text-[var(--primary-color)]">{stats.mostExpensive}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Vehicles</p>
              <div className="icon-car text-xl text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.vehicleCount}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Monthly Spending Trend</h2>
            <canvas id="monthlyChart" />
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Spending by Service Type</h2>
            <canvas id="typeChart" />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AnalyticsDashboard error:', error);
    return null;
  }
}
