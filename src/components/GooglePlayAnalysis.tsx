import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

const GooglePlayAnalysis: React.FC = () => {
  // Rating Distribution Data
  const ratingDistribution = [
    { name: '5 Stars', value: 20, percentage: '7.0%', color: '#4CAF50' },
    { name: '4 Stars', value: 11, percentage: '3.8%', color: '#8BC34A' },
    { name: '3 Stars', value: 5, percentage: '1.7%', color: '#FFC107' },
    { name: '2 Stars', value: 16, percentage: '5.6%', color: '#FF9800' },
    { name: '1 Star', value: 235, percentage: '81.9%', color: '#F44336' }
  ];
  
  // Common Topics Data
  const commonTopics = [
    { name: 'App Crashes', value: 158, sentiment: 'negative', color: '#F44336' },
    { name: 'Login Problems', value: 52, sentiment: 'negative', color: '#F44336' },
    { name: 'App Performance', value: 41, sentiment: 'negative', color: '#F44336' },
    { name: 'Gym Locator', value: 30, sentiment: 'negative', color: '#F44336' },
    { name: 'Workout Content', value: 24, sentiment: 'mixed', color: '#FFC107' },
    { name: 'User Interface', value: 18, sentiment: 'negative', color: '#F44336' },
    { name: 'Android Issues', value: 17, sentiment: 'negative', color: '#F44336' },
    { name: 'Customer Service', value: 11, sentiment: 'negative', color: '#F44336' },
    { name: 'Billing Issues', value: 7, sentiment: 'negative', color: '#F44336' },
    { name: 'Insurance Integration', value: 5, sentiment: 'mixed', color: '#FFC107' }
  ];
  
  // Top Words Data
  const topWords = [
    { name: 'app', value: 212 },
    { name: 'open', value: 67 },
    { name: 'crashes', value: 62 },
    { name: 'work', value: 47 },
    { name: 'wont', value: 47 },
    { name: 'even', value: 38 },
    { name: 'doesnt', value: 34 },
    { name: 'keeps', value: 33 },
    { name: 'just', value: 32 },
    { name: 'bug', value: 32 }
  ];
  
  // Key Issues Data
  const keyIssues = [
    { name: 'App crashes', value: 94, percentage: '37.5%' },
    { name: 'Login problems', value: 47, percentage: '18.7%' },
    { name: 'Bug reported', value: 34, percentage: '13.5%' },
    { name: 'Android compatibility', value: 24, percentage: '9.6%' },
    { name: 'App won\'t open', value: 21, percentage: '8.4%' },
    { name: 'Cache/data issues', value: 9, percentage: '3.6%' },
    { name: 'App freezes/hangs', value: 8, percentage: '3.2%' },
    { name: 'Gym locator', value: 7, percentage: '2.8%' },
    { name: 'Billing issues', value: 6, percentage: '2.4%' }
  ];
  
  // Rating Trend Data
  const ratingTrend = [
    { month: 'Jan 2025', rating: 1.35, reviews: 144 },
    { month: 'Feb 2025', rating: 2.13, reviews: 15 },
    { month: 'Mar 2025', rating: 2.27, reviews: 15 },
    { month: 'Apr 2025', rating: 2.06, reviews: 18 },
    { month: 'May 2025', rating: 2.00, reviews: 3 }
  ];
  
  // Platform Comparison Data
  const platformComparison = [
    { name: 'Google Play (Android)', rating: 1.48, reviews: 287, color: '#3DDC84' },
    { name: 'App Store (iOS)', rating: 3.79, reviews: 579, color: '#0071E3' }
  ];
  
  // Version issues data
  const versionIssues = [
    { name: '14.19.0', value: 124 },
    { name: '14.16.0', value: 42 },
    { name: '14.23.0', value: 9 },
    { name: '14.26.2', value: 6 },
    { name: '14.24.0', value: 6 }
  ];

  // Type-safe formatter functions
  const reviewFormatter = (value: ValueType, name?: NameType) => [`${value} reviews`, 'Count'];
  const mentionsFormatter = (value: ValueType) => [`${value} mentions`, 'Count'];
  const occurrencesFormatter = (value: ValueType) => [`${value} occurrences`, 'Count'];
  const ratingFormatter = (value: ValueType) => [`${value}`, 'Average Rating'];
  const platformFormatter = (value: ValueType, name?: NameType) => [
    name === 'rating' ? `${value}/5` : value, 
    name === 'rating' ? 'Rating' : 'Reviews'
  ];
  const negativeReviewsFormatter = (value: ValueType) => [`${value} negative reviews`, 'Count'];
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">OnePass App - Google Play Store Reviews Analysis</h1>
      <p className="text-center mb-6">Based on 287 reviews with an average rating of 1.48/5</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Rating Distribution Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={reviewFormatter} />
              <Legend />
              <Bar dataKey="value" name="Number of Reviews" fill="#8884d8">
                {ratingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Most common: 1-star ratings (81.9%), indicating severe user dissatisfaction
          </div>
        </div>
        
        {/* Common Topics Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Common Topics in Reviews</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commonTopics.slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={mentionsFormatter} />
              <Legend />
              <Bar dataKey="value" name="Mentions" radius={[0, 4, 4, 0]}>
                {commonTopics.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Most discussed: App crashes (55.1%) and login problems (18.1%)
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
              <Tooltip formatter={occurrencesFormatter} />
              <Legend />
              <Bar dataKey="value" name="Occurrences" fill="#E91E63" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Most frequent words relate to technical problems: app, crashes, won't open
          </div>
        </div>
        
        {/* Rating Trend */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Rating Trend (Last 5 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[1, 5]} />
              <Tooltip formatter={ratingFormatter} />
              <Legend />
              <Line type="monotone" dataKey="rating" name="Average Rating" stroke="#E91E63" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Slight improvement from January to March, but still very low ratings overall
          </div>
        </div>
      </div>
      
      {/* Platform Comparison */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Platform Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={platformComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip formatter={platformFormatter} />
            <Legend />
            <Bar dataKey="rating" name="Average Rating" fill="#673AB7">
              {platformComparison.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-sm text-gray-600">
          Significant difference: 2.31 points lower rating on Android compared to iOS
        </div>
      </div>
      
      {/* Key Issues and Version Issues - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Key Issues Section */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Key Issues Identified</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={keyIssues} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={mentionsFormatter} />
              <Legend />
              <Bar dataKey="value" name="Mentions" fill="#FF5722" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>Percentages based on negative (1-2 star) reviews</p>
          </div>
        </div>
        
        {/* Problematic Versions */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Versions with Most Issues</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={versionIssues}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={negativeReviewsFormatter} />
              <Legend />
              <Bar dataKey="value" name="Negative Reviews" fill="#9C27B0" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>Version 14.19.0 has the highest number of negative reviews, suggesting significant regressions</p>
          </div>
        </div>
      </div>
      
      {/* Developer Response Rate */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Developer Response Analysis</h2>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600">70.4%</div>
            <div className="mt-2 text-gray-600">Response Rate</div>
            <div className="mt-4 text-sm text-gray-700">
              Developer responded to 202 out of 287 reviews, primarily with templated responses about app updates to fix issues
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary and Recommendations */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Summary and Recommendations</h2>
        <div className="space-y-4">
          <p><strong>Critical Issues:</strong> App crashes, login failures, and Android compatibility problems</p>
          <p><strong>Key Findings:</strong> Very low rating with 81.9% of users giving 1-star, suggesting severe app stability issues</p>
          <p><strong>Platform Disparity:</strong> 2.31 point difference between Android (1.48/5) and iOS (3.79/5) indicates Android-specific problems</p>
          <p><strong>Version Analysis:</strong> Version 14.19.0 introduced significant issues that remain unresolved</p>
          <p><strong>Developer Response:</strong> High response rate but mostly template replies, not addressing specific issues</p>
          <p><strong>Recommendations:</strong></p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Prioritize fixing app crashes and login problems on Android</li>
            <li>Address gym locator functionality which is a major pain point</li>
            <li>Implement quality assurance testing specific to Android</li>
            <li>Fix critical bugs in version 14.19.0 or roll back to a stable version</li>
            <li>Improve specificity of developer responses to user issues</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GooglePlayAnalysis; 