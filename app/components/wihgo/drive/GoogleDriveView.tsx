"use client";

import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Upload,
  FolderPlus,
  Search,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  Folder,
  ExternalLink,
  Trash2,
  Lock,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Copy,
  Grid,
  List,
  Plus
} from 'lucide-react';
import { googleSignIn, getAccessToken } from '../../../lib/wihgo/demoBackend';
import { 
  fetchGoogleDriveFiles, 
  uploadGoogleDriveFile, 
  createGoogleDriveFolder, 
  deleteGoogleDriveFile, 
  DriveFileItem 
} from '../../../lib/wihgo/demoBackend';

interface GoogleDriveViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const GoogleDriveView: React.FC<GoogleDriveViewProps> = ({ onNavigateTab }) => {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'folders' | 'docs' | 'images'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  // New Folder Modal
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  
  // Delete File Confirmation Modal
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);

  // Initial Load
  useEffect(() => {
    checkAndLoadDrive();
  }, []);

  const checkAndLoadDrive = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = await getAccessToken();
      if (token) {
        setIsAuthenticated(true);
        const fetchedFiles = await fetchGoogleDriveFiles(token);
        setFiles(fetchedFiles);
      } else {
        setIsAuthenticated(false);
        // Load default mock files for preview state until signed in
        setFiles(MOCK_INITIAL_DRIVE_FILES);
      }
    } catch (err: any) {
      console.error('Error loading Google Drive:', err);
      setErrorMsg('Could not fetch Google Drive files. Try signing in again.');
      setFiles(MOCK_INITIAL_DRIVE_FILES);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setIsAuthenticated(true);
        setSuccessMsg('Successfully connected Google Drive!');
        setTimeout(() => setSuccessMsg(null), 3000);
        await checkAndLoadDrive();
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setErrorMsg('Google Drive sign-in failed or was cancelled.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const fileToUpload = fileList[0];
    setLoading(true);
    setErrorMsg(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        await handleSignIn();
        return;
      }

      const newFile = await uploadGoogleDriveFile(token, fileToUpload);
      setFiles(prev => [newFile, ...prev]);
      setSuccessMsg(`Uploaded "${fileToUpload.name}" to Google Drive!`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('File upload error:', err);
      setErrorMsg(`Failed to upload ${fileToUpload.name}: ${err.message || 'Error'}`);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        await handleSignIn();
        return;
      }

      const folder = await createGoogleDriveFolder(token, newFolderName.trim());
      setFiles(prev => [folder, ...prev]);
      setSuccessMsg(`Folder "${newFolderName}" created in Google Drive!`);
      setShowFolderModal(false);
      setNewFolderName('');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Folder creation error:', err);
      setErrorMsg('Failed to create folder in Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const token = await getAccessToken();
      if (token) {
        await deleteGoogleDriveFile(token, fileToDelete.id);
      }
      setFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      setSuccessMsg(`Deleted "${fileToDelete.name}" from Google Drive.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('File deletion error:', err);
      setErrorMsg(`Could not delete file: ${err.message}`);
    } finally {
      setLoading(false);
      setFileToDelete(null);
    }
  };

  // Filtered files
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'folders') return (f.mimeType || '') === 'application/vnd.google-apps.folder';
    if (activeFilter === 'docs') return (f.mimeType || '').includes('document') || (f.mimeType || '').includes('spreadsheet') || (f.mimeType || '').includes('presentation') || (f.mimeType || '').includes('text');
    if (activeFilter === 'images') return (f.mimeType || '').includes('image') || (f.mimeType || '').includes('png') || (f.mimeType || '').includes('jpeg');
    return true;
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    if (mimeType.includes('image')) {
      return <ImageIcon className="w-5 h-5 text-pink-400" />;
    }
    if (mimeType.includes('document') || mimeType.includes('pdf') || mimeType.includes('text')) {
      return <FileText className="w-5 h-5 text-blue-400" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/30">
            <HardDrive className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Google Drive Workspace</h1>
              {isAuthenticated ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  OAuth Connected
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Preview Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Browse, upload, organize, and manage your Google Drive files and project assets</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isAuthenticated ? (
            <button
              id="btn-connect-google-drive"
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSigningIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <HardDrive className="w-4 h-4" />}
              <span>Authorize Google Drive</span>
            </button>
          ) : (
            <button
              onClick={checkAndLoadDrive}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Refresh Files"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          )}

          <label className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
            <input 
              type="file" 
              onChange={handleFileUpload} 
              className="hidden" 
              disabled={loading}
            />
          </label>

          <button
            onClick={() => setShowFolderModal(true)}
            className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files and folders..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter Badges & View Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {[
              { id: 'all', label: 'All' },
              { id: 'folders', label: 'Folders' },
              { id: 'docs', label: 'Docs' },
              { id: 'images', label: 'Images' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Grid / List */}
      {filteredFiles.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <HardDrive className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Google Drive files found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search filter.' : 'Upload a file or create a folder to organize your business assets.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className="bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 p-4 rounded-2xl backdrop-blur-xl transition-all space-y-3 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {getFileIcon(file.mimeType || '')}
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 transition-colors"
                      title="Open in Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setFileToDelete(file)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate" title={file.name}>{file.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  {file.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : file.size ? `${(parseInt(String(file.size || '0')) / 1024).toFixed(0)} KB` : 'Google Doc'}
                </p>
              </div>

              {file.thumbnailLink && (
                <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/60 flex items-center justify-center">
                  <img src={file.thumbnailLink} alt={file.name} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
          {filteredFiles.map(file => (
            <div key={file.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0">
                  {getFileIcon(file.mimeType || '')}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{file.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    {file.mimeType === 'application/vnd.google-apps.folder' ? 'Google Drive Folder' : file.size ? `${(parseInt(String(file.size || '0')) / 1024).toFixed(0)} KB` : 'Cloud Document'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {file.webViewLink && (
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setFileToDelete(file)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <FolderPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">New Folder</h3>
                <p className="text-xs text-slate-400">Create a folder in Google Drive</p>
              </div>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name (e.g. Q3 Marketing Assets)"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for File Deletion */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Delete Google Drive File?</h3>
                <p className="text-xs text-slate-400 mt-0.5">This action will remove the item from your Google Drive.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold text-white truncate">
              {fileToDelete.name}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MOCK_INITIAL_DRIVE_FILES: DriveFileItem[] = [
  {
    id: 'drv-1',
    name: 'WIHGO AI Q3 Marketing Strategy.docx',
    mimeType: 'application/vnd.google-apps.document',
    webViewLink: 'https://drive.google.com',
    modifiedTime: '2026-08-11T10:00:00Z',
    size: '1024000',
  },
  {
    id: 'drv-2',
    name: 'Campaign Assets & Graphics',
    mimeType: 'application/vnd.google-apps.folder',
    webViewLink: 'https://drive.google.com',
    modifiedTime: '2026-08-10T14:30:00Z',
  },
  {
    id: 'drv-3',
    name: 'Customer Feedback & Leads Q3.xlsx',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    webViewLink: 'https://drive.google.com',
    modifiedTime: '2026-08-09T09:15:00Z',
    size: '512000',
  },
  {
    id: 'drv-4',
    name: 'Product Showcase Banner.png',
    mimeType: 'image/png',
    webViewLink: 'https://drive.google.com',
    thumbnailLink: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    modifiedTime: '2026-08-08T16:20:00Z',
    size: '2048000',
  }
];
