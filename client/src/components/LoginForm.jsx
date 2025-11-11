import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const OTP_LENGTH = 6;

const createEmptyOtp = () => Array(OTP_LENGTH).fill('');

export default function LoginForm() {
  try {
    const { sendOtp, verifyOtp, loginWithPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const initialState = useMemo(
      () => ({
        phone: location.state?.phone || '',
        step: location.state?.step || (location.state?.phone ? 'otp' : 'phone'),
        otpPreview: location.state?.otpPreview || ''
      }),
      [location.state]
    );

    const [step, setStep] = useState(initialState.step);
    const [phone, setPhone] = useState(initialState.phone);
    const [otp, setOtp] = useState(
      initialState.otpPreview ? initialState.otpPreview.split('').slice(0, OTP_LENGTH) : createEmptyOtp()
    );
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState(initialState.otpPreview ? `Dev OTP: ${initialState.otpPreview}` : '');

    const from = location.state?.from || '/dashboard';

    useEffect(() => {
      if (initialState.phone) {
        setPhone(initialState.phone);
      }
      if (initialState.step) {
        setStep(initialState.step);
      }
      if (initialState.otpPreview) {
        setOtp(initialState.otpPreview.split('').slice(0, OTP_LENGTH));
        setInfo(`Dev OTP: ${initialState.otpPreview}`);
      }
    }, [initialState.phone, initialState.step, initialState.otpPreview]);

    const normalizedPhone = (value) => value.replace(/\D/g, '');

    const handlePhoneSubmit = async (event) => {
      event.preventDefault();
      const cleaned = normalizedPhone(phone);
      if (!cleaned) {
        setError('Please enter a valid phone number.');
        return;
      }
      setIsSubmitting(true);
      setError('');
      try {
        const response = await sendOtp({ phone: cleaned });
        setPhone(cleaned);
        setStep('otp');
        setOtp(createEmptyOtp());
        setInfo(
          response?.otpPreview
            ? `Dev OTP: ${response.otpPreview}`
            : 'Enter the 6-digit code we just sent to your phone.'
        );
      } catch (err) {
        setError(err.message || 'Unable to send OTP. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleOtpChange = (index, value) => {
      if (value.length <= 1 && /^\d*$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
          const nextInput = document.getElementById(`otp-${index + 1}`);
          nextInput?.focus();
        }
      }
    };

    const handleVerifyOtp = async () => {
      const otpCode = otp.join('');
      if (otpCode.length !== OTP_LENGTH) {
        setError('Please enter the full 6-digit code.');
        return;
      }
      setIsSubmitting(true);
      setError('');
      try {
        await verifyOtp({ phone, code: otpCode });
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.message || 'Invalid OTP. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handlePasswordLogin = async (event) => {
      event.preventDefault();
      const cleaned = normalizedPhone(phone);
      if (!cleaned || !password) {
        setError('Please provide both phone number and password.');
        return;
      }
      setIsSubmitting(true);
      setError('');
      try {
        await loginWithPassword({ phone: cleaned, password });
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.message || 'Unable to login with password.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleResendOtp = async () => {
      if (!phone) return;
      setIsSubmitting(true);
      setError('');
      try {
        const response = await sendOtp({ phone });
        setOtp(createEmptyOtp());
        setInfo(
          response?.otpPreview
            ? `Dev OTP: ${response.otpPreview}`
            : 'Enter the new 6-digit code we just sent to your phone.'
        );
      } catch (err) {
        setError(err.message || 'Unable to resend OTP. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-car text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to UCarX</h1>
            <p className="text-gray-600">Your complete car management solution</p>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">{error}</div>}
          {info && <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 mb-4 rounded">{info}</div>}

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-700">
                    +20
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="1234567890"
                    className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or sign in with password</span>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                />
                <button
                  type="button"
                  onClick={handlePasswordLogin}
                  disabled={isSubmitting}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing in...' : 'Login with Password'}
                </button>
              </div>
              <p className="text-center text-sm text-gray-600">
                New user?{' '}
                <a href="/register" className="text-[var(--primary-color)] font-semibold">
                  Sign up
                </a>
              </p>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Enter OTP</h2>
                <p className="text-gray-600 text-sm mb-4">We sent a 6-digit code to +20 {phone}</p>
                <div className="flex justify-between space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[var(--primary-color)] outline-none"
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verifying...' : 'Verify'}
              </button>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-[var(--primary-color)] font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
                <button type="button" onClick={() => setStep('phone')} className="text-gray-600 hover:underline">
                  Change number
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('LoginForm error:', error);
    return null;
  }
}
