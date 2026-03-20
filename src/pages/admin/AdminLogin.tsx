import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminLogin() {
  const { signIn, user } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  // Already logged in
  if (user) { navigate('/admin'); return null; }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error.includes('Invalid') ? 'Incorrect email or password.' : result.error);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  }

  return (
    <div className="min-h-screen bg-[#020c14] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
              <span className="font-headline text-white font-bold text-lg">B</span>
            </div>
            <span className="font-headline text-2xl text-white tracking-wide">BaFitD</span>
          </div>
          <p className="text-gray-400 text-sm">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl p-8">
          <h1 className="text-white font-semibold text-xl mb-6">Sign in</h1>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full bg-[#020c14] border border-[#1a3a52] rounded-lg px-4 py-3
                           text-white placeholder-gray-600 text-sm
                           focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#020c14] border border-[#1a3a52] rounded-lg px-4 py-3
                           text-white placeholder-gray-600 text-sm
                           focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          BaFitD · Batswana and Friends in the Diaspora
        </p>
      </div>
    </div>
  );
}
