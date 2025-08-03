// // client\src\app\login\page.tsx
// 'use client';

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/lib/redux/store';
// import { loginStart, loginSuccess, loginFailure } from '@/lib/redux/slices/authSlice';
// import { setUser } from '@/lib/redux/slices/userSlice';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { loading, error } = useSelector((state: RootState) => state.auth);
//   // const username = useSelector((state: RootState) => state.user.user?.username);

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     role: 'user', // Default role
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     dispatch(loginStart());

//     try {
//       // This would be an API call in production
//       const fakeResponse = {
//         accessToken: 'fake-access-token',
//         refreshToken: 'fake-refresh-token',
//         user: {
//           id: '1',
//           username: formData.username,
//           email: formData.email,
//           role: formData.role as 'user' | 'admin' | 'agent',
//         },
//       };

// dispatch(
//   loginSuccess({
//     user: {
//       id: '1',
//       username: formData.username,
//       email: formData.email,
//       role: formData.role as 'user' | 'admin' | 'agent',
//     },
//     token: fakeResponse.accessToken, // or fakeResponse.token
//   })
// );
//       dispatch(setUser(fakeResponse.user));

//       router.push('/dashboard'); // Redirect after login
//     } catch (err) {
//       const errorMessage =
//         typeof err === 'object' && err !== null && 'message' in err
//           ? (err as { message?: string }).message || 'Invalid credentials'
//           : 'Invalid credentials';
//       dispatch(loginFailure(errorMessage));
//     }
//   }; 

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login to HelpMe</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg"
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg"
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg"
//             required
//           />

//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg"
//           >
//             <option value="user">User</option>
//             <option value="agent">Agent</option>
//             <option value="admin">Admin</option>
//           </select>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>

//           {error && <p className="text-red-500 text-center">{error}</p>}
//         </form>

//         <div className="my-4 text-center">or</div>

//         {/* Google Login button will be inserted here later */}
//       </div>
//     </div>
//   );
// }




'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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
      // API request to backend login endpoint
      const res = await API.post('/auth/login', formData);

      const { user } = res.data;

      // Store in Redux
      dispatch(
        loginSuccess({
          user: user,
          token: '', // Token comes in cookies (httpOnly), not in response body
        })
      );
      dispatch(setUser(user));

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
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
