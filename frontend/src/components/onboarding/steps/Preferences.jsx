import React from 'react';

const themes = [
  { id: 'light', name: 'Light', description: 'Bright and clean interface' },
  { id: 'dark', name: 'Dark', description: 'Easier on the eyes in low light' },
  { id: 'system', name: 'System', description: 'Follows your device settings' },
];

const layouts = [
  { id: 'default', name: 'Default', description: 'Balanced layout with equal emphasis' },
  { id: 'analytics', name: 'Analytics', description: 'Focus on data and metrics' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and distraction-free' },
];

const Preferences = ({ formData, handleChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize your dashboard experience
        </p>
      </div>


      <div>
        <h3 className="text-lg font-medium text-gray-900">Theme</h3>
        <p className="text-sm text-gray-500">
          Choose how your dashboard looks
        </p>
        <fieldset className="mt-4">
          <legend className="sr-only">Theme selection</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`relative block cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  formData.theme === theme.id
                    ? 'ring-2 ring-primary-500 border-transparent'
                    : 'border-gray-300'
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: 'theme', value: theme.id },
                  })
                }
              >
                <div className="flex">
                  <div className="flex items-center">
                    <input
                      id={`theme-${theme.id}`}
                      name="theme"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={formData.theme === theme.id}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="ml-3">
                    <label
                      htmlFor={`theme-${theme.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {theme.name}
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      {theme.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Dashboard Layout</h3>
        <p className="text-sm text-gray-500">
          Choose how your dashboard is organized
        </p>
        <fieldset className="mt-4">
          <legend className="sr-only">Layout selection</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                className={`relative block cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  formData.layout === layout.id
                    ? 'ring-2 ring-primary-500 border-transparent'
                    : 'border-gray-300'
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: 'layout', value: layout.id },
                  })
                }
              >
                <div className="flex">
                  <div className="flex items-center">
                    <input
                      id={`layout-${layout.id}`}
                      name="layout"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={formData.layout === layout.id}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="ml-3">
                    <label
                      htmlFor={`layout-${layout.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {layout.name}
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      {layout.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default Preferences;
