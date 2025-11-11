import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterForm() {
  try {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      password: '',
      terms: false
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const normalizePhone = (value) => value.replace(/\D/g, '');

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!formData.terms) {
        setError('Please agree to the terms to continue.');
        return;
      }

      const cleanedPhone = normalizePhone(formData.phone);
      if (!cleanedPhone) {
        setError('Please provide a valid phone number.');
        return;
      }

      setIsSubmitting(true);
      setError('');
      try {
        const result = await register({
          name: formData.name,
          phone: cleanedPhone,
          email: formData.email,
          password: formData.password || undefined
        });

        navigate('/login', {
          replace: true,
          state: {
            phone: cleanedPhone,
            step: 'otp',
            otpPreview: result?.otpPreview
          }
        });
      } catch (err) {
        setError(err.message || 'Unable to complete registration. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-user-plus text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-600">Join UCarX today</p>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-700">
                  +20
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="1234567890"
                  className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password (Optional)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                placeholder="Set a password for fallback login"
              />
            </div>
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.terms}
                onChange={(event) => setFormData((prev) => ({ ...prev, terms: event.target.checked }))}
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-[var(--primary-color)]">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-[var(--primary-color)]">
                  Privacy Policy
                </a>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[var(--primary-color)] font-semibold">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RegisterForm error:', error);
    return null;
  }
}
