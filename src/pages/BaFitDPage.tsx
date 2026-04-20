import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Wrench, GraduationCap, Scale, Sprout, Monitor,
  Calculator, Hammer, Heart, MoreHorizontal, ChevronDown, ChevronRight,
  ArrowLeft, Check, MessageCircle, Users, Globe, Sparkles,
  ClipboardList, MapPin, Calendar, Phone, Mail, User, Briefcase,
  Minus, Plus, Pencil, Lock, ShieldCheck, BookOpen, FileText, ListChecks,
  Facebook, Instagram, Share2,
} from 'lucide-react';
import Logo from '../components/Logo';
import NewFooter from '../components/NewFooter';
import PageSEO from '../components/PageSEO';
import ParticlesErrorBoundary from '../components/ParticlesErrorBoundary';
import { submitVolunteer, submitFreeformVolunteer, getBaFitDStats } from '../services/bafitdService';
import { tr, type BaFitDLang } from '../utils/bafitdTranslations';
import {
  type BaFitDFormData, type BaFitDStats, type SkillCategory,
  type QualificationLevel, type Gender, type AgeRange, type AvailabilityFrequency,
  type ServiceMode, type PreferredContact, type StartAvailability,
  type EmployerSupport, type ReferralSource, type BotswanaLanguage,
  INITIAL_FORM_DATA, BOTSWANA_DISTRICTS, DAYS_OF_WEEK,
} from '../types/bafitd';

const Particles = React.lazy(() => import('../components/Particles'));

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const TOTAL_STEPS = 6;

const SKILL_ICONS: Record<SkillCategory, React.ReactNode> = {
  healthcare: <Stethoscope className="w-6 h-6" />,
  engineering: <Wrench className="w-6 h-6" />,
  education: <GraduationCap className="w-6 h-6" />,
  legal: <Scale className="w-6 h-6" />,
  agriculture: <Sprout className="w-6 h-6" />,
  IT: <Monitor className="w-6 h-6" />,
  finance: <Calculator className="w-6 h-6" />,
  trades: <Hammer className="w-6 h-6" />,
  social_work: <Heart className="w-6 h-6" />,
  other: <MoreHorizontal className="w-6 h-6" />,
};

const SKILL_LABELS: Record<SkillCategory, { en: string; tn: string }> = {
  healthcare: { en: 'Healthcare', tn: 'Boitekanelo' },
  engineering: { en: 'Engineering', tn: 'Boenjineri' },
  education: { en: 'Education', tn: 'Thuto' },
  legal: { en: 'Legal', tn: 'Molao' },
  agriculture: { en: 'Agriculture', tn: 'Temo' },
  IT: { en: 'IT', tn: 'IT' },
  finance: { en: 'Finance', tn: 'Ditšhelete' },
  trades: { en: 'Trades', tn: 'Diatla' },
  social_work: { en: 'Social Work', tn: 'Loago' },
  other: { en: 'Other', tn: 'Tse Dingwe' },
};

/* ============================================================================
   ANIMATED COUNTER
   ============================================================================ */

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (value <= 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.ceil(value / (duration * 60));
    const id = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(start);
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [value, duration]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

/* ============================================================================
   REUSABLE COMPONENTS
   ============================================================================ */

function GlassCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`relative bg-white/90 backdrop-blur-xl rounded-2xl border border-teal/25 shadow-xl shadow-teal/5 overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal" />
      {children}
    </motion.div>
  );
}

function SelectionCard({
  selected, onClick, icon, label, sublabel, className = '',
}: {
  selected: boolean; onClick: () => void; icon?: React.ReactNode; label: string; sublabel?: string; className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative min-h-[56px] px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 w-full
        ${selected
          ? 'border-teal bg-teal/8 shadow-md shadow-teal/10'
          : 'border-gray-300 bg-sand-100 hover:border-teal hover:bg-teal/5 hover:shadow-sm'
        } ${className}
      `}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            selected ? 'bg-teal/20 text-teal' : 'bg-gray-100 text-gray-500'
          }`}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className={`font-semibold text-base ${selected ? 'text-teal-800' : 'text-deep-navy'}`}>{label}</div>
          {sublabel && <div className="text-xs text-deep-navy/60 mt-0.5">{sublabel}</div>}
        </div>
      </div>
    </motion.button>
  );
}

function FormField({
  label, error, children, optional,
}: {
  label: string; error?: string; children: React.ReactNode; optional?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold text-deep-navy">
        {label}
        {optional && <span className="text-deep-navy/40 font-normal text-sm ml-2">(optional)</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-500 text-sm font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = 'w-full min-h-[56px] px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 bg-sand-50 text-deep-navy placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200';
const textareaClass = 'w-full min-h-[100px] px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 bg-sand-50 text-deep-navy placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 resize-none';
const selectClass = 'w-full min-h-[56px] px-5 py-3.5 text-base rounded-xl border-2 border-gray-300 bg-sand-50 text-deep-navy focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 appearance-none cursor-pointer';

/* ============================================================================
   CONFETTI EFFECT
   ============================================================================ */

function ConfettiBurst() {
  const colors = ['#0096B3', '#FF6A00', '#00AEEF', '#FFD700', '#10B981'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: '50%', y: '50%', scale: 0, opacity: 1,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: [0, 1, 0.5],
            opacity: [1, 1, 0],
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.3, ease: 'easeOut' }}
          className="absolute"
          style={{
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================================
   UHURU KNOX SECURITY BADGE
   ============================================================================ */

function KnoxBadge({ size = 'default', showLabel = true }: { size?: 'small' | 'default'; showLabel?: boolean }) {
  const isSmall = size === 'small';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative group cursor-default"
      title="Your data is protected by Uhuru Knox"
    >
      <div className={`
        relative flex items-center gap-1.5 overflow-hidden rounded-full
        bg-gradient-to-r from-deep-navy via-[#003d5e] to-deep-navy
        border border-teal/25
        shadow-[0_2px_8px_rgba(0,47,75,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]
        ${isSmall ? 'px-2.5 py-1' : 'px-3 py-1.5'}
      `}>
        {/* Matt gloss sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] to-transparent pointer-events-none" />
        {/* Subtle shimmer sweep */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer-sweep 4s ease-in-out infinite',
          }}
        />

        <div className="relative flex items-center justify-center">
          <ShieldCheck className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.4)]`} />
          <Lock className={`absolute ${isSmall ? 'w-1.5 h-1.5' : 'w-[7px] h-[7px]'} text-white/90`} style={{ marginTop: isSmall ? '-1px' : '-1px' }} />
        </div>
        {showLabel && (
          <span className={`relative tracking-wide whitespace-nowrap ${isSmall ? 'text-[9px]' : 'text-[10px]'}`}>
            <span className="text-gray-400 font-medium">Secured by </span>
            <span className="text-white/85 font-semibold">UHURU KNOX</span>
          </span>
        )}
        {/* Live secure dot */}
        <div className={`relative ${isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6)]`}>
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================================
   MAIN PAGE COMPONENT
   ============================================================================ */

type RegistrationIntent = 'business' | 'professional' | 'internship' | 'idea' | 'giveback' | 'product' | null;

const BaFitDPage: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<BaFitDLang>('en');
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState<BaFitDStats | null>(null);

  // Which "I am..." card the user clicked before registering
  const [registrationIntent, setRegistrationIntent] = useState<RegistrationIntent>(null);

  // Input mode: 'choose' = picker, 'freeform' = essay, 'form' = wizard
  const [inputMode, setInputMode] = useState<'choose' | 'freeform' | 'form'>('choose');
  const [freeformData, setFreeformData] = useState({ full_name: '', phone: '', email: '', freeform_text: '' });

  // Wizard state
  const [currentStep, setCurrentStep] = useState(0); // 0 = not started (hero view)
  const [formData, setFormData] = useState<BaFitDFormData>({ ...INITIAL_FORM_DATA });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; volunteerNumber?: number } | null>(null);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const wizardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    getBaFitDStats().then(res => {
      if (res.success && res.stats) setStats(res.stats);
    });
  }, []);

  const T = useCallback((key: Parameters<typeof tr>[0], replacements?: Record<string, string | number>) => {
    return tr(key, lang, replacements);
  }, [lang]);

  const updateField = <K extends keyof BaFitDFormData>(key: K, value: BaFitDFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const scrollToWizard = () => {
    setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const startRegistration = () => {
    setCurrentStep(1);
    setInputMode('choose');
    scrollToWizard();
  };

  const startRegistrationWithIntent = (intent: NonNullable<RegistrationIntent>) => {
    setRegistrationIntent(intent);
    setCurrentStep(1);
    setInputMode('choose');
    scrollToWizard();
  };

  const INTENT_LABEL_KEY: Record<NonNullable<RegistrationIntent>, Parameters<typeof T>[0]> = {
    business:     'intentLabelBusiness',
    professional: 'intentLabelProfessional',
    internship:   'intentLabelInternship',
    idea:         'intentLabelIdea',
    giveback:     'intentLabelGiveback',
    product:      'intentLabelProduct',
  };
  const INTENT_SUBTITLE_KEY: Record<NonNullable<RegistrationIntent>, Parameters<typeof T>[0]> = {
    business:     'intentSubtitleBusiness',
    professional: 'intentSubtitleProfessional',
    internship:   'intentSubtitleInternship',
    idea:         'intentSubtitleIdea',
    giveback:     'intentSubtitleGiveback',
    product:      'intentSubtitleProduct',
  };
  const INTENT_ESSAY_LABEL_KEY: Record<NonNullable<RegistrationIntent>, Parameters<typeof T>[0]> = {
    business:     'freeformEssayLabelBusiness',
    professional: 'freeformEssayLabelProfessional',
    internship:   'freeformEssayLabelInternship',
    idea:         'freeformEssayLabelIdea',
    giveback:     'freeformEssayLabelGiveback',
    product:      'freeformEssayLabelProduct',
  };
  const INTENT_STEP1_SUBTITLE_KEY: Record<NonNullable<RegistrationIntent>, Parameters<typeof T>[0]> = {
    business:     'step1SubtitleBusiness',
    professional: 'step1SubtitleProfessional',
    internship:   'step1SubtitleInternship',
    idea:         'step1SubtitleIdea',
    giveback:     'step1SubtitleGiveback',
    product:      'step1SubtitleProduct',
  };

  const pickFreeform = () => {
    setInputMode('freeform');
    scrollToWizard();
  };

  const pickForm = () => {
    setInputMode('form');
    scrollToWizard();
  };

  const handleFreeformSubmit = async () => {
    const e: Record<string, string> = {};
    if (!freeformData.full_name.trim()) e.full_name = T('errorName');
    if (!freeformData.phone.trim()) e.phone = T('errorPhone');
    if (!freeformData.freeform_text.trim()) e.freeform_text = lang === 'en' ? 'Please tell us about yourself' : 'Tsweetswee re bolelele ka ga gago';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsSubmitting(true);
    setErrors({});
    const result = await submitFreeformVolunteer({
      ...freeformData,
      preferred_language: lang,
    });
    if (result.success) {
      setSubmitResult({ success: true, volunteerNumber: (stats?.total_volunteers ?? 0) + 1 });
      setFormData(prev => ({ ...prev, full_name: freeformData.full_name })); // for the success screen name
      getBaFitDStats().then(res => { if (res.success && res.stats) setStats(res.stats); });
    } else if (result.error === 'duplicate') {
      setErrors({ submit: T('errorDuplicate') });
    } else {
      setErrors({ submit: result.error || T('errorSubmit') });
    }
    setIsSubmitting(false);
  };

  /* ---------- Validation ---------- */

  const validateStep = (step: number): boolean => {
    const e: Record<string, string> = {};
    switch (step) {
      case 1: // Tell Us About Yourself
        if (!formData.full_name.trim()) e.full_name = T('errorName');
        if (!formData.phone.trim()) e.phone = T('errorPhone');
        if (!formData.qualification_level) e.qualification_level = T('errorQualification');
        if (!formData.qualification.trim()) e.qualification = T('errorQualification');
        if (!formData.institution.trim()) e.institution = T('errorInstitution');
        if (!formData.skill_category) e.skill_category = T('errorSkillCategory');
        if (!formData.skill_specialty.trim()) e.skill_specialty = T('errorSpecialty');
        break;
      case 2: // Which area of Botswana
        if (formData.is_diaspora === null) e.is_diaspora = T('errorRequired');
        if (!formData.city.trim()) e.city = T('errorCity');
        break;
      case 3: break; // When can you start — optional
      case 4: break; // Employer support — optional
      case 5: break; // Availability — optional
      case 6: break; // How often — optional
      case 7: break; // Review & Pledge — optional
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setDirection(1);
    setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS));
    scrollToWizard();
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep(s => Math.max(s - 1, 1));
    scrollToWizard();
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    scrollToWizard();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrors({});
    const result = await submitVolunteer({ ...formData, preferred_language: lang });
    if (result.success) {
      setSubmitResult({ success: true, volunteerNumber: (stats?.total_volunteers ?? 0) + 1 });
      // Refresh stats
      getBaFitDStats().then(res => { if (res.success && res.stats) setStats(res.stats); });
    } else if (result.error === 'duplicate') {
      setErrors({ submit: T('errorDuplicate') });
    } else {
      setErrors({ submit: result.error || T('errorSubmit') });
    }
    setIsSubmitting(false);
  };

  const stepVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  const nextLabels: Record<number, Parameters<typeof tr>[0]> = {
    1: 'nextStep2', 2: 'nextStep3', 3: 'nextStep4', 4: 'nextStep5', 5: 'nextStep7',
  };

  /* ========================================================================
     RENDER
     ======================================================================== */

  return (
    <div className="min-h-screen bg-sand-200">
      <PageSEO
        title="BaFitD — Batswana and Friends in the Diaspora | Uhuru AI"
        description="Register as a skilled Motswana to volunteer pro bono services. BaFitD connects skilled Batswana at home and in the diaspora with communities that need their expertise."
        keywords="BaFitD, Botswana skills, give back Botswana, pro bono, volunteer, Batswana diaspora, Uhuru AI, Orion X"
        canonicalPath="/BaFitD"
      />

      {/* ===================== STICKY HEADER ===================== */}
      <header className="sticky top-0 z-50 bg-sand-200/80 backdrop-blur-xl border-b border-teal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Back to Uhuru">
            <Logo className="h-7 sm:h-8" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://botswanaandfriends.com"
              className="hidden md:inline-flex px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-teal/15 text-sm font-medium text-deep-navy hover:bg-white/80 transition-all min-h-[40px]"
            >
              BaFitD
            </a>
            {/* Language toggle */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'tn' : 'en')}
              className="px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-teal/15 text-sm font-medium text-deep-navy hover:bg-white/80 transition-all min-h-[40px]"
            >
              {lang === 'en' ? '🇧🇼 Setswana' : '🇬🇧 English'}
            </button>
            <button
              onClick={() => navigate('/card')}
              className="px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-teal/15 text-sm font-medium text-deep-navy hover:bg-white/80 transition-all min-h-[40px]"
            >
              BaFitIT Card
            </button>
            {currentStep === 0 && (
              <motion.button
                onClick={startRegistration}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 sm:px-5 py-2 rounded-xl btn-gradient text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all min-h-[40px]"
              >
                {T('registerNow')}
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-start justify-center overflow-hidden">
        {/* Particles background */}
        <div className="absolute inset-0 z-0">
          <ParticlesErrorBoundary>
            <Suspense fallback={<div />}>
              <Particles
                particleColors={['#0096B3', '#00AEEF', '#FF6A00']}
                particleCount={isMobile ? 100 : 400}
                particleSpread={10}
                speed={0.08}
                particleBaseSize={130}
                moveParticlesOnHover={!isMobile}
                alphaParticles={false}
                disableRotation={false}
              />
            </Suspense>
          </ParticlesErrorBoundary>
        </div>

        {/* Radial glow — gives the hero depth */}
        <div className="absolute inset-0 z-[1] pointer-events-none hero-glow" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center pt-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-[1.05]">
                <span className="text-deep-navy">Ba</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-accent-orange">FitD</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-deep-navy/80 mb-2">
                Batswana and Friends in the Diaspora
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base sm:text-lg md:text-xl text-deep-navy/70 max-w-2xl mx-auto mb-4 leading-relaxed px-2 italic"
            >
              {T('tagline')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="text-sm sm:text-base md:text-lg text-deep-navy/60 max-w-2xl mx-auto mb-8 leading-relaxed px-2"
            >
              {T('heroDescription')}
            </motion.p>

            {/* Stats counters */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10"
              >
                {[
                  { val: stats.total_volunteers, label: T('totalVolunteers'), icon: <Users className="w-5 h-5" /> },
                  { val: Object.keys(stats.by_category).length, label: T('skillCategories'), icon: <Sparkles className="w-5 h-5" /> },
                  { val: Object.keys(stats.by_city).length, label: T('citiesReached'), icon: <MapPin className="w-5 h-5" /> },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-teal/15 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/15 to-accent-orange/10 flex items-center justify-center text-teal">
                      {s.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-deep-navy font-headline">
                        <AnimatedCounter value={s.val} />
                      </div>
                      <div className="text-xs text-deep-navy/60 font-medium">{s.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Preamble — full max-w-7xl width, aligned with header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full mb-10 text-left bg-white/60 backdrop-blur-sm border border-teal/15 rounded-3xl px-8 sm:px-10 py-8 shadow-sm space-y-4"
          >
            <p className="text-sm font-semibold text-teal uppercase tracking-widest">
              Pronounced &ldquo;Ba Fiti&rdquo; — they are Fit!
            </p>
            <p className="text-sm sm:text-base text-deep-navy/80 leading-relaxed">
              Batswana and Friends in the Diaspora (BaFitD) is an ever-evolving online platform designed to connect professionals and businesspersons passionate about the upliftment of Botswana.
            </p>
            <p className="text-sm sm:text-base text-deep-navy/80 leading-relaxed">
              It is for citizens of Botswana living in the country as well as those who are resident abroad. Non-Batswana who have previously lived in, or interacted with the country, and who are passionate about making a difference to the lives of Batswana are also welcome to join.
            </p>
            <p className="text-sm sm:text-base text-deep-navy/80 leading-relaxed">
              If you have a business or a product you have developed — we want to know about it. Why? Because we want to help you promote the business and/or products across our various networks.
            </p>
            <p className="text-sm sm:text-base text-deep-navy/80 leading-relaxed">
              If you work for an employer who takes on interns — we want to know. Why? Because maybe you can help the child of a Motswana seeking an internship opportunity secure one. One day it might be your loved one who is assisted.
            </p>
            <p className="text-sm sm:text-base text-deep-navy/80 leading-relaxed">
              If you are a Motswana, we will ask you questions such as &ldquo;Which primary school did you attend?&rdquo; and &ldquo;Which village are you from?&rdquo; Why? Because we hope that through this online platform we can put together networks to help uplift your former school or home village.
            </p>
            <p className="text-sm sm:text-base text-deep-navy/80 leading-relaxed">
              As we receive feedback, we will endeavour to improve the platform. It is not intended to be a panacea to all the challenges facing the country — but instead to be a platform where people can talk and share with purpose.
            </p>
            <p className="text-base sm:text-lg font-bold text-teal">
              A re neng fiti beng betsho!
            </p>
          </motion.div>

          {/* Intent cards — primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="w-full max-w-4xl mx-auto"
          >
            <p className="text-sm font-semibold text-deep-navy/50 uppercase tracking-widest mb-5">
              {T('heroJoinPrompt')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              {([
                { intent: 'business' as const,    key: 'bullet1' as const, icon: <Briefcase className="w-5 h-5" /> },
                { intent: 'professional' as const, key: 'bullet2' as const, icon: <Users className="w-5 h-5" /> },
                { intent: 'internship' as const,   key: 'bullet3' as const, icon: <GraduationCap className="w-5 h-5" /> },
                { intent: 'idea' as const,         key: 'bullet4' as const, icon: <Lock className="w-5 h-5" /> },
                { intent: 'product' as const,      key: 'bullet6' as const, icon: <Sparkles className="w-5 h-5" /> },
                { intent: 'giveback' as const,     key: 'bullet5' as const, icon: <Heart className="w-5 h-5" /> },
              ]).map((card, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => startRegistrationWithIntent(card.intent)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group text-left flex items-start gap-3 p-4 rounded-2xl backdrop-blur-sm border transition-all ${registrationIntent === card.intent ? 'bg-teal/10 border-teal shadow-lg' : 'bg-white/70 border-teal/20 hover:border-teal hover:bg-white/90 hover:shadow-lg'}`}
                >
                  <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${registrationIntent === card.intent ? 'bg-gradient-to-br from-teal to-accent-orange text-white' : 'bg-gradient-to-br from-teal/15 to-accent-orange/10 group-hover:from-teal group-hover:to-accent-orange text-teal group-hover:text-white'}`}>
                    {card.icon}
                  </div>
                  <p className="text-xs sm:text-sm text-deep-navy/80 leading-snug group-hover:text-deep-navy transition-colors">
                    {T(card.key)}
                  </p>
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-deep-navy/40 text-center">
              {T('heroJoinPromptSub')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================== INITIATIVE SECTION ===================== */}
      <section className="py-16 sm:py-20 bg-teal/[0.05] border-y border-teal/10">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-deep-navy text-center mb-10">
            What is <span className="text-teal">BaFitD</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              { key: 'whatIs' as const, icon: <ClipboardList className="w-7 h-7" /> },
              { key: 'whoIsFor' as const, icon: <Users className="w-7 h-7" /> },
              { key: 'howWorks' as const, icon: <Sparkles className="w-7 h-7" /> },
              { key: 'diaspora' as const, icon: <Globe className="w-7 h-7" /> },
            ]).map((card, i) => (
              <GlassCard key={i} delay={i * 0.1} className="p-6 sm:p-7">
                <div className="w-14 h-14 rounded-2xl bg-teal flex items-center justify-center text-white mb-5 shadow-lg">
                  {card.icon}
                </div>
                <h3 className="font-headline text-lg font-bold text-deep-navy mb-2">
                  {T(`${card.key}Title` as Parameters<typeof tr>[0])}
                </h3>
                <p className="text-sm text-deep-navy/70 leading-relaxed">
                  {T(`${card.key}Desc` as Parameters<typeof tr>[0])}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== REGISTRATION WIZARD ===================== */}
      <section ref={wizardRef} id="register" className="py-16 sm:py-24 bg-gradient-to-b from-white to-sand-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <AnimatePresence mode="wait">
            {submitResult?.success ? (
              /* ==================== SUCCESS SCREEN ==================== */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <ConfettiBurst />
                <GlassCard className="p-8 sm:p-12 text-center relative z-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-teal flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="font-headline text-3xl sm:text-4xl font-bold text-deep-navy mb-3">
                    {T('thankYou', { name: formData.full_name.split(' ')[0] })}
                  </h2>
                  <p className="text-lg text-deep-navy/70 mb-8">
                    {T('volunteerNumber', { number: submitResult.volunteerNumber ?? 0 })}
                  </p>
                  <p className="text-deep-navy/60 font-medium mb-3">{T('shareMessage')}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
                    <motion.a
                      href={`https://wa.me/?text=${encodeURIComponent(`I just registered as a BaFitD volunteer! Join me in giving back to Botswana: ${window.location.origin}/BaFitD`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold min-h-[56px] shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {T('shareWhatsApp')}
                    </motion.a>
                    <motion.a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/BaFitD`)}&quote=${encodeURIComponent('I just registered as a BaFitD volunteer! Join me in giving back to Botswana.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1877F2] text-white font-semibold min-h-[56px] shadow-lg"
                    >
                      <Facebook className="w-5 h-5" />
                      {T('shareFacebook')}
                    </motion.a>
                    <motion.a
                      href={`https://www.instagram.com/stories/create/?url=${encodeURIComponent(`${window.location.origin}/BaFitD`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-semibold min-h-[56px] shadow-lg"
                    >
                      <Instagram className="w-5 h-5" />
                      {T('shareInstagram')}
                    </motion.a>
                  </div>
                  <div className="mt-4">
                    <motion.button
                      onClick={() => navigate('/')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-teal/30 text-deep-navy font-semibold min-h-[56px]"
                    >
                      {T('backToHome')}
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            ) : currentStep === 0 ? (
              /* ==================== CTA BEFORE STARTING ==================== */
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <GlassCard className="p-8 sm:p-10">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-deep-navy mb-4">
                    {T('registerCta')}
                  </h2>
                  <p className="text-base text-deep-navy/70 mb-6 max-w-lg mx-auto leading-relaxed">
                    {T('tagline')}
                  </p>
                  <motion.button
                    type="button"
                    onClick={startRegistration}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl btn-gradient text-white font-bold text-lg shadow-xl min-h-[56px]"
                  >
                    {T('registerNow')}
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </GlassCard>
              </motion.div>

            ) : inputMode === 'choose' ? (
              /* ==================== INPUT MODE CHOOSER ==================== */
              <motion.div
                key="mode-choose"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-8 sm:p-10">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-deep-navy mb-2 text-center">
                    {T('chooseInputMode')}
                  </h2>
                  <p className="text-base text-deep-navy/60 mb-4 text-center">
                    {T('chooseInputModeSubtitle')}
                  </p>
                  {registrationIntent && (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-teal/5 border border-teal/20 flex items-start gap-2 text-sm text-deep-navy/80">
                      <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold text-deep-navy">{T('intentNote')} </span>
                        {T(INTENT_LABEL_KEY[registrationIntent])}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      onClick={pickFreeform}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-gray-300 bg-sand-100 hover:border-teal hover:bg-teal/5 hover:shadow-lg transition-all text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/15 to-accent-orange/10 flex items-center justify-center text-teal">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-headline text-lg font-bold text-deep-navy mb-1">{T('modeEssayTitle')}</h3>
                        <p className="text-sm text-deep-navy/60 leading-relaxed">{T('modeEssayDesc')}</p>
                      </div>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={pickForm}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-gray-300 bg-sand-100 hover:border-teal hover:bg-teal/5 hover:shadow-lg transition-all text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/15 to-accent-orange/10 flex items-center justify-center text-teal">
                        <ListChecks className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-headline text-lg font-bold text-deep-navy mb-1">{T('modeFormTitle')}</h3>
                        <p className="text-sm text-deep-navy/60 leading-relaxed">{T('modeFormDesc')}</p>
                      </div>
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>

            ) : inputMode === 'freeform' ? (
              /* ==================== FREEFORM ESSAY VIEW ==================== */
              <motion.div
                key="freeform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-6 sm:p-8">
                  <h3 className="font-headline text-2xl font-bold text-deep-navy mb-1 text-center">{T('freeformTitle')}</h3>
                  {registrationIntent && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-teal/5 border border-teal/15 flex items-start gap-2 text-xs text-deep-navy/70">
                      <Check className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                      <span><span className="font-semibold">{T('intentNote')} </span>{T(INTENT_LABEL_KEY[registrationIntent])}</span>
                    </div>
                  )}
                  <p className="text-base text-deep-navy/60 mb-6 text-center leading-relaxed">
                    {registrationIntent ? T(INTENT_SUBTITLE_KEY[registrationIntent]) : T('freeformSubtitle')}
                  </p>

                  <div className="space-y-5">
                    <FormField label={T('freeformNameLabel')} error={errors.full_name}>
                      <input type="text" className={inputClass} placeholder={T('fullNamePlaceholder')} value={freeformData.full_name} onChange={e => { setFreeformData(d => ({ ...d, full_name: e.target.value })); if (errors.full_name) setErrors(prev => { const n = { ...prev }; delete n.full_name; return n; }); }} autoComplete="name" />
                    </FormField>
                    <FormField label={T('freeformPhoneLabel')} error={errors.phone}>
                      <input type="tel" className={inputClass} placeholder={T('phonePlaceholder')} value={freeformData.phone} onChange={e => { setFreeformData(d => ({ ...d, phone: e.target.value })); if (errors.phone) setErrors(prev => { const n = { ...prev }; delete n.phone; return n; }); }} autoComplete="tel" />
                    </FormField>
                    <FormField label={T('freeformEmailLabel')}>
                      <input type="email" className={inputClass} placeholder={T('emailPlaceholder')} value={freeformData.email} onChange={e => setFreeformData(d => ({ ...d, email: e.target.value }))} autoComplete="email" />
                    </FormField>
                    <FormField label={registrationIntent ? T(INTENT_ESSAY_LABEL_KEY[registrationIntent]) : T('freeformEssayLabel')} error={errors.freeform_text}>
                      <textarea
                        className={`${textareaClass} !min-h-[240px]`}
                        placeholder={T('freeformPlaceholder')}
                        value={freeformData.freeform_text}
                        onChange={e => { setFreeformData(d => ({ ...d, freeform_text: e.target.value })); if (errors.freeform_text) setErrors(prev => { const n = { ...prev }; delete n.freeform_text; return n; }); }}
                        rows={10}
                        maxLength={3000}
                      />
                      <p className="text-xs text-deep-navy/40 text-right">{freeformData.freeform_text.length}/3000</p>
                    </FormField>

                    <AnimatePresence>
                      {errors.submit && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                          {errors.submit}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                    <motion.button
                      type="button"
                      onClick={handleFreeformSubmit}
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                      className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-gradient text-white font-bold text-lg shadow-xl min-h-[56px] transition-all ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          {T('freeformSubmit')}
                          <Heart className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                    <button
                      type="button"
                      onClick={pickForm}
                      className="text-sm text-teal font-medium hover:underline"
                    >
                      {T('freeformSwitchToForm')}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              /* ==================== WIZARD ==================== */
              <div key="wizard">
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-deep-navy/60">
                      {T('stepOf', { current: currentStep, total: TOTAL_STEPS })}
                    </span>
                    <span className="text-sm text-deep-navy/40">
                      {currentStep === 1 ? T('step1Title') : currentStep === 2 ? T('step2Title') : currentStep === 3 ? T('step3Title') : currentStep === 4 ? T('step4Title') : currentStep === 5 ? T('step5Title') : T('step7Title')}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-teal"
                      initial={false}
                      animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <GlassCard className="p-6 sm:p-8">
                  <AnimatePresence mode="wait" custom={direction}>
                    {/* ===== STEP 1: TELL US ABOUT YOURSELF ===== */}
                    {currentStep === 1 && (
                      <motion.div key="s1" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }}>
                        <h3 className="font-headline text-2xl font-bold text-deep-navy mb-1 text-center">{T('step1Title')}</h3>
                              {registrationIntent && (
                          <div className="mb-3 px-3 py-2 rounded-lg bg-teal/5 border border-teal/15 flex items-start gap-2 text-xs text-deep-navy/70">
                            <Check className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                            <span><span className="font-semibold">{T('intentNote')} </span>{T(INTENT_LABEL_KEY[registrationIntent])}</span>
                          </div>
                        )}
                        <p className="text-base text-deep-navy/60 mb-6 text-center">{registrationIntent ? T(INTENT_STEP1_SUBTITLE_KEY[registrationIntent]) : T('step1Subtitle')}</p>

                        {/* Personal Details subsection */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-lg bg-teal flex items-center justify-center text-white shrink-0"><User className="w-3.5 h-3.5" /></div>
                          <h4 className="font-semibold text-sm text-deep-navy uppercase tracking-wide">{T('step1SectionPersonal')}</h4>
                        </div>
                        <div className="space-y-5 mb-8">
                          <FormField label={T('fullName')} error={errors.full_name}>
                            <input type="text" className={inputClass} placeholder={T('fullNamePlaceholder')} value={formData.full_name} onChange={e => updateField('full_name', e.target.value)} autoComplete="name" />
                          </FormField>
                          <FormField label={T('phone')} error={errors.phone}>
                            <input type="tel" className={inputClass} placeholder={T('phonePlaceholder')} value={formData.phone} onChange={e => updateField('phone', e.target.value)} autoComplete="tel" />
                          </FormField>
                          <FormField label={T('email')} optional>
                            <input type="email" className={inputClass} placeholder={T('emailPlaceholder')} value={formData.email} onChange={e => updateField('email', e.target.value)} autoComplete="email" />
                          </FormField>
                          <FormField label={T('gender')}>
                            <div className="grid grid-cols-3 gap-3">
                              {([['male', T('genderMale')], ['female', T('genderFemale')], ['prefer_not_to_say', T('genderPreferNot')]] as const).map(([v, l]) => (
                                <SelectionCard key={v} selected={formData.gender === v} onClick={() => updateField('gender', v as Gender)} label={l} />
                              ))}
                            </div>
                          </FormField>
                          <FormField label={T('ageRange')}>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                              {(['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] as AgeRange[]).map(r => (
                                <SelectionCard key={r} selected={formData.age_range === r} onClick={() => updateField('age_range', r)} label={r} className="text-center justify-center" />
                              ))}
                            </div>
                          </FormField>
                          <FormField label={T('nationality')}>
                            <select title={T('nationality')} className={selectClass} value={formData.nationality} onChange={e => { updateField('nationality', e.target.value); updateField('omang_number', ''); updateField('passport_number', ''); }}>
                              <option value="">{T('nationalityPlaceholder')}</option>
                              <option value="Botswana">Motswana (Botswana)</option>
                              <option value="South Africa">South Africa</option>
                              <option value="Zimbabwe">Zimbabwe</option>
                              <option value="Zambia">Zambia</option>
                              <option value="Namibia">Namibia</option>
                              <option value="Mozambique">Mozambique</option>
                              <option value="Kenya">Kenya</option>
                              <option value="Nigeria">Nigeria</option>
                              <option value="Ghana">Ghana</option>
                              <option value="Tanzania">Tanzania</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="United States">United States</option>
                              <option value="Other">Other</option>
                            </select>
                          </FormField>
                          {formData.nationality === 'Botswana' && (
                            <FormField label={T('omangNumber')} optional>
                              <input type="text" className={inputClass} placeholder="e.g. 123456789" value={formData.omang_number} onChange={e => updateField('omang_number', e.target.value)} />
                              <p className="text-xs text-deep-navy/40 mt-1">{T('omangOptional')}</p>
                            </FormField>
                          )}
                          {formData.nationality && formData.nationality !== 'Botswana' && (
                            <>
                              <FormField label={T('relationshipToBotswana')}>
                                <select title={T('relationshipToBotswana')} className={selectClass} value={formData.relationship_to_botswana} onChange={e => { updateField('relationship_to_botswana', e.target.value); if (e.target.value !== 'other') updateField('relationship_to_botswana_other', ''); }}>
                                  <option value="">{T('relationshipToBotswanaPlaceholder')}</option>
                                  <option value="studied">{T('relStudied')}</option>
                                  <option value="worked">{T('relWorked')}</option>
                                  <option value="family">{T('relFamily')}</option>
                                  <option value="friends">{T('relFriends')}</option>
                                  <option value="born">{T('relBorn')}</option>
                                  <option value="visited">{T('relVisited')}</option>
                                  <option value="business">{T('relBusiness')}</option>
                                  <option value="heard_of_it">{T('relHeardOfIt')}</option>
                                  <option value="other">{T('relOther')}</option>
                                </select>
                              </FormField>
                              {formData.relationship_to_botswana === 'other' && (
                                <FormField label={T('relOther')}>
                                  <input type="text" className={inputClass} placeholder={T('relOtherPlaceholder')} value={formData.relationship_to_botswana_other} onChange={e => updateField('relationship_to_botswana_other', e.target.value)} />
                                </FormField>
                              )}
                              <FormField label={T('passportNumber')} optional>
                                <input type="text" className={inputClass} placeholder="e.g. AB1234567" value={formData.passport_number} onChange={e => updateField('passport_number', e.target.value)} />
                                <p className="text-xs text-deep-navy/40 mt-1">{T('passportOptional')}</p>
                              </FormField>
                            </>
                          )}
                        </div>

                        {/* Your Background subsection */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-lg bg-teal flex items-center justify-center text-white shrink-0"><GraduationCap className="w-3.5 h-3.5" /></div>
                          <h4 className="font-semibold text-sm text-deep-navy uppercase tracking-wide">{T('step1SectionBackground')}</h4>
                        </div>
                        <div className="space-y-5 mb-8">
                          <FormField label={T('qualificationLevel')} error={errors.qualification_level}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {([
                                ['certificate', T('certificate')], ['diploma', T('diploma')], ['degree', T('degree')],
                                ['masters', T('masters')], ['doctorate', T('doctorate')], ['other', T('otherQual')],
                              ] as const).map(([v, l]) => (
                                <SelectionCard key={v} selected={formData.qualification_level === v} onClick={() => updateField('qualification_level', v as QualificationLevel)} label={l} icon={<GraduationCap className="w-5 h-5" />} />
                              ))}
                            </div>
                          </FormField>
                          <FormField label={T('qualificationName')} error={errors.qualification}>
                            <input type="text" className={inputClass} placeholder={T('qualificationNamePlaceholder')} value={formData.qualification} onChange={e => updateField('qualification', e.target.value)} />
                          </FormField>
                          <FormField label={T('institution')} error={errors.institution}>
                            <input type="text" className={inputClass} placeholder={T('institutionPlaceholder')} value={formData.institution} onChange={e => updateField('institution', e.target.value)} />
                          </FormField>
                          <FormField label={T('graduationYear')} optional>
                            <input type="number" className={inputClass} placeholder="2005" min={1950} max={new Date().getFullYear()} value={formData.graduation_year} onChange={e => updateField('graduation_year', e.target.value)} />
                          </FormField>
                        </div>

                        {/* Your Skills subsection */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-lg bg-teal flex items-center justify-center text-white shrink-0"><Briefcase className="w-3.5 h-3.5" /></div>
                          <h4 className="font-semibold text-sm text-deep-navy uppercase tracking-wide">{T('step1SectionSkills')}</h4>
                        </div>
                        <div className="space-y-5">
                          <FormField label={T('skillCategory')} error={errors.skill_category}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {(Object.keys(SKILL_ICONS) as SkillCategory[]).map(cat => (
                                <SelectionCard key={cat} selected={formData.skill_category === cat} onClick={() => updateField('skill_category', cat)} icon={SKILL_ICONS[cat]} label={SKILL_LABELS[cat][lang]} />
                              ))}
                            </div>
                            {formData.skill_category === 'other' && (
                              <input
                                type="text"
                                className={`${inputClass} mt-3`}
                                placeholder={lang === 'en' ? 'Please describe your area of expertise' : 'Tlhalosa lefelo la boitseanape jwa gago'}
                                value={formData.skill_category_other}
                                onChange={e => updateField('skill_category_other', e.target.value)}
                              />
                            )}
                          </FormField>
                          <FormField label={T('specialty')} error={errors.skill_specialty}>
                            <input type="text" className={inputClass} placeholder={T('specialtyPlaceholder')} value={formData.skill_specialty} onChange={e => updateField('skill_specialty', e.target.value)} />
                          </FormField>
                          <FormField label={T('specificServices')} optional>
                            <textarea className={textareaClass} placeholder={T('specificServicesPlaceholder')} value={formData.specific_services} onChange={e => updateField('specific_services', e.target.value)} rows={3} />
                          </FormField>
                          <FormField label={T('yearsExperience')}>
                            <div className="flex items-center gap-4">
                              <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => updateField('years_of_experience', String(Math.max(0, parseInt(formData.years_of_experience || '0') - 1)))} className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-deep-navy hover:bg-gray-200 transition-colors"><Minus className="w-5 h-5" /></motion.button>
                              <input type="number" title="Years of experience" className={`${inputClass} text-center max-w-[100px]`} value={formData.years_of_experience} onChange={e => updateField('years_of_experience', e.target.value)} min={0} max={60} />
                              <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => updateField('years_of_experience', String(parseInt(formData.years_of_experience || '0') + 1))} className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-deep-navy hover:bg-gray-200 transition-colors"><Plus className="w-5 h-5" /></motion.button>
                            </div>
                          </FormField>
                          <FormField label={T('currentEmployer')} optional>
                            <input type="text" className={inputClass} placeholder={T('currentEmployerPlaceholder')} value={formData.current_employer} onChange={e => updateField('current_employer', e.target.value)} />
                          </FormField>
                          <FormField label={T('professionalLicense')} optional>
                            <input type="text" className={inputClass} placeholder={T('professionalLicensePlaceholder')} value={formData.professional_license} onChange={e => updateField('professional_license', e.target.value)} />
                          </FormField>
                        </div>
                      </motion.div>
                    )}

                    {/* ===== STEP 2: WHICH AREA OF BOTSWANA ===== */}
                    {currentStep === 2 && (
                      <motion.div key="s2" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }}>
                        <h3 className="font-headline text-2xl font-bold text-deep-navy mb-1 text-center">{T('step2Title')}</h3>
                        <p className="text-base text-deep-navy/60 mb-6 text-center">{T('step2Subtitle')}</p>
                        <div className="space-y-5">
                          <FormField label={lang === 'en' ? 'Where are you based?' : 'O nna kae?'} error={errors.is_diaspora}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <SelectionCard selected={formData.is_diaspora === false} onClick={() => { updateField('is_diaspora', false); updateField('country_of_residence', 'Botswana'); }} label={T('liveInBotswana')} icon={<MapPin className="w-5 h-5" />} />
                              <SelectionCard selected={formData.is_diaspora === true} onClick={() => updateField('is_diaspora', true)} label={T('liveAbroad')} icon={<Globe className="w-5 h-5" />} />
                            </div>
                          </FormField>
                          {formData.is_diaspora === false && (
                            <>
                              <FormField label={T('cityTownVillage')} error={errors.city}>
                                <input type="text" className={inputClass} placeholder={T('cityPlaceholder')} value={formData.city} onChange={e => updateField('city', e.target.value)} list="bw-cities" />
                                <datalist id="bw-cities">
                                  {['Gaborone','Francistown','Maun','Kasane','Serowe','Palapye','Molepolole','Kanye','Lobatse','Selebi-Phikwe','Jwaneng','Mochudi','Ramotswa','Tlokweng','Mogoditshane'].map(c => <option key={c} value={c} />)}
                                </datalist>
                              </FormField>
                              <FormField label={T('district')} optional>
                                <div className="relative">
                                  <select className={selectClass} title="District" value={formData.district} onChange={e => updateField('district', e.target.value)}>
                                    <option value="">{T('selectDistrict')}</option>
                                    {BOTSWANA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </FormField>
                            </>
                          )}
                          {formData.is_diaspora === true && (
                            <>
                              <FormField label={T('countryOfResidence')} error={errors.city}>
                                <input type="text" className={inputClass} placeholder="e.g. United Kingdom" value={formData.country_of_residence} onChange={e => updateField('country_of_residence', e.target.value)} />
                              </FormField>
                              <FormField label={T('cityTownVillage')} error={errors.city}>
                                <input type="text" className={inputClass} placeholder="e.g. London" value={formData.city} onChange={e => updateField('city', e.target.value)} />
                              </FormField>
                              <FormField label={T('willingToTravel')}>
                                <div className="grid grid-cols-2 gap-3">
                                  <SelectionCard selected={formData.willing_to_travel_back === true} onClick={() => updateField('willing_to_travel_back', true)} label={T('yes')} />
                                  <SelectionCard selected={formData.willing_to_travel_back === false} onClick={() => updateField('willing_to_travel_back', false)} label={T('no')} />
                                </div>
                              </FormField>
                            </>
                          )}
                          {formData.is_diaspora !== null && (
                            <FormField label={T('preferredServiceDistrict')} optional>
                              <div className="relative">
                                <select className={selectClass} title="Preferred service district" value={formData.preferred_service_district} onChange={e => updateField('preferred_service_district', e.target.value)}>
                                  <option value="">{T('selectServiceDistrict')}</option>
                                  {BOTSWANA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </FormField>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ===== STEP 3: WHEN CAN YOU START? ===== */}
                    {currentStep === 3 && (
                      <motion.div key="s3" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }}>
                        <h3 className="font-headline text-2xl font-bold text-deep-navy mb-1 text-center">{T('step3Title')}</h3>
                        <p className="text-base text-deep-navy/60 mb-8 text-center">{T('step3Subtitle')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {([
                            ['immediately', T('immediately')], ['within_1_month', T('within1Month')],
                            ['within_3_months', T('within3Months')], ['not_sure', T('notSure')],
                          ] as const).map(([v, l]) => (
                            <SelectionCard key={v} selected={formData.start_availability === v} onClick={() => updateField('start_availability', v as StartAvailability)} label={l} icon={<Calendar className="w-5 h-5" />} className="p-5 text-base" />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ===== STEP 4: HAS YOUR EMPLOYER AGREED? ===== */}
                    {currentStep === 4 && (
                      <motion.div key="s4" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }}>
                        <h3 className="font-headline text-2xl font-bold text-deep-navy mb-1 text-center">{T('step4Title')}</h3>
                        <p className="text-base text-deep-navy/60 mb-8 text-center">{T('step4Subtitle')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {([
                            ['yes', T('employerYes')], ['not_yet', T('employerNotYet')],
                            ['self_employed', T('employerSelf')], ['retired', T('employerRetired')],
                            ['not_applicable', T('employerNA')],
                          ] as const).map(([v, l]) => (
                            <SelectionCard key={v} selected={formData.employer_support === v} onClick={() => updateField('employer_support', v as EmployerSupport)} label={l} className="p-5 text-base" />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ===== STEP 5: YOUR AVAILABILITY ===== */}
                    {currentStep === 5 && (
                      <motion.div key="s5" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }}>
                        <h3 className="font-headline text-2xl font-bold text-deep-navy mb-1 text-center">{T('step5Title')}</h3>
                        <p className="text-base text-deep-navy/60 mb-6 text-center">{T('step5Subtitle')}</p>
                        <div className="space-y-5">
                          <FormField label={T('preferredDays')} optional>
                            <div className="flex flex-wrap gap-2">
                              {DAYS_OF_WEEK.map(day => {
                                const dayKey = day as Parameters<typeof tr>[0];
                                const sel = formData.preferred_days.includes(day);
                                return (
                                  <motion.button key={day} type="button" whileTap={{ scale: 0.93 }}
                                    onClick={() => { const next = sel ? formData.preferred_days.filter(d => d !== day) : [...formData.preferred_days, day]; updateField('preferred_days', next); }}
                                    className={`min-h-[48px] min-w-[48px] px-4 py-2 rounded-xl font-semibold text-sm transition-all ${sel ? 'bg-teal text-white shadow-md' : 'bg-sand-200 border border-gray-300 text-deep-navy/80 hover:border-teal hover:bg-teal/5'}`}
                                  >{T(dayKey)}</motion.button>
                                );
                              })}
                            </div>
                          </FormField>
                          <FormField label={T('preferredContact')}>
                            <div className="grid grid-cols-2 gap-3">
                              {([
                                ['whatsapp', T('whatsapp'), <MessageCircle className="w-5 h-5" key="wa" />],
                                ['sms', T('sms'), <Phone className="w-5 h-5" key="sms" />],
                                ['phone_call', T('phoneCall'), <Phone className="w-5 h-5" key="ph" />],
                                ['email', T('emailContact'), <Mail className="w-5 h-5" key="em" />],
                              ] as const).map(([v, l, ico]) => (
                                <SelectionCard key={v} selected={formData.preferred_contact === v} onClick={() => updateField('preferred_contact', v as PreferredContact)} label={l as string} icon={ico} />
                              ))}
                            </div>
                          </FormField>
                          <FormField label={T('languagesSpoken')}>
                            <div className="flex flex-wrap gap-2">
                              {([
                                ['english', T('english')], ['setswana', T('setswana')], ['kalanga', T('kalanga')],
                                ['sekgalagadi', T('sekgalagadi')], ['herero', T('herero')], ['sebirwa', T('sebirwa')], ['other', T('otherLang')],
                              ] as const).map(([v, l]) => {
                                const sel = formData.languages_spoken.includes(v as BotswanaLanguage);
                                return (
                                  <motion.button key={v} type="button" whileTap={{ scale: 0.93 }}
                                    onClick={() => { const next = sel ? formData.languages_spoken.filter(x => x !== v) : [...formData.languages_spoken, v as BotswanaLanguage]; updateField('languages_spoken', next); }}
                                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium transition-all ${sel ? 'bg-teal text-white shadow-md' : 'bg-sand-200 border border-gray-300 text-deep-navy/80 hover:border-teal hover:bg-teal/5'}`}
                                  >{l}</motion.button>
                                );
                              })}
                            </div>
                          </FormField>
                        </div>
                      </motion.div>
                    )}

                    {/* ===== STEP 6: HOW OFTEN AND HOW ===== */}
                    {/* ===== STEP 6: REVIEW & PLEDGE ===== */}
                    {currentStep === 6 && (
                      <motion.div key="s6" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }}>
                        <h3 className="font-headline text-2xl font-bold text-deep-navy mb-1 text-center">{T('step7Title')}</h3>
                        <p className="text-base text-deep-navy/60 mb-6 text-center">{T('step7Subtitle')}</p>

                        {/* Review summary */}
                        <div className="space-y-4 mb-6">
                          {([
                            { step: 1, title: T('step1Title'), icon: <User className="w-4 h-4" />, items: [
                              formData.full_name, formData.phone, formData.email, formData.gender, formData.age_range,
                              formData.qualification_level, formData.qualification,
                              formData.skill_category && SKILL_LABELS[formData.skill_category as SkillCategory]?.[lang],
                              formData.skill_specialty,
                            ].filter(Boolean) },
                            { step: 2, title: T('step2Title'), icon: <MapPin className="w-4 h-4" />, items: [
                              formData.city, formData.district, formData.is_diaspora ? `Diaspora: ${formData.country_of_residence}` : 'Botswana',
                              formData.preferred_service_district,
                            ].filter(Boolean) },
                            { step: 3, title: T('step3Title'), icon: <Calendar className="w-4 h-4" />, items: [formData.start_availability].filter(Boolean) },
                            { step: 4, title: T('step4Title'), icon: <Briefcase className="w-4 h-4" />, items: [formData.employer_support].filter(Boolean) },
                            { step: 5, title: T('step5Title'), icon: <Phone className="w-4 h-4" />, items: [
                              formData.preferred_days.join(', '), formData.preferred_contact, formData.languages_spoken.join(', '),
                            ].filter(Boolean) },
                          ]).map(section => (
                            <div key={section.step} className="flex items-start gap-3 p-4 rounded-xl bg-sand-50 border border-teal/10">
                              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal flex-shrink-0 mt-0.5">
                                {section.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm text-deep-navy">{section.title}</h4>
                                  <button type="button" onClick={() => goToStep(section.step)} className="text-xs text-teal font-semibold hover:underline flex items-center gap-1">
                                    <Pencil className="w-3 h-3" /> {T('editSection')}
                                  </button>
                                </div>
                                <p className="text-sm text-deep-navy/60 mt-1 truncate">{section.items.join(' · ')}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-5">
                          <FormField label={T('referralSource')}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {([
                                ['social_media', T('socialMedia')], ['friend', T('friend')], ['news', T('news')],
                                ['employer', T('employer')], ['other', T('otherSource')],
                              ] as const).map(([v, l]) => (
                                <SelectionCard key={v} selected={formData.referral_source === v} onClick={() => updateField('referral_source', v as ReferralSource)} label={l} />
                              ))}
                            </div>
                          </FormField>
                          <FormField label={T('pledgeStatement')} optional>
                            <textarea className={textareaClass} placeholder={T('pledgePlaceholder')} value={formData.pledge_statement} onChange={e => updateField('pledge_statement', e.target.value)} rows={4} maxLength={500} />
                            <p className="text-xs text-deep-navy/40 text-right">{formData.pledge_statement.length}/500</p>
                          </FormField>

                          <AnimatePresence>
                            {errors.submit && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                {errors.submit}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ===== NAVIGATION BUTTONS ===== */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    {currentStep > 1 ? (
                      <motion.button
                        type="button"
                        onClick={goBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-deep-navy font-semibold hover:bg-gray-100 transition-colors min-h-[56px]"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        {T('back')}
                      </motion.button>
                    ) : <div />}

                    {currentStep < TOTAL_STEPS ? (
                      <motion.button
                        type="button"
                        onClick={goNext}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all min-h-[56px]"
                      >
                        {T(nextLabels[currentStep])}
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-gradient text-white font-bold text-lg shadow-xl min-h-[56px] transition-all ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            {T('submitPledge')}
                            <Heart className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </GlassCard>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ==================== FAQ SECTION ===================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-sand-100 to-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-accent-orange">{T('faqTitle')}</span>
          </motion.h2>
          <FAQAccordion lang={lang} />
        </div>
      </section>

      <NewFooter />
    </div>
  );
};

/* ============================================================================
   FAQ ACCORDION SUB-COMPONENT
   ============================================================================ */

function FAQAccordion({ lang }: { lang: BaFitDLang }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    { q: tr('faq1Q', lang), a: tr('faq1A', lang) },
    { q: tr('faq2Q', lang), a: tr('faq2A', lang) },
    { q: tr('faq3Q', lang), a: tr('faq3A', lang) },
    { q: tr('faq4Q', lang), a: tr('faq4A', lang) },
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          viewport={{ once: true }}
          className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-teal/15 shadow-lg overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-teal" />
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between p-5 sm:p-6 text-left min-h-[56px]"
          >
            <span className="font-semibold text-base sm:text-lg text-deep-navy pr-4">{faq.q}</span>
            <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-teal flex-shrink-0" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-deep-navy/70 text-base leading-relaxed whitespace-pre-line">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default BaFitDPage;
