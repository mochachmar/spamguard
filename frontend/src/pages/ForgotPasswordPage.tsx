import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/check-email');
    };

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white">
      <div className="w-full max-w-md p-8 space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-gray-600">Enter your email address below to receive a password reset link.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
           <div>
            <label htmlFor="email-address" className="sr-only">Email Address</label>
            <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none relative block w-full px-3 py-3 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email Address" />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Submit
            </button>
          </div>
        </form>
         <div className="text-sm">
            <Link to="/login" className="font-medium text-slate-600 hover:text-slate-500">
                Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;