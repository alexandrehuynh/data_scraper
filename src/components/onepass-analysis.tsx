import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const OnePassAnalysis = () => {
  // Rating Distribution Data
  const ratingDistribution = [
    { name: '5 Stars', value: 203, percentage: '35.1%', color: '#4CAF50' },
    { name: '4 Stars', value: 145, percentage: '25.0%', color: '#8BC34A' },
    { name: '3 Stars', value: 115, percentage: '19.9%', color: '#FFC107' },
    { name: '2 Stars', value: 87, percentage: '15.0%', color: '#FF9800' },
    { name: '1 Star', value: 29, percentage: '5.0%', color: '#F44336' },
  ];
  
  // Common Topics Data
  const commonTopics = [
    { name: 'Gym Network', value: 120, sentiment: 'mixed', color: '#FFC107' },
    { name: 'Customer Service', value: 95, sentiment: 'negative', color: '#F44336' },
    { name: 'Billing Issues', value: 85, sentiment: 'negative', color: '#F44336' },
    { name: 'App Functionality', value: 70, sentiment: 'positive', color: '#4CAF50' },
    { name: 'Workout Content', value: 65, sentiment: 'positive', color: '#4CAF50' },
    { name: 'Value for Money', value: 60, sentiment: 'mixed', color: '#FFC107' },
    { name: 'Grocery Delivery', value: 45, sentiment: 'positive', color: '#4CAF50' },
    { name: 'Insurance Integration', value: 40, sentiment: 'mixed', color: '#FFC107' },
    { name: 'Technical Issues', value: 35, sentiment: 'negative', color: '#F44336' },
    { name: 'Social Features', value: 25, sentiment: 'positive', color: '#4CAF50' },
  ];
  
  // Top Words Data
  const topWords = [
    { name: 'gym', value: 210 },
    { name: 'cancel', value: 180 },
    { name: 'refund', value: 165 },
    { name: 'membership', value: 150 },
    { name: 'workouts', value: 140 },
    { name: 'app', value: 125 },
    { name: 'Kaiser', value: 115 },
    { name: 'fitness', value: 100 },
    { name: 'money', value: 95 },
    { name: 'classes', value: 90 },
  ];
  
  // Rating Trend Data
  const ratingTrend = [
    { month: 'Jan 2025', rating: 3.9, reviews: 45 },
    { month: 'Feb 2025', rating: 3.8, reviews: 52 },
    { month: 'Mar 2025', rating: 3.6, reviews: 61 },
    { month: 'Apr 2025', rating: 3.5, reviews: 58 },
    { month: 'May 2025', rating: 3.7, reviews: 40 },
  ];
  
  // Key Issues
  const keyIssues = [
    "Gyms being removed from network without notice",
    "Difficulty cancelling subscription",
    "Problems getting refunds",
    "Charging after cancellation requests",
    "Misleading gym availability information",
    "Poor customer service responsiveness",
    "Insurance integration confusion"
  ];
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">OnePass App Reviews Analysis</h1>
      <p className="text-center mb-6">Based on 579 reviews with an average rating of 3.7/5</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Rating Distribution Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Number of Reviews" fill="#8884d8">
                {ratingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Most common: 5-star ratings (35.1%), followed by 4-star (25.0%)
          </div>
        </div>
        
        {/* Common Topics Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Common Topics in Reviews</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commonTopics} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value} mentions`, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Mentions" radius={[0, 4, 4, 0]}>
                {commonTopics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Most discussed: Gym network issues (20.7%) and customer service problems (16.4%)
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Word Frequency */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Top Words in Reviews</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topWords}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} occurrences`, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Occurrences" fill="#3f51b5" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Most frequent words relate to gyms, cancellations, and refunds
          </div>
        </div>
        
        {/* Rating Trend */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Rating Trend (Last 5 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[3, 5]} />
              <Tooltip formatter={(value) => [`${value}`, 'Average Rating']} />
              <Legend />
              <Line type="monotone" dataKey="rating" name="Average Rating" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Slight downward trend in March-April, with recent improvement in May
          </div>
        </div>
      </div>
      
      {/* Key Issues Section */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Issues Identified</h2>
        <ul className="list-disc pl-5 space-y-2">
          {keyIssues.map((issue, index) => (
            <li key={index} className="text-gray-800">{issue}</li>
          ))}
        </ul>
      </div>
      
      {/* Summary and Recommendations */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Summary and Recommendations</h2>
        <div className="space-y-4">
          <p><strong>Strengths:</strong> App functionality, workout content variety, grocery delivery feature</p>
          <p><strong>Areas for Improvement:</strong> Gym network management, customer service, billing processes</p>
          <p><strong>Priority Actions:</strong></p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Improve communication about gym network changes</li>
            <li>Streamline cancellation and refund processes</li>
            <li>Enhance customer service response times</li>
            <li>Ensure accuracy of gym availability information</li>
            <li>Address billing issues after cancellation requests</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default OnePassAnalysis;