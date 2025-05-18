'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    captcha: ''
  });
  const [error, setError] = useState('');
  const [captchaText, setCaptchaText] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    setCaptchaText(generateCaptcha());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, dob, captcha } = formData;
    
    if (!name || !dob || !captcha) {
      setError('Please fill all fields');
      return;
    }

    if (captcha !== captchaText) {
      setError('Invalid CAPTCHA');
      setCaptchaText(generateCaptcha());
      setFormData(prev => ({ ...prev, captcha: '' }));
      return;
    }

    router.push(`/result?name=${encodeURIComponent(name)}&dob=${encodeURIComponent(dob)}`);
  };

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-[#f5e1e8] to-[#e0c5d1] py-0">
      {/* Header */}
      <div className="bg-[#c4528b] text-white text-center py-6  w-full mx-auto shadow-lg">
        <div className="text-xl md:text-5xl font-bold">LADIES HOSTEL SECURITY BOARD</div>
        <div className="text-md md:text-xl">Girls Hostel Guard Entrance Examination 2025</div>
        <div className="text-xs md:text-sm mt-2">"Protecting Virtue, Preserving Privacy"</div>
        <div className="text-xs md:text-sm mt-1"><a href="homeground.pixl.site">homeground.pixl.site</a></div>
      </div>
      {/* Main Card */}
      <div className="bg-white border-2 border-[#e0c5d1] max-w-full md:max-w-[70%] mx-auto rounded-b-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#c4528b] mb-4 text-center">Result Portal Login</h1>
        <div className="bg-[#f5e1e8] p-4 rounded-lg mb-6 text-sm text-[#c4528b]">
          <p className="font-semibold">⚠️ Important Notice:</p>
          <p>This portal is exclusively for checking results of the Girls Hostel Guard Entrance Examination. Unauthorized access attempts will be reported to the authorities.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-semibold text-gray-800 mb-2 text-base">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[#e0c5d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e0c5d1] focus:border-[#e0c5d1] transition-all text-gray-800"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="dob" className="block font-semibold text-gray-800 mb-2 text-base">Date of Birth</label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[#e0c5d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e0c5d1] focus:border-[#e0c5d1] transition-all text-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="captcha" className="block font-semibold text-gray-800 mb-2 text-base">
              Security Verification:
              <span className="font-mono bg-[#f5e1e8] px-4 py-2 rounded-lg ml-2 border-2 border-[#e0c5d1] text-[#c4528b]">{captchaText}</span>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="ml-2 text-[#c4528b] hover:text-[#a84677] text-lg"
              >
                ↻
              </button>
            </label>
            <input
              id="captcha"
              name="captcha"
              type="text"
              value={formData.captcha}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[#e0c5d1] rounded-lg focus:outline-none focus:ring-2 mt-5 focus:ring-[#e0c5d1] focus:border-[#e0c5d1] transition-all text-gray-800"
              placeholder="Enter the security code above"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#c4528b] hover:bg-[#a84677] text-white font-bold py-4 rounded-lg transition-all text-lg shadow-lg hover:shadow-xl"
          >
            Check Result
          </button>
        </form>
      </div>
      {/* Footer */}
      <div className="text-center text-sm text-gray-600 mt-6 pb-5">
        <p className="font-semibold">Ladies Hostel Security Board</p>
        <p className="text-xs mt-1">&copy; 2025 All Rights Reserved</p>
      </div>
    </div>
  );
}
