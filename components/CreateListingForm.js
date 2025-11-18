function CreateListingForm() {
  try {
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
      type: 'sale', brand: '', model: '', year: '', price: '', mileage: '', 
      color: '', transmission: 'automatic', fuelType: 'petrol', description: '',
      phoneWhatsApp: '', negotiable: true
    });
    const [availableModels, setAvailableModels] = React.useState([]);

    const handleBrandChange = (brand) => {
      setFormData({...formData, brand, model: ''});
      setAvailableModels(getModels(brand));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await window.trickleCreateObject('marketplace_listing', {
          title: `${formData.year} ${formData.brand} ${formData.model}`,
          type: formData.type,
          price: parseFloat(formData.price),
          mileage: parseInt(formData.mileage),
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          color: formData.color,
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          description: formData.description,
          phoneWhatsApp: formData.phoneWhatsApp,
          negotiable: formData.negotiable
        });
        window.location.href = 'marketplace.html';
      } catch (error) {
        console.error('Error creating listing:', error);
      }
    };

    const steps = [
      { num: 1, title: 'Vehicle Info', icon: 'car' },
      { num: 2, title: 'Details', icon: 'info' },
      { num: 3, title: 'Pricing', icon: 'dollar-sign' },
      { num: 4, title: 'Contact', icon: 'phone' }
    ];

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create Listing</h1>
        
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= s.num ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  <div className={`icon-${s.icon} text-xl`}></div>
                </div>
                <p className="text-sm mt-2 font-semibold">{s.title}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${step > s.num ? 'bg-[var(--primary-color)]' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 animate-fadeIn">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Listing Type *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({...formData, type: 'sale'})} className={`p-4 border-2 rounded-lg ${formData.type === 'sale' ? 'border-[var(--primary-color)] bg-red-50' : 'border-gray-300'}`}>
                    For Sale
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'rent'})} className={`p-4 border-2 rounded-lg ${formData.type === 'rent' ? 'border-[var(--primary-color)] bg-red-50' : 'border-gray-300'}`}>
                    For Rent
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Brand *</label>
                <select value={formData.brand} onChange={e => handleBrandChange(e.target.value)} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Brand</option>
                  {getBrands().map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Model *</label>
                <select value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-3 border rounded-lg" required disabled={!formData.brand}>
                  <option value="">Select Model</option>
                  {availableModels.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Year *</label>
                <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Year</option>
                  {getYears().map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Mileage (km) *</label>
                  <input type="number" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Color *</label>
                  <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Transmission *</label>
                  <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="w-full p-3 border rounded-lg">
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Fuel Type *</label>
                  <select value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})} className="w-full p-3 border rounded-lg">
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-lg h-32" placeholder="Describe the vehicle condition, features..."></textarea>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Price (EGP) *</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 border rounded-lg text-2xl font-bold" required />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.type === 'rent' ? 'Daily rental price' : 'Total price'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="negotiable" checked={formData.negotiable} onChange={e => setFormData({...formData, negotiable: e.target.checked})} />
                <label htmlFor="negotiable" className="text-sm">Price is negotiable</label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">WhatsApp Number *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 rounded-l-lg">+20</span>
                  <input type="tel" value={formData.phoneWhatsApp} onChange={e => setFormData({...formData, phoneWhatsApp: e.target.value})} className="flex-1 p-3 border rounded-r-lg" placeholder="1234567890" required />
                </div>
                <p className="text-sm text-gray-500 mt-1">Buyers will contact you via WhatsApp</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="icon-info text-xl text-blue-600 mt-1"></div>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">WhatsApp Auto-Reply</p>
                    <p>When buyers message you, they'll receive an automatic reply with vehicle details and your availability.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                Previous
              </button>
            ) : <div></div>}
            
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90">
                Next
              </button>
            ) : (
              <button type="submit" className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90">
                Publish Listing
              </button>
            )}
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('CreateListingForm error:', error);
    return null;
  }
}