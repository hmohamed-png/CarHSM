import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { trickleListObjects } from '../utils/apiClient.js';

export default function MarketplaceListing() {
  try {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    useEffect(() => {
      const loadListings = async () => {
        try {
          const data = await trickleListObjects('marketplace_listing', 50, true);
          setListings(data.items || []);
        } catch (error) {
          console.error('Error loading listings:', error);
        } finally {
          setLoading(false);
        }
      };

      loadListings();
    }, []);

    const filteredListings = useMemo(() => {
      let items = filter === 'all' ? listings : listings.filter((listing) => listing.objectData.type === filter);
      if (priceRange.min) {
        items = items.filter((listing) => (listing.objectData.price || 0) >= parseInt(priceRange.min, 10));
      }
      if (priceRange.max) {
        items = items.filter((listing) => (listing.objectData.price || 0) <= parseInt(priceRange.max, 10));
      }
      return items;
    }, [listings, filter, priceRange.min, priceRange.max]);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <Link
              to="/marketplace/create"
              className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 flex items-center space-x-2"
            >
              <div className="icon-plus text-lg" />
              <span>Create Listing</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[var(--primary-color)] text-white' : 'bg-white'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('sale')}
                className={`px-4 py-2 rounded-lg ${filter === 'sale' ? 'bg-[var(--primary-color)] text-white' : 'bg-white'}`}
              >
                For Sale
              </button>
              <button
                type="button"
                onClick={() => setFilter('rent')}
                className={`px-4 py-2 rounded-lg ${filter === 'rent' ? 'bg-[var(--primary-color)] text-white' : 'bg-white'}`}
              >
                For Rent
              </button>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg p-2">
              <input
                type="number"
                placeholder="Min price"
                value={priceRange.min}
                onChange={(event) => setPriceRange((prev) => ({ ...prev, min: event.target.value }))}
                className="w-28 p-2 border rounded"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max price"
                value={priceRange.max}
                onChange={(event) => setPriceRange((prev) => ({ ...prev, max: event.target.value }))}
                className="w-28 p-2 border rounded"
              />
              <span className="text-sm text-gray-600">EGP</span>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="icon-shopping-bag text-5xl text-gray-300 mb-4" />
            <p className="text-gray-500">No listings available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => (
              <div
                key={listing.objectId}
                className="bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer"
                style={{ animation: 'slideUp 0.5s ease-out', animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="icon-car text-6xl text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{listing.objectData.title || 'Vehicle Listing'}</h3>
                  <p className="text-2xl font-bold text-[var(--primary-color)] mb-2">
                    {listing.objectData.price?.toLocaleString()} EGP
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      listing.objectData.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {listing.objectData.type === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('MarketplaceListing error:', error);
    return null;
  }
}
