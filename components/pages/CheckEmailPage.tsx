
import React from 'react';

const CheckEmailPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white text-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Check your email</h2>
        <p className="mt-2 text-lg text-gray-600">We've sent a confirmation link to your email address. Please follow the instructions in the email to reset your password.</p>
        <div className="pt-4">
            <button
                type="button"
                className="group relative flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 mx-auto"
            >
                Resend Email
            </button>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;
