import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Activity, 
  GitBranch, 
  Server, 
  Monitor, 
  Settings, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle,
  Clock,
  Users,
  Database,
  Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Types
interface Pipeline {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  lastRun: string;
  duration: string;
  branch: string;
}

interface Deployment {
  id: string;
  environment: string;
  version: string;
  status: 'deployed' | 'deploying' | 'failed';
  timestamp: string;
}

// Mock data
const mockPipelines: Pipeline[] = [
  { id: '1', name: 'Frontend Build', status: 'success', lastRun: '2 min ago', duration: '3m 45s', branch: 'main' },
  { id: '2', name: 'Backend API', status: 'running', lastRun: '1 min ago', duration: '5m 12s', branch: 'develop' },
  { id: '3', name: 'Database Migration', status: 'success', lastRun: '5 min ago', duration: '2m 30s', branch: 'main' },
  { id: '4', name: 'Security Scan', status: 'failed', lastRun: '10 min ago', duration: '1m 15s', branch: 'feature/auth' },
];

const mockDeployments: Deployment[] = [
  { id: '1', environment: 'Production', version: 'v2.1.0', status: 'deployed', timestamp: '2024-01-15 14:30' },
  { id: '2', environment: 'Staging', version: 'v2.2.0-beta', status: 'deploying', timestamp: '2024-01-15 15:45' },
  { id: '3', environment: 'Development', version: 'v2.3.0-alpha', status: 'deployed', timestamp: '2024-01-15 16:00' },
];

const performanceData = [
  { name: 'Jan', builds: 45, deployments: 12, success: 92 },
  { name: 'Feb', builds: 52, deployments: 15, success: 95 },
  { name: 'Mar', builds: 48, deployments: 18, success: 88 },
  { name: 'Apr', builds: 61, deployments: 22, success: 94 },
  { name: 'May', builds: 55, deployments: 20, success: 96 },
  { name: 'Jun', builds: 67, deployments: 25, success: 93 },
];

// Components
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': case 'deployed': return 'bg-green-100 text-green-800';
      case 'running': case 'deploying': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': case 'deployed': return <CheckCircle className="w-4 h-4" />;
      case 'running': case 'deploying': return <Clock className="w-4 h-4 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Pipelines', value: '12', icon: <GitBranch className="w-6 h-6" />, color: 'bg-blue-500' },
          { title: 'Successful Builds', value: '94%', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-green-500' },
          { title: 'Deployments Today', value: '8', icon: <Cloud className="w-6 h-6" />, color: 'bg-purple-500' },
          { title: 'Active Environments', value: '5', icon: <Server className="w-6 h-6" />, color: 'bg-orange-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Build Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="builds" fill="#3b82f6" />
              <Bar dataKey="deployments" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Pipelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Pipelines</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockPipelines.map((pipeline) => (
              <div key={pipeline.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <GitBranch className="w-5 h-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium">{pipeline.name}</h4>
                    <p className="text-sm text-gray-500">Branch: {pipeline.branch}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{pipeline.lastRun}</p>
                    <p className="text-sm text-gray-500">{pipeline.duration}</p>
                  </div>
                  <StatusBadge status={pipeline.status} />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    {pipeline.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Pipelines: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CI/CD Pipelines</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Pipeline
        </button>
      </div>

      <div className="grid gap-6">
        {mockPipelines.map((pipeline) => (
          <motion.div
            key={pipeline.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <GitBranch className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">{pipeline.name}</h3>
                <StatusBadge status={pipeline.status} />
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Play className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Branch:</span>
                <span className="ml-2 font-medium">{pipeline.branch}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Run:</span>
                <span className="ml-2 font-medium">{pipeline.lastRun}</span>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <span className="ml-2 font-medium">{pipeline.duration}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${
                  pipeline.status === 'success' ? 'bg-green-500' :
                  pipeline.status === 'running' ? 'bg-blue-500' :
                  pipeline.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                } w-3/4`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Deployments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Deployments</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          New Deployment
        </button>
      </div>

      <div className="grid gap-6">
        {mockDeployments.map((deployment) => (
          <motion.div
            key={deployment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Cloud className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold">{deployment.environment}</h3>
                  <p className="text-sm text-gray-500">Version: {deployment.version}</p>
                  <p className="text-sm text-gray-500">{deployment.timestamp}</p>
                </div>
              </div>
              <StatusBadge status={deployment.status} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Monitor className="w-5 h-5" /> },
    { id: 'pipelines', label: 'Pipelines', icon: <GitBranch className="w-5 h-5" /> },
    { id: 'deployments', label: 'Deployments', icon: <Cloud className="w-5 h-5" /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold">DevOps Platform</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
              activeTab === item.id ? 'bg-gray-800 border-r-2 border-blue-500' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'pipelines': return <Pipelines />;
      case 'deployments': return <Deployments />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;