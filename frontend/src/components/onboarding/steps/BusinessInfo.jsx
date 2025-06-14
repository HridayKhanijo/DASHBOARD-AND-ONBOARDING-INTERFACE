import React from 'react';

const companySizes = [
  { id: '1-10', name: '1-10 employees' },
  { id: '11-50', name: '11-50 employees' },
  { id: '51-200', name: '51-200 employees' },
  { id: '201-500', name: '201-500 employees' },
  { id: '501-1000', name: '501-1000 employees' },
  { id: '1000+', name: '1000+ employees' },
];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Other'
];

const BusinessInfo = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your company
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name *
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="companyName"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry *
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            required
          >
            <option value="">Select an industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Size *</label>
          <fieldset className="mt-2">
            <legend className="sr-only">Company Size</legend>
            <div className="space-y-2">
              {companySizes.map((size) => (
                <div key={size.id} className="flex items-center">
                  <input
                    id={size.id}
                    name="companySize"
                    type="radio"
                    checked={formData.companySize === size.id}
                    onChange={() =>
                      handleChange({
                        target: { name: 'companySize', value: size.id },
                      })
                    }
                    className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor={size.id}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {size.name}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
