'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/lib/redux/store';
import { loginStart, loginSuccess, loginFailure } from '@/lib/redux/slices/authSlice';
import { setUser } from '@/lib/redux/slices/userSlice';
import API from '@/lib/api';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await API.post('/auth/login', formData);
      const { token, user } = res.data;

      dispatch(loginSuccess({ user, token }));
      dispatch(setUser(user));

      router.push('/dashboard');
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="identifier"
            placeholder="Username or Email"
            value={formData.identifier}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

