function LoginForm() {
  try {
    const [step, setStep] = React.useState('phone');
    const [phone, setPhone] = React.useState('');
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);

    const handlePhoneSubmit = (e) => {
      e.preventDefault();
      if (phone.length >= 10) {
        setStep('otp');
      }
    };

    const handleOtpChange = (index, value) => {
      if (value.length <= 1 && /^\d*$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
          document.getElementById(`otp-${index + 1}`).focus();
        }
      }
    };

    const handleVerifyOtp = () => {
      const otpCode = otp.join('');
      if (otpCode.length === 6) {
        window.location.href = 'dashboard.html';
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-car text-3xl text-white"></div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to UCarX</h1>
            <p className="text-gray-600">Your complete car management solution</p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-700">+20</span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="1234567890" className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none" required />
                </div>
              </div>
              <button type="submit" className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all">Send OTP</button>
              <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div></div>
              <button type="button" className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"><div className="icon-chrome text-xl"></div><span>Google</span></button>
              <p className="text-center text-sm text-gray-600">New user? <a href="register.html" className="text-[var(--primary-color)] font-semibold">Sign up</a></p>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Enter OTP</h2>
                <p className="text-gray-600 text-sm mb-4">We sent a 6-digit code to +20 {phone}</p>
                <div className="flex justify-between space-x-2">
                  {otp.map((digit, index) => (
                    <input key={index} id={`otp-${index}`} type="text" maxLength="1" value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[var(--primary-color)] outline-none" />
                  ))}
                </div>
              </div>
              <button onClick={handleVerifyOtp} className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90">Verify</button>
              <button onClick={() => setStep('phone')} className="w-full text-gray-600 py-2">Change number</button>
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