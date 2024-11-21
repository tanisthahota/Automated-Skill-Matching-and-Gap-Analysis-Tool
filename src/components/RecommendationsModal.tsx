import React from 'react';

export function RecommendationsModal({ isOpen, onClose, recommendations }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Skill Recommendations</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          {recommendations.length === 0 ? (
            <p className="text-gray-500">Your skills match all available job requirements!</p>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">We recommend improving these skills:</p>
              <ul className="list-disc list-inside space-y-2">
                {recommendations.map((skill, index) => (
                  <li key={index} className="text-gray-600">{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }