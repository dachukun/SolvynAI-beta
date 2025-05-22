
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import './auth-pages.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This is a placeholder for actual password reset functionality
      // that would be implemented with your auth provider
      setTimeout(() => {
        setEmailSent(true);
        toast.success('Password reset email sent!', {
          description: 'Check your inbox for further instructions'
        });
      }, 1500);
    } catch (error) {
      toast.error('Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex overflow-hidden">
      {/* Mobile background (only visible on mobile) */}
      <div className="mobile-bg-container md:hidden">
        {/* Removed Lovable image */}
      </div>
      
      {/* Left section - Form content */}
      <div className="w-full md:w-1/4 p-6 flex flex-col justify-center items-center relative z-10 auth-container">
        <div className="w-full max-w-md">
          {/* Mobile only branding */}
          <div className="mobile-branding md:hidden">
            <h1 className="font-unbounded text-4xl text-[var(--auth-primary)] mb-2">SolvynAI</h1>
          </div>

          <div className="auth-card p-8 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-2 text-center">Reset Password</h2>
            <p className="text-[var(--auth-text-secondary)] text-center mb-6">
              Enter your email to receive a password reset link
            </p>
            
            {emailSent ? (
              <div className="text-center space-y-4">
                <div className="py-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-[var(--auth-primary)]/10 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--auth-primary)]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <p className="text-sm">We've sent a password reset link to <strong>{email}</strong></p>
                </div>
                <Button asChild className="w-full auth-button">
                  <Link to="/login">Return to login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full auth-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Link..." : "Reset Password"}
                </Button>
              </form>
            )}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-[var(--auth-text-secondary)]">
              Remember your password?{' '}
              <Link to="/login" className="auth-link hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right section - Image */}
      <div className="w-full md:w-3/4 relative hidden md:block">
        <div className="h-full image-container">
          {/* Removed Lovable image */}
          <div className="image-branding">
            <h1 className="font-unbounded text-4xl mb-1">SolvynAI</h1>
            <p className="text-white/80">by SolvynAI tech</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
