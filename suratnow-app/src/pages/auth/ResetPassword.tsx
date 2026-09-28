import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import api, { ensureCsrfCookie } from '../../lib/api';
import { AnimatedPage } from '../../components/AnimatedPage';

export function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await ensureCsrfCookie();
      await api.post('/password/reset', {
        email: params.get('email'),
        token: params.get('token'),
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/login', { replace: true });
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Tautan reset tidak valid atau sudah kedaluwarsa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Atur Password Baru</h1>
          <p className="mt-2 text-sm text-slate-500">Gunakan minimal 12 karakter.</p>
        </div>
        <input data-testid="reset-password" type="password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password baru" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <input data-testid="reset-password-confirmation" type="password" required minLength={12} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Ulangi password baru" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        {error && <p data-testid="reset-error" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button data-testid="reset-submit" disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 font-medium text-white disabled:opacity-60">{isSubmitting ? 'Menyimpan...' : 'Simpan Password'}</button>
        <Link to="/login" className="block text-center text-sm text-primary hover:underline">Kembali ke login</Link>
      </form>
    </AnimatedPage>
  );
}
