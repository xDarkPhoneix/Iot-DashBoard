import React, { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { supabase } from '../lib/supabaseClient';

export function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // try {
    //   if (isLogin) {
    //     const { error } = await supabase.auth.signInWithPassword({
    //       email: formData.email,
    //       password: formData.password,
    //     });
    //     if (error) throw error;
    //   } else {
    //     const { error } = await supabase.auth.signUp({
    //       email: formData.email,
    //       password: formData.password,
    //       options: {
    //         data: { full_name: formData.fullName },
    //       },
    //     });
    //     if (error) throw error;
    //   }

    //   toast.success(`${isLogin ? 'Logged in' : 'Signed up'} successfully!`);
    //   onAuthSuccess();
    // } catch (error) {
    //   toast.error(error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border-x-7 border-y-8 outline-offset-500 outline-cyan-500 rounded-xl shadow-lg">
    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
    <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
      {!isLogin && (
        <div className="flex items-center border rounded px-3 py-2">
          <User className="w-4 h-4 mr-2" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full outline-none"
          />
        </div>
      )}

      <div className="flex items-center border rounded px-3 py-2">
        <Mail className="w-4 h-4 mr-2" />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full outline-none"
        />
      </div>

      <div className="flex items-center border rounded px-3 py-2">
        <Lock className="w-4 h-4 mr-2" />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:opacity-90 flex justify-center items-center"
        disabled={loading}
      >
        {loading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
        {isLogin ? 'Login' : 'Sign Up'}
      </button>

      <p className="text-center">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </form>
    </div>
  );
}
