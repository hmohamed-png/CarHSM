function ServiceCenterList() {
  try {
    const [centers, setCenters] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
      loadCenters();
    }, []);

    const loadCenters = async () => {
      try {
        const data = await trickleListObjects('service_center', 50, true);
        setCenters(data.items || []);
      } catch (error) {
        console.error('Error loading centers:', error);
      } finally {
        setLoading(false);
      }
    };

    const filteredCenters = centers.filter(center =>
      center.objectData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.objectData.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.objectData.services?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Service Centers</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search service centers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredCenters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="icon-map-pin text-5xl text-gray-300 mb-4"></div>
            <p className="text-gray-500">No service centers found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCenters.map((center, index) => (
              <div key={center.objectId} className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300" style={{animation: 'slideUp 0.5s ease-out', animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards'}}>
                <h3 className="text-xl font-bold mb-2">{center.objectData.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{center.objectData.address}</p>
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <div key={star} className={`icon-star text-lg ${star <= (center.objectData.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}></div>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({center.objectData.reviewCount || 0})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ServiceCenterList error:', error);
    return null;
  }
}