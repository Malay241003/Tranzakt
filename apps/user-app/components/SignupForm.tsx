"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupAndSignIn } from '../app/lib/actions/auth';
import { signIn } from 'next-auth/react';

export const SignupForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !phone || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        setError('Phone number must be 10 digits and contain only numbers.');
        setLoading(false);
        return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
    }

    try {
      const signupResponse = await signupAndSignIn(name, phone, password);

      if (!signupResponse.success) {
        setError(signupResponse.error || 'Signup failed. Please try again.');
        return;
      }

      const signInResult = await signIn('credentials', {
        phone,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (signInResult?.error) {
        console.error("Error during auto sign-in after signup:", signInResult.error);
        setError("Account created, but automatic sign-in failed. Please try logging in manually.");
      } else if (signInResult?.ok) {
        router.push(signInResult.url || '/dashboard');
      }

    } catch (err) {
      console.error('Unexpected error during signup form submission:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#ebe6e6] flex">
      <div className="hidden lg:flex lg:flex-1 items-center justify-center px-16">
        <div className="max-w-lg">
          <div className="flex items-center mb-6">
            <WalletIcon />
            <h1
              className="text-7xl font-bold ml-4"
              style={{ color: '#6a51a6' }}
            >
              TranZakt
            </h1>
          </div>
          <p className="text-[28px] text-gray-600">
            TranZakt wallet lets you make Fast, Secure, and Simple Digital Payments
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 lg:px-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-800 hover:bg-purple-900 text-white text-lg font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20 text-purple-800">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
    </svg>
  );
}
