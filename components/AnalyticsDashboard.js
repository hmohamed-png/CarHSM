function AnalyticsDashboard() {
  try {
    const [stats, setStats] = React.useState({ total: 0, avgPerService: 0, mostExpensive: '', vehicleCount: 0 });
    const [loading, setLoading] = React.useState(true);
    const monthlyChartRef = React.useRef(null);
    const typeChartRef = React.useRef(null);

    React.useEffect(() => {
      loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
      try {
        const maintenance = await window.trickleListObjects('maintenance', 500, true);
        const vehicles = await window.trickleListObjects('vehicle', 100, true);
        const records = maintenance.items || [];
        
        const total = records.reduce((sum, r) => sum + (r.objectData.Cost || 0), 0);
        const avgPerService = records.length > 0 ? total / records.length : 0;
        
        const byType = {};
        records.forEach(r => {
          const type = r.objectData.ServiceType || 'Other';
          byType[type] = (byType[type] || 0) + (r.objectData.Cost || 0);
        });
        const mostExpensive = Object.keys(byType).reduce((a, b) => byType[a] > byType[b] ? a : b, 'N/A');

        setStats({ total, avgPerService, mostExpensive, vehicleCount: vehicles.items?.length || 0 });
        
        createMonthlyChart(records);
        createTypeChart(byType);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    const createMonthlyChart = (records) => {
      const monthlyData = {};
      records.forEach(r => {
        const month = new Date(r.objectData.Date || r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + (r.objectData.Cost || 0);
      });
      
      const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b)).slice(-6);
      const ctx = document.getElementById('monthlyChart');
      if (ctx && monthlyChartRef.current) monthlyChartRef.current.destroy();
      
      if (ctx) {
        monthlyChartRef.current = new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: sortedMonths,
            datasets: [{
              label: 'Monthly Spending (EGP)',
              data: sortedMonths.map(m => monthlyData[m]),
              backgroundColor: '#DC143C'
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
    };

    const createTypeChart = (byType) => {
      const ctx = document.getElementById('typeChart');
      if (ctx && typeChartRef.current) typeChartRef.current.destroy();
      
      if (ctx) {
        typeChartRef.current = new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(byType),
            datasets: [{
              data: Object.values(byType),
              backgroundColor: ['#DC143C', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      }
    };

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Expense Analytics</h1>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Spent</p>
              <div className="icon-dollar-sign text-xl text-green-600"></div>
            </div>
            <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.total.toLocaleString()} EGP</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Avg per Service</p>
              <div className="icon-trending-up text-xl text-blue-600"></div>
            </div>
            <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.avgPerService.toFixed(0)} EGP</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Most Expensive</p>
              <div className="icon-alert-circle text-xl text-orange-600"></div>
            </div>
            <p className="text-lg font-bold text-[var(--primary-color)]">{stats.mostExpensive}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Vehicles</p>
              <div className="icon-car text-xl text-purple-600"></div>
            </div>
            <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.vehicleCount}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Monthly Spending Trend</h2>
            <canvas id="monthlyChart"></canvas>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Spending by Service Type</h2>
            <canvas id="typeChart"></canvas>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AnalyticsDashboard error:', error);
    return null;
  }
}