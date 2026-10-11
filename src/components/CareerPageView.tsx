import React, { useState } from 'react';
import { SITE_IDENTITY } from '../data/pharmacyData';
import { BrandButton } from './BrandButton';
import {
  Briefcase,
  MapPin,
  Phone,
  Envelope,
  Check,
} from '@phosphor-icons/react';

export const CareerPageView: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('Registered Community Pharmacist');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [experienceYears, setExperienceYears] = useState('2-5 years');
  const [coverNote, setCoverNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const roles = [
    {
      id: 'pharmacist',
      title: 'Registered Community Pharmacist',
      type: 'Full-Time · On-Site',
      location: 'Abelemkpe, Accra',
      department: 'Clinical Dispensary',
      description: 'Supervise daily prescription fulfillment, counsel patients on chronic and acute medications, manage cold-chain temperature logs, and deliver personalized health advice.',
      requirements: [
        'BPharm or PharmD degree from an accredited institution',
        'Valid license and current PIN with the Pharmacy Council of Ghana',
        'Demonstrated commitment to patient safety and ethical pharmaceutical practice',
        'Strong communication and interpersonal skills in English and Twi/Ga',
      ],
    },
    {
      id: 'dispensing-tech',
      title: 'Pharmacy Dispensing Assistant / Technician',
      type: 'Full-Time · Shift Basis',
      location: 'Abelemkpe Dispensary',
      department: 'Retail Counter',
      description: 'Assist pharmacists with stock replenishment, over-the-counter customer inquiries, POS checkout operations, and proper storage of medicines.',
      requirements: [
        'Certificate or Diploma in Dispensing Technology / Pharmacy Assistance',
        'Minimum 1 year experience in a busy community pharmacy setting',
        'High attention to detail regarding expiration dates and batch numbers',
        'Friendly, customer-centric attitude and basic computer literacy',
      ],
    },
    {
      id: 'sales-rep',
      title: 'Pharmaceutical Sales & Account Representative',
      type: 'Full-Time · Field',
      location: 'Greater Accra & Eastern Region',
      department: 'Wholesale & Institutional Division',
      description: 'Represent Cedar Point Chemist proprietary lines (Cenart Forte, Zurion, Hemosoft, Cantab) to doctors, private clinics, and hospital pharmacies. Expand institutional accounts.',
      requirements: [
        'HND or Bachelor’s degree in Marketing, Biological Sciences, or Pharmacy',
        'Proven track record in pharmaceutical or healthcare detailing',
        'Valid Ghanaian driver’s license and willingness to travel within regions',
        'Strong negotiation and relationship-building abilities',
      ],
    },
    {
      id: 'logistics',
      title: 'Cold-Chain Logistics & Warehouse Coordinator',
      type: 'Full-Time · On-Site',
      location: 'Abelemkpe Central Depot',
      department: 'Supply Chain & Inventory',
      description: 'Oversee inventory receiving, batch verification, climate-controlled cold storage maintenance, and packing of courier dispatches for clinics nationwide.',
      requirements: [
        'Diploma or degree in Supply Chain Management, Logistics, or related field',
        'Experience with warehouse inventory software and pharmaceutical batch control',
        'Familiarity with temperature-sensitive medication handling and shipping protocols',
      ],
    },
  ];

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div
        className="rounded-3xl p-8 sm:p-12 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #007A33 0%, #004D21 100%)' }}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <Briefcase size={16} className="text-emerald-300" aria-hidden="true" />
            <span>Join Our Clinical & Distribution Team</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Careers at Cedar Point Chemist
          </h1>
          <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-2xl">
            Build your career with one of Accra’s most trusted pharmaceutical institutions. We foster clinical excellence, continuous professional development, and a culture of genuine patient care.
          </p>
        </div>
      </div>

      {/* 2. Why Work With Us */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            Why Build Your Career at Cedar Point Chemist?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            We provide an environment where scientific curiosity meets empathetic healthcare delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              index: '01',
              title: 'Clinical Mentorship',
              desc: 'Work directly alongside experienced superintendent pharmacists with decades of practice in Ghanaian community health.',
            },
            {
              index: '02',
              title: 'Patient-First Culture',
              desc: 'We prioritize safe, honest counseling over aggressive sales targets. Our reputation rests on genuine patient recovery.',
            },
            {
              index: '03',
              title: 'Modern Facilities',
              desc: 'Operate in fully air-conditioned, climate-controlled dispensaries with computerized inventory and verified cold-chains.',
            },
            {
              index: '04',
              title: 'Career Advancement',
              desc: 'Clear growth pathways across our retail dispensary, clinical consultation desk, and nationwide wholesale operations.',
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-xs font-bold text-emerald-800 mb-3 tracking-wider">
                  {benefit.index}
                </div>
                <h3 className="font-heading font-bold text-base text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Open Positions List */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Available Opportunities
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Current Openings & Ongoing Talents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {role.department}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{role.type}</span>
                </div>

                <h3 className="font-heading font-bold text-lg text-gray-900">
                  {role.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 mb-3">
                  <MapPin size={16} className="text-emerald-700" aria-hidden="true" />
                  <span>{role.location}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {role.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="text-[11px] font-bold text-gray-800">Requirements:</div>
                  {role.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <Check size={16} className="text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <BrandButton
                type="button"
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => {
                  setSelectedRole(role.title);
                  document.getElementById('career-application-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Apply for this Position
              </BrandButton>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Application Form */}
      <section
        id="career-application-form"
        className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xs"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Submit Your Application
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Interested in joining us? Complete the form below or send your CV directly to our HR team.
            </p>
          </div>

          {appliedSuccess ? (
            <div className="py-12 text-center space-y-4 bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100">
              <div className="w-10 h-10 rounded-full border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <Check size={20} aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                Application Successfully Submitted
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-gray-900">{applicantName}</span>. Your application for <span className="font-semibold text-emerald-800">{selectedRole}</span> has been logged with our Abelemkpe recruitment desk. We will review your credentials and contact you at <span className="font-mono">{applicantPhone}</span>.
              </p>
              <button
                type="button"
                onClick={() => setAppliedSuccess(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Target Position *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title} ({r.department})
                    </option>
                  ))}
                  <option value="General Open Application">Other / General Open Application</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Kwabena Frimpong"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Years of Relevant Experience *
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Entry / Recent Graduate">Entry / Recent Graduate / National Service</option>
                    <option value="1-2 years">1 - 2 years</option>
                    <option value="2-5 years">2 - 5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Summary of Qualifications & Professional Background *
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Tell us about your educational background, Pharmacy Council registration status (if applicable), past pharmacy or sales experience, and why you wish to join Cedar Point Chemist..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <BrandButton
                type="submit"
                variant="primary"
                size="md"
                fullWidth
              >
                Submit Application Profile
              </BrandButton>
            </form>
          )}

          {/* Direct HR Contact details */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-2 text-xs text-gray-600">
            <div>
              You can also send your CV directly via email to:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 font-semibold text-emerald-800">
              <a href="mailto:cedarpoint@live.co.uk" className="hover:underline flex items-center gap-1">
                <Envelope size={16} aria-hidden="true" /> cedarpoint@live.co.uk
              </a>
              <span>·</span>
              <a href="mailto:inquiries@cedarpointchemist.com" className="hover:underline flex items-center gap-1">
                <Envelope size={16} aria-hidden="true" /> inquiries@cedarpointchemist.com
              </a>
              <span>·</span>
              <a href="tel:0302737720" className="hover:underline flex items-center gap-1">
                <Phone size={16} aria-hidden="true" /> 030-273-7720 / +233-302-737-720
              </a>
            </div>
            <div className="text-[11px] text-gray-400">
              Recruitment desk hours: Monday – Friday, 8:00 AM – 5:00 PM at No 5 Malm Street, Abelemkpe Accra.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
