'use client';

import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  Camera, 
  FileText, 
  BarChart3, 
  Zap, 
  Settings,
  Download,
  Eye,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  Grid,
  List,
  Search,
  User,
  DollarSign,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { ExtractedProfile } from '@/types';

const TDStudiosDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ocr-generator');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedProfiles, setExtractedProfiles] = useState<ExtractedProfile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data for demonstration
  const sampleProfiles: ExtractedProfile[] = [
    {
      id: '1',
      filename: 'instagram_profile_1.png',
      username: '@rubirose',
      displayName: 'Rubi Rose',
      platform: 'Instagram',
      followers: '2.1M',
      bio: 'Artist • Entrepreneur • OnlyFans Link Below',
      bioLinks: ['https://onlyfans.com/rubirose', 'https://linktr.ee/rubirose'],
      extractedLinks: [
        { url: 'https://onlyfans.com/rubirose', type: 'monetization', title: 'OnlyFans' },
        { url: 'https://linktr.ee/rubirose', type: 'business', title: 'All Links' },
        { url: 'https://instagram.com/rubirose', type: 'social', title: 'Instagram' }
      ],
      generatedPageUrl: 'https://tdstudios.app/rubirose',
      status: 'completed',
      revenue: 15640,
      processedAt: new Date().toISOString()
    },
    {
      id: '2',
      filename: 'tiktok_profile_2.png',
      username: '@bellapoarch',
      displayName: 'Bella Poarch',
      platform: 'TikTok',
      followers: '89.2M',
      bio: 'Singer • Content Creator • Links in bio ⬇️',
      bioLinks: ['https://bellapoarch.com', 'https://fanlink.to/bellapoarch'],
      extractedLinks: [
        { url: 'https://bellapoarch.com', type: 'business', title: 'Official Website' },
        { url: 'https://fanlink.to/bellapoarch', type: 'business', title: 'Music Links' },
        { url: 'https://tiktok.com/@bellapoarch', type: 'social', title: 'TikTok' }
      ],
      generatedPageUrl: 'https://tdstudios.app/bellapoarch',
      status: 'processing',
      revenue: 23890,
      processedAt: new Date().toISOString()
    }
  ];

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const processImages = async () => {
    setProcessing(true);
    try {
      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/ocr/process', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setExtractedProfiles(result.profiles);
      } else {
        console.error('Processing failed:', result.error);
        setExtractedProfiles(sampleProfiles);
      }
    } catch (error) {
      console.error('Error processing images:', error);
      setExtractedProfiles(sampleProfiles);
    } finally {
      setProcessing(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Username', 'Display Name', 'Platform', 'Followers', 'Bio', 'Links', 'Generated Page', 'Revenue', 'Status'],
      ...extractedProfiles.map(p => [
        p.username,
        p.displayName,
        p.platform,
        p.followers,
        p.bio.replace(/,/g, ';'),
        p.bioLinks.join('; '),
        p.generatedPageUrl || '',
        `$${p.revenue}`,
        p.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_profiles.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredProfiles = extractedProfiles.filter(profile => {
    const matchesSearch = profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || profile.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'pending': return 'text-orange-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'processing': return <Clock className="w-5 h-5" />;
      case 'pending': return <AlertCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const totalRevenue = extractedProfiles.reduce((sum, profile) => sum + profile.revenue, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-lg">
                TD
              </div>
              <div>
                <h1 className="text-2xl font-bold">TD Studios Dashboard</h1>
                <p className="text-gray-400 text-sm">Creator Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'ocr-generator', label: 'OCR Link Generator', icon: Camera },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'automation', label: 'Automation', icon: Zap },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'ocr-generator' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Upload className="w-6 h-6 mr-2 text-purple-400" />
                Upload Screenshots
              </h2>
              
              <div 
                className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drop Instagram/TikTok screenshots here</p>
                <p className="text-gray-400">or click to browse files</p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3">
                        <div className="w-full h-24 bg-gray-700 rounded mb-2 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={processImages}
                      disabled={processing}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-medium flex items-center space-x-2 disabled:cursor-not-allowed"
                    >
                      {processing ? <Clock className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                      <span>{processing ? 'Processing...' : 'Process Images'}</span>
                    </button>
                    
                    <button
                      onClick={() => setUploadedFiles([])}
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            {extractedProfiles.length > 0 && (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-purple-400" />
                    Extracted Profiles ({filteredProfiles.length})
                  </h2>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Search className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search profiles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <button
                      onClick={exportToCSV}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map(profile => (
                    <div key={profile.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`flex items-center space-x-1 ${getStatusColor(profile.status)}`}>
                          {getStatusIcon(profile.status)}
                          <span className="text-sm font-medium capitalize">{profile.status}</span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                          {profile.platform}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-bold text-lg">{profile.displayName}</h3>
                        <p className="text-purple-400 text-sm">{profile.username}</p>
                        <p className="text-gray-400 text-sm">{profile.followers} followers</p>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{profile.bio}</p>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-gray-400">Extracted Links:</p>
                        {profile.extractedLinks.slice(0, 2).map((link, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded text-xs">
                            <span className="truncate">{link.title}</span>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </div>
                        ))}
                        {profile.extractedLinks.length > 2 && (
                          <p className="text-xs text-gray-400">+{profile.extractedLinks.length - 2} more</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Revenue</p>
                          <p className="text-green-400 font-bold">${profile.revenue.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {profile.generatedPageUrl && (
                            <>
                              
                                href={profile.generatedPageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => copyToClipboard(profile.generatedPageUrl!)}
                                className="text-gray-400 hover:text-white"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Profiles</p>
                    <p className="text-2xl font-bold">{extractedProfiles.length}</p>
                  </div>
                  <User className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold">
                      {extractedProfiles.filter(p => p.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Revenue</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      ${extractedProfiles.length > 0 ? Math.round(totalRevenue / extractedProfiles.length).toLocaleString() : 0}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6">Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">API Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">OpenAI API Key</label>
                    <input type="password" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" placeholder="sk-..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TDStudiosDashboard;
