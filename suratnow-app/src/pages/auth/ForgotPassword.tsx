import { useState } from 'react';
import { Link } from 'react-router';
import api, { ensureCsrfCookie } from '../../lib/api';
import { AnimatedPage } from '../../components/AnimatedPage';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      await ensureCsrfCookie();
      const response = await api.post('/password/forgot', { email });
      setMessage(response.data.message);
    } catch {
      setMessage('Permintaan diterima. Jika email terdaftar, tautan akan dikirim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lupa Password</h1>
          <p className="mt-2 text-sm text-slate-500">Masukkan email akun untuk menerima tautan pengaturan password.</p>
        </div>
        <input data-testid="forgot-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        {message && <p data-testid="forgot-message" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{message}</p>}
        <button data-testid="forgot-submit" disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 font-medium text-white disabled:opacity-60">{isSubmitting ? 'Mengirim...' : 'Kirim Tautan'}</button>
        <Link to="/login" className="block text-center text-sm text-primary hover:underline">Kembali ke login</Link>
      </form>
    </AnimatedPage>
  );
}
