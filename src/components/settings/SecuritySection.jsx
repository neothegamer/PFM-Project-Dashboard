import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { IconCheck, IconEye, IconEyeOff } from '../common/Icons';

export const SecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(newPassword);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-slate-200', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      setErrorMsg('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card">
      <div className="pb-5 border-b border-slate-100 mb-6">
        <h3 className="text-base font-bold text-brand-text">Security & Password</h3>
        <p className="text-xs text-brand-muted">Update your authentication password and security keys</p>
      </div>

      {successMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 text-brand-success text-xs font-semibold flex items-center gap-2">
          <IconCheck className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-brand-danger text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <Input
          label="Current Password"
          type={showPass ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••••••"
          rightIcon={showPass ? IconEyeOff : IconEye}
          onRightIconClick={() => setShowPass(!showPass)}
          required
        />

        <div>
          <Input
            label="New Password"
            type={showPass ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />

          {newPassword && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 rounded-full h-full transition-colors ${
                      strength >= step ? strengthColors[strength] : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-brand-muted text-right">
                Password Strength: <span className="font-semibold">{strengthLabels[strength]}</span>
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm New Password"
          type={showPass ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
          required
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" loading={loading}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySection;
