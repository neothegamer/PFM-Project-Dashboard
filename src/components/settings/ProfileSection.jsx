import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { IconCheck } from '../common/Icons';

const ProfileSection = () => {
  const {
    user,
    updateUser,
  } = useFinance();

  const [formData, setFormData] = useState({
    name: user?.name || 'Sana',
    email: user?.email || 'sanamondal712@gmail.com',
    phone: user?.phone || '',
    currency: user?.currency || '₹',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (updateUser) {
      updateUser(formData);
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <section className="bg-navy-card border border-border rounded-2xl shadow-sm overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="px-5 sm:px-6 py-5 border-b border-border">

        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center flex-shrink-0">

            <span className="text-lg font-bold text-brand-purple">
              {(formData.name || 'S').charAt(0).toUpperCase()}
            </span>

          </div>


          {/* Profile Information */}
          <div className="min-w-0">

            <h3 className="text-base font-bold text-text-main">
              Personal Profile
            </h3>

            <p className="text-xs text-text-secondary mt-1">
              Update your personal and contact details
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          PROFILE FORM
      ===================================================== */}
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6"
      >

        {/* Current Account Info */}
        <div className="mb-6 p-4 rounded-xl bg-navy-secondary border border-border">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <p className="text-sm font-semibold text-text-main">
                {formData.name || 'Sana'}
              </p>

              <p className="text-xs text-text-secondary mt-1">
                {formData.email || 'sanamondal712@gmail.com'}
              </p>

            </div>


            <span className="inline-flex items-center self-start sm:self-auto px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-xs font-semibold text-brand-purple">
              Free Community Tier Account
            </span>

          </div>

        </div>


        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Full Name */}
          <div>

            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Full Name <span className="text-danger">*</span>
            </label>

            <input
              id="profile-name"
              type="text"
              value={formData.name}
              onChange={(event) =>
                handleChange('name', event.target.value)
              }
              required
              className="w-full h-11 px-4 rounded-xl bg-navy-secondary border border-border text-text-main placeholder-text-muted text-sm outline-none transition-all duration-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
              placeholder="Enter your full name"
            />

          </div>


          {/* Email */}
          <div>

            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Email Address <span className="text-danger">*</span>
            </label>

            <input
              id="profile-email"
              type="email"
              value={formData.email}
              onChange={(event) =>
                handleChange('email', event.target.value)
              }
              required
              className="w-full h-11 px-4 rounded-xl bg-navy-secondary border border-border text-text-main placeholder-text-muted text-sm outline-none transition-all duration-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
              placeholder="Enter your email address"
            />

          </div>


          {/* Phone */}
          <div>

            <label
              htmlFor="profile-phone"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Phone Number
            </label>

            <input
              id="profile-phone"
              type="tel"
              value={formData.phone}
              onChange={(event) =>
                handleChange('phone', event.target.value)
              }
              className="w-full h-11 px-4 rounded-xl bg-navy-secondary border border-border text-text-main placeholder-text-muted text-sm outline-none transition-all duration-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
              placeholder="+91 XXXXX XXXXX"
            />

          </div>


          {/* Currency */}
          <div>

            <label
              htmlFor="profile-currency"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Preferred Currency
            </label>

            <select
              id="profile-currency"
              value={formData.currency}
              onChange={(event) =>
                handleChange('currency', event.target.value)
              }
              className="w-full h-11 px-4 rounded-xl bg-navy-secondary border border-border text-text-main text-sm outline-none transition-all duration-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 cursor-pointer"
            >

              <option value="₹">
                ₹ - Indian Rupee (INR)
              </option>

              <option value="$">
                $ - US Dollar (USD)
              </option>

              <option value="€">
                € - Euro (EUR)
              </option>

              <option value="£">
                £ - British Pound (GBP)
              </option>

            </select>

          </div>

        </div>


        {/* =====================================================
            ACTIONS
        ===================================================== */}
        <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="min-h-[20px]">

            {saved && (

              <div className="flex items-center gap-2 text-sm text-success">

                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">

                  <IconCheck size={14} />

                </div>

                <span>
                  Profile changes saved successfully.
                </span>

              </div>

            )}

          </div>


          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-semibold transition-all duration-200 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
          >

            {saved && <IconCheck size={16} />}

            {saved
              ? 'Changes Saved'
              : 'Save Profile Changes'}

          </button>

        </div>

      </form>

    </section>
  );
};

export default ProfileSection;