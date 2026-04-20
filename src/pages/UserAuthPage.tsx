import { type FormEvent, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, UserRound } from 'lucide-react';
import { useUserAuth } from '../contexts/UserAuthContext';

type AuthMode = 'signin' | 'signup';

const panelClass =
  'w-full max-w-5xl overflow-hidden rounded-[2rem] border border-teal/15 bg-white/85 shadow-[0_24px_100px_rgba(0,47,75,0.12)] backdrop-blur-xl';

export default function UserAuthPage() {
  const { user, signIn, signUp, loading } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTarget = useMemo(() => {
    return (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/card';
  }, [location.state]);

  if (!loading && user) {
    return <Navigate to={redirectTarget} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    if (mode === 'signin') {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error.includes('Invalid') ? 'Incorrect email or password.' : result.error);
        setSubmitting(false);
        return;
      }

      navigate(redirectTarget, { replace: true });
      return;
    }

    const result = await signUp({ email, password, fullName });
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    if (result.needsEmailConfirmation) {
      setNotice('Your account was created. Check your inbox to confirm your email, then sign in.');
      setMode('signin');
      setPassword('');
      setSubmitting(false);
      return;
    }

    navigate('/card', { replace: true });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dff7f3_0%,#f7f5f2_45%,#fff8ef_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className={panelClass}>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <section className="relative overflow-hidden bg-[#05273a] px-6 py-10 text-white sm:px-10 sm:py-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,150,179,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,106,0,0.2),transparent_30%)]" />
              <div className="relative">
                <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/75">
                  Member Access
                </p>
                <h1 className="font-headline text-4xl font-bold leading-tight sm:text-5xl">
                  BaFitIT Card
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
                  Create a member account and maintain one clean profile that carries your personal and professional story.
                </p>

                <div className="mt-10 space-y-4">
                  {[
                    'Personal identity and contact details in one place.',
                    'Professional headline, industry, skills, and expertise for opportunities.',
                    'A secure card each member can update directly.',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal" />
                      <p className="text-sm leading-6 text-white/82">{item}</p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/"
                  className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Back to BaFitD
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            <section className="px-6 py-10 sm:px-10 sm:py-12">
              <div className="mb-8 inline-flex rounded-2xl bg-sand-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === 'signin' ? 'bg-white text-deep-navy shadow-sm' : 'text-deep-navy/55'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === 'signup' ? 'bg-white text-deep-navy shadow-sm' : 'text-deep-navy/55'
                  }`}
                >
                  Create account
                </button>
              </div>

              <div className="mb-8">
                <h2 className="font-headline text-3xl font-bold text-deep-navy">
                  {mode === 'signin' ? 'Welcome back' : 'Set up your account'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-deep-navy/65">
                  {mode === 'signin'
                    ? 'Sign in to view and update your BaFitIT Card.'
                    : 'Start with your account, then fill in your profile card.'}
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {notice && (
                <div className="mb-4 rounded-2xl border border-teal/20 bg-teal/5 px-4 py-3 text-sm text-teal-900">
                  {notice}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-deep-navy">Full name</span>
                    <div className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4">
                      <UserRound className="h-5 w-5 text-deep-navy/45" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={event => setFullName(event.target.value)}
                        required
                        className="w-full bg-transparent py-4 text-deep-navy outline-none placeholder:text-deep-navy/35"
                        placeholder="Goitseone Kgori"
                      />
                    </div>
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-deep-navy">Email</span>
                  <div className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4">
                    <Mail className="h-5 w-5 text-deep-navy/45" />
                    <input
                      type="email"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      required
                      className="w-full bg-transparent py-4 text-deep-navy outline-none placeholder:text-deep-navy/35"
                      placeholder="you@example.com"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-deep-navy">Password</span>
                  <div className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4">
                    <Lock className="h-5 w-5 text-deep-navy/45" />
                    <input
                      type="password"
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-transparent py-4 text-deep-navy outline-none placeholder:text-deep-navy/35"
                      placeholder="At least 6 characters"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl btn-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting
                    ? mode === 'signin'
                      ? 'Signing in...'
                      : 'Creating account...'
                    : mode === 'signin'
                      ? 'Sign in to your card'
                      : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
