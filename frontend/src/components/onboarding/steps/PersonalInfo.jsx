import React from 'react';

const PersonalInfo = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Let's start with your basic information
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="firstName"
              id="firstName"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div className="sm:col-span-3">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="lastName"
              id="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div className="sm:col-span-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            We'll send important updates to this email
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
