import React, { useState } from 'react';
import OnePassAnalysis from '../onepass-analysis';
import GooglePlayAnalysis from '../google-play-analysis';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appstore' | 'googleplay'>('appstore');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">OnePass App Review Analysis</h1>
          <p className="mt-2">Visualization of user reviews from App Store and Google Play</p>
        </div>
      </header>
      
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('appstore')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'appstore'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              App Store Analysis
            </button>
            <button
              onClick={() => setActiveTab('googleplay')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'googleplay'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Google Play Analysis
            </button>
          </div>
        </div>
        
        {activeTab === 'appstore' ? (
          <OnePassAnalysis />
        ) : (
          <GooglePlayAnalysis />
        )}
      </div>
    </div>
  );
};

export default App; 