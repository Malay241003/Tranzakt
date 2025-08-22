"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!phone || !password) {
      setError('Phone number and password are required.');
      setLoading(false);
      return;
    }
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Phone number must be 10 digits and contain only numbers.');
      setLoading(false);
      return;
    }

    try {
      const signInResult = await signIn('credentials', {
        phone,
        password,
        redirect: false, // Prevent NextAuth from doing a full page redirect
        callbackUrl: '/dashboard', // Redirect to dashboard on successful login
      });

      if (signInResult?.error) {
        // Handle specific errors from NextAuth, e.g., 'CredentialsSignin'
        if (signInResult.error === 'CredentialsSignin') {
            setError('Invalid phone number or password.');
        } else {
            setError(signInResult.error || 'Login failed. Please try again.');
        }
        console.error("Error during sign-in:", signInResult.error);
      } else if (signInResult?.ok) {
        // If login was successful, redirect to dashboard
        router.push(signInResult.url || '/dashboard');
      }
    } catch (err) {
      console.error('Unexpected error during login form submission:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ebe6e6] flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-start pl-16 pr-8">
        <div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Welcome Back!
          </h1>
          <p className="text-4xl text-gray-600 ">
            Log in to manage your digital payments and transfers securely.
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 lg:px-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Sign In to Your Account
            </h2>
            
            <div className="space-y-4">
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
                onClick={handleSubmit}
                className="w-full bg-purple-800 hover:bg-purple-900 text-white text-lg font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Sign In'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
