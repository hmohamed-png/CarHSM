// Database utilities are already provided by Trickle
// These are just type definitions and helpers

async function initializeDatabase() {
  try {
    // Database tables are managed via artifact tool
    console.log('Database ready');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Helper to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Helper to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(amount);
}

// Initialize on load
initializeDatabase();