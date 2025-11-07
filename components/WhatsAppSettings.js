function WhatsAppSettings() {
  try {
    const [templates, setTemplates] = React.useState([
      { id: 1, name: 'Maintenance Reminder', active: true, message: 'Hi! Your {vehicle} is due for {service} on {date}. Book your appointment now!' },
      { id: 2, name: 'Service Completed', active: true, message: 'Great news! Your {vehicle} service is complete. Total: {cost} EGP. Thanks for choosing us!' },
      { id: 3, name: 'Payment Reminder', active: false, message: 'Reminder: {service} payment of {cost} EGP is pending. Please complete payment.' },
      { id: 4, name: 'Marketplace Inquiry', active: true, message: 'Thanks for your interest in {vehicle}! Price: {price} EGP. Available for viewing.' }
    ]);

    const toggleTemplate = (id) => {
      setTemplates(templates.map(t => t.id === id ? {...t, active: !t.active} : t));
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">WhatsApp Integration</h1>
        <p className="text-gray-600 mb-8">Manage automated WhatsApp notification templates</p>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded">
          <div className="flex items-start space-x-3">
            <div className="icon-check-circle text-xl text-green-600 mt-1"></div>
            <div>
              <p className="font-semibold text-green-900">WhatsApp Connected</p>
              <p className="text-sm text-green-800">Your number +20 1234567890 is verified</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{template.message}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input type="checkbox" checked={template.active} onChange={() => toggleTemplate(template.id)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-xl">
          <h3 className="font-bold mb-2">Available Variables</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <p><span className="font-mono bg-white px-2 py-1 rounded">{'{vehicle}'}</span> - Vehicle name</p>
            <p><span className="font-mono bg-white px-2 py-1 rounded">{'{service}'}</span> - Service type</p>
            <p><span className="font-mono bg-white px-2 py-1 rounded">{'{date}'}</span> - Date</p>
            <p><span className="font-mono bg-white px-2 py-1 rounded">{'{cost}'}</span> - Cost amount</p>
            <p><span className="font-mono bg-white px-2 py-1 rounded">{'{price}'}</span> - Price amount</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('WhatsAppSettings error:', error);
    return null;
  }
}
