import React from 'react';

const ProgressBar = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`flex-1 ${index !== steps.length - 1 ? 'relative' : ''}`}
          >
            <div className="flex flex-col items-center">
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step.id < currentStep
                    ? 'bg-primary-600 text-white'
                    : step.id === currentStep
                    ? 'border-2 border-primary-600 bg-white text-primary-600'
                    : 'border-2 border-gray-300 bg-white text-gray-500'
                }`}
              >
                {step.id < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </span>
              <span
                className={`mt-2 text-xs font-medium ${
                  step.id <= currentStep ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                  step.id < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProgressBar;
