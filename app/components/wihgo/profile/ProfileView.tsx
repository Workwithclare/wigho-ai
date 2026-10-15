"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Volume2,
  VolumeX,
  LogOut,
  Download,
  Sparkles,
  CheckCircle2,
  Camera,
  Trash2,
  Building2,
  Globe,
  Phone,
  Mail,
  Briefcase,
  Save,
  Sliders,
  Crop,
  ZoomIn,
  RotateCw,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile, PlatformInfo } from '../../../lib/wihgo/types';
import { UserAvatar, getInitials } from '../common/UserAvatar';
import { uploadAvatarImage, removeAvatarImage } from '../../../lib/wihgo/demoBackend';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  platforms: PlatformInfo[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  platforms,
  soundEnabled,
  onToggleSound,
  onLogout
}) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);
  const [tempImage, setTempImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const connectedCount = platforms.filter(p => p.connected).length;

  // Sync formData whenever user prop changes
  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setTempImage(result);
      setZoomLevel(100);
      setRotation(0);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file triggers change
    e.target.value = '';
  };

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, businessLogo: result }));
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to generate a cropped/rotated blob from image
  const createProcessedBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.translate(size / 2, size / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        const scale = zoomLevel / 100;
        ctx.scale(scale, scale);

        // Center draw
        const drawX = -img.width / 2;
        const drawY = -img.height / 2;
        ctx.drawImage(img, drawX, drawY);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          0.9
        );
      };
      img.onerror = reject;
      img.src = tempImage;
    });
  };

  const applyCropAndSaveAvatar = async () => {
    setShowCropModal(false);
    setIsUploadingAvatar(true);
    setUploadError(null);

    try {
      let finalAvatarUrl = tempImage;

      if (user.id && user.id !== 'default') {
        const blob = await createProcessedBlob();
        // Avatar upload is disabled in this build (no storage bucket wired yet)
        finalAvatarUrl = await uploadAvatarImage(user.id, blob);
      }

      const updatedProfile: UserProfile = {
        ...formData,
        avatar: finalAvatarUrl
      };

      setFormData(updatedProfile);
      onUpdateUser(updatedProfile);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error('[Avatar Save Error]:', err);
      setUploadError(err.message || 'Failed to save avatar image.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploadingAvatar(true);
    try {
      if (user.id && user.id !== 'default') {
        await removeAvatarImage(user.id);
      }
      const updatedProfile: UserProfile = { ...formData, avatar: '' };
      setFormData(updatedProfile);
      onUpdateUser(updatedProfile);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error('[Avatar Remove Error]:', err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, businessLogo: '' }));
    setIsSaved(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Profile & Account Intelligence</span>
            <User className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">Customization, Personal/Business Identity & WIHGO Preferences</p>
        </div>

        <button
          onClick={onLogout}
          className="py-2 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all w-fit"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Profile Editor Card */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Type Selector (Personal vs Business) */}
        <div className="bg-slate-900/90 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Profile Mode</h2>
              <p className="text-xs text-slate-400">Select whether you are operating as an Individual or Business Entity</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleInputChange('profileType', 'personal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  formData.profileType === 'personal'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal</span>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange('profileType', 'business')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  formData.profileType === 'business'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Business</span>
              </button>
            </div>
          </div>

          {/* Avatar & Photo Upload Area */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="relative group">
              <UserAvatar
                name={formData.name}
                avatarUrl={formData.avatar}
                size="2xl"
                showOnlineBadge
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs gap-1"
              >
                <Camera className="w-5 h-5" />
                <span>Change</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base font-extrabold text-white">{formData.name || 'Your Name'}</h3>
                {!formData.avatar && (
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                    Initials Avatar: {getInitials(formData.name)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Upload a custom photo or automatically use the WIHGO futuristic initials avatar system.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="py-1.5 px-3.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Saving Avatar...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5" />
                      <span>{formData.avatar ? 'Change Photo' : 'Upload Photo'}</span>
                    </>
                  )}
                </button>

                {formData.avatar && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setTempImage(formData.avatar);
                        setShowCropModal(true);
                      }}
                      disabled={isUploadingAvatar}
                      className="py-1.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Crop className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Crop / Position</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={isUploadingAvatar}
                      className="py-1.5 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  </>
                )}
              </div>

              {uploadError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Business Logo Upload Area (If Business Profile) */}
          {formData.profileType === 'business' && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Business Brand Logo</h3>
                </div>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.businessLogo ? (
                    <img src={formData.businessLogo} alt="Business Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="py-1.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{formData.businessLogo ? 'Change Brand Logo' : 'Upload Business Logo'}</span>
                  </button>

                  {formData.businessLogo && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="py-1.5 px-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Role / Job Title */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                <span>Job Title / Role</span>
              </label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g. Founder, Business Architect"
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Phone number"
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Business / Company Name */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Company / Business Name</span>
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="e.g. WIHGO Global"
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Time Zone */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Time Zone</span>
              </label>
              <select
                value={formData.timeZone || 'PST (UTC-8)'}
                onChange={(e) => handleInputChange('timeZone', e.target.value)}
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
              >
                <option value="EST (UTC-5)">EST (UTC-5) - Eastern Time</option>
                <option value="CST (UTC-6)">CST (UTC-6) - Central Time</option>
                <option value="MST (UTC-7)">MST (UTC-7) - Mountain Time</option>
                <option value="PST (UTC-8)">PST (UTC-8) - Pacific Time</option>
                <option value="GMT (UTC+0)">GMT (UTC+0) - London</option>
                <option value="CET (UTC+1)">CET (UTC+1) - Central Europe</option>
                <option value="WAT (UTC+1)">WAT (UTC+1) - West Africa Time</option>
              </select>
            </div>
          </div>

          {/* Business Description */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Business Description & Mission Summary
            </label>
            <textarea
              rows={3}
              value={formData.businessDescription || ''}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              placeholder="Describe your business, target audience, and communication goals..."
              className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Save Button Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            {isSaved ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-500">Unsaved changes in profile form</span>
            )}

            <button
              type="submit"
              className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </div>
      </form>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sound & Notifications */}
        <div className="bg-slate-900/80 border border-indigo-500/15 rounded-3xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Audio & Alert Feedback</h3>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">System Sound Effects</div>
              <div className="text-[10px] text-slate-400">Synthetic audio chime on incoming syncs & AI task completions</div>
            </div>

            <button
              id="btn-toggle-sound"
              type="button"
              onClick={onToggleSound}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
                soundEnabled
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span>OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security & API keys */}
        <div className="bg-slate-900/80 border border-indigo-500/15 rounded-3xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Security & Encryption</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Encrypted
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Gemini 2.5 Server Key</span>
              <span className="font-mono text-[10px] text-cyan-400">Server-Side Proxy Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Active Platform Connectors</span>
              <span className="font-mono text-[10px] text-emerald-400">{connectedCount} Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* CROP & REPOSITION IMAGE MODAL */}
      {showCropModal && tempImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Crop & Reposition Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Interactive Image Preview Box */}
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.3)] bg-slate-950 flex items-center justify-center relative">
              <img
                src={tempImage}
                alt="Preview"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> Zoom Level</span>
                  <span>{zoomLevel}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Rotation</span>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="py-1 px-3 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCropAndSaveAvatar}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Save & Apply Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
