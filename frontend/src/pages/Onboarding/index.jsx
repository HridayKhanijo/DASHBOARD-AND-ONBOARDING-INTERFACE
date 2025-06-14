import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProgressBar from '../../components/onboarding/ProgressBar';
import PersonalInfo from '../../components/onboarding/steps/PersonalInfo';
import BusinessInfo from '../../components/onboarding/steps/BusinessInfo';
import Preferences from '../../components/onboarding/steps/Preferences';
import { toast } from 'react-hot-toast';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    
    // Step 2: Business Info
    companyName: '',
    industry: '',
    companySize: '',
    
    // Step 3: Preferences
    theme: 'light',
    layout: 'default',
  });
  
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  
  const steps = [
    { id: 1, name: 'Personal Info' },
    { id: 2, name: 'Business Info' },
    { id: 3, name: 'Preferences' },
  ];
  
  const nextStep = () => {
    // Validate current step before proceeding
    if (validateStep(step)) {
      if (step < steps.length) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        return true;
      case 2:
        if (!formData.companyName.trim() || !formData.industry || !formData.companySize) {
          toast.error('Please fill in all business information');
          return false;
        }
        return true;
      default:
        return true;
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      // In a real app, you would send this to your backend
      // await api.post('/api/onboarding', formData);
      
      // Update user context with onboarding data
      updateUser({
        ...formData,
        onboarded: true
      });
      
      // Save to localStorage for demo purposes
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      
      // Redirect to dashboard
      navigate('/dashboard');
      toast.success('Onboarding completed successfully!');
    } catch (error) {
      console.error('Onboarding failed:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfo formData={formData} handleChange={handleChange} />;
      case 2:
        return <BusinessInfo formData={formData} handleChange={handleChange} />;
      case 3:
        return <Preferences formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Welcome to Hriday Dashboard
        </h1>
        
        <ProgressBar steps={steps} currentStep={step} />
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8 flex-1">
          {renderStep()}
          
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-2 rounded-md ${
                step === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back
            </button>
            
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {step === steps.length ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
