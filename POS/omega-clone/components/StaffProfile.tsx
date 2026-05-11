// components/StaffProfile.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { usePosStore } from '@/store/usePosStore';
import { 
  User, Star, Award, Clock, TrendingUp, 
  Calendar, Activity, Shield, Zap, Heart,
  Briefcase, Mail, Phone, MapPin
} from 'lucide-react';

// ============================================================================
// STAFF PROFILE COMPONENT
// ============================================================================

export const StaffProfile = () => {
  const { currentStaff, fetchStaffProfile, staffProfiles } = usePosStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentStaff) {
      loadProfile();
    }
  }, [currentStaff]);

  const loadProfile = async () => {
    if (!currentStaff) return;
    setLoading(true);
    try {
      const cached = staffProfiles.get(currentStaff.id);
      if (cached) {
        setProfile(cached);
      } else {
        const data = await fetchStaffProfile(currentStaff.id);
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <User size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
              <User size={40} className="text-white/80" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter">
                {profile.personal.full_name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-blue-500/20 text-blue-300 text-xs font-black px-3 py-1 rounded-full uppercase">
                  {profile.employment.role}
                </span>
                <span className="text-sm text-slate-400">
                  Since {new Date(profile.personal.hire_date).getFullYear()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Performance Score */}
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Star className="text-white" size={24} fill="white" />
            </div>
            <p className="text-2xl font-black">{profile.performance.avgRating}</p>
            <p className="text-xs text-slate-400">Rating</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-500" />
              Personal Information
            </h3>
            <div className="space-y-3">
              {profile.personal.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span className="font-medium">{profile.personal.email}</span>
                </div>
              )}
              {profile.personal.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span className="font-medium">{profile.personal.phone}</span>
                </div>
              )}
              {profile.personal.emergency_contact && (
                <div className="flex items-center gap-3 text-sm">
                  <Shield size={16} className="text-red-400" />
                  <span className="font-medium">Emergency: {profile.personal.emergency_contact}</span>
                </div>
              )}
            </div>
          </div>

          {/* Employment Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-purple-500" />
              Employment Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Base Salary</p>
                <p className="font-bold">${profile.employment.base_salary_usd}/month</p>
              </div>
              {profile.employment.hourly_rate && (
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Hourly Rate</p>
                  <p className="font-bold">${profile.employment.hourly_rate}/hr</p>
                </div>
              )}
            </div>
          </div>

          {/* Leave Balance */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-orange-500" />
              Leave Balance
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-2xl">
                <p className="text-2xl font-black text-blue-600">{profile.leaveBalance.annual}</p>
                <p className="text-xs font-bold text-blue-400 uppercase mt-1">Annual</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-2xl">
                <p className="text-2xl font-black text-red-600">{profile.leaveBalance.sick}</p>
                <p className="text-xs font-bold text-red-400 uppercase mt-1">Sick</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-2xl">
                <p className="text-2xl font-black text-orange-600">{profile.leaveBalance.emergency}</p>
                <p className="text-xs font-bold text-orange-400 uppercase mt-1">Emergency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Performance & Badges */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Metrics */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
              <Activity size={20} className="text-emerald-500" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <p className="text-2xl font-black">{profile.performance.tasksCompleted}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Tasks Done</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <p className="text-2xl font-black">{profile.performance.upsells}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Upsells</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <div className="bg-emerald-100 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Star size={20} className="text-emerald-600" />
                </div>
                <p className="text-2xl font-black">{profile.performance.punctuality}%</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Punctuality</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Heart size={20} className="text-orange-600" />
                </div>
                <p className="text-2xl font-black">{profile.performance.customerFeedback}%</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Feedback</p>
              </div>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
              <Award size={20} className="text-yellow-500" />
              Badges & Achievements
            </h3>
            
            {profile.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.badges.map((badge: any) => (
                  <div 
                    key={badge.id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-2xl text-center border border-yellow-200 hover:shadow-lg transition-all cursor-default group"
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Zap size={24} className="text-yellow-600" />
                    </div>
                    <p className="font-black text-sm">{badge.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(badge.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Award size={32} className="mx-auto mb-2 opacity-50" />
                <p className="font-medium">No badges yet</p>
                <p className="text-xs mt-1">Complete tasks and achieve goals to earn badges!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};