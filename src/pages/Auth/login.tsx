
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import './auth-pages.css';

const AuthPage = () => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const result = await signIn(loginEmail, loginPassword);
      if (result?.error) {
        toast.error('Failed to sign in', {
          description: result.error.message || 'Please check your credentials and try again.'
        });
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoginLoading(false);
    }
  };

  // Signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSignupLoading(true);
    try {
      const result = await signUp(signupEmail, signupPassword);
      if (result?.error) {
        toast.error('Failed to sign up', {
          description: result.error.message || 'Please check your information and try again.'
        });
      } else {
        toast.success('Account created! Check your email to confirm your registration.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSignupLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page min-h-screen flex overflow-hidden">
      {/* Mobile background (only visible on mobile) */}
      <div className="mobile-bg-container md:hidden">
        {/* Removed Lovable image */}
      </div>
      {/* Left section - Form content */}
      <div className="w-full md:w-1/4 p-6 flex flex-col justify-center items-center relative z-10 auth-container">
        <div className="w-full max-w-xl relative"> {/* Increased width to max-w-xl */}
          {/* Theme Toggler - Now outside the card, top-right of this container */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="absolute top-4 right-4 z-20"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {/* Mobile only branding */}
          <div className="mobile-branding md:hidden">
            <h1 className="font-unbounded solvynai-title-mobile text-[var(--auth-primary)] mb-2">SolvynAI</h1>
          </div>
          <div className="auth-card bg-card p-8 rounded-xl shadow-sm border relative">
            {/* New Tab Switcher Structure */}
            <div className="flex justify-center mb-6">
              <div className="relative flex p-1 bg-muted rounded-lg">
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${tab === 'login' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                  onClick={() => setTab('login')}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${tab === 'signup' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                  onClick={() => setTab('signup')}
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            </div>
            {tab === 'login' ? (
              <>
                <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Link to="/forgot-password" className="text-sm auth-link hover:underline">Forgot password?</Link>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full auth-button" disabled={loginLoading}>
                    {loginLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={e => setSignupConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full auth-button" disabled={signupLoading}>
                    {signupLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </>
            )}
          </div>
          {/* Text removed as per request */}
        </div>
      </div>
      {/* Right section - Image */}
      <div className="w-full md:w-3/4 relative hidden md:block">
        <div className="h-full image-container">
          <img 
            src="/lovable-uploads/a3d6742c-06c7-4235-9d56-289c8d5bdd1e.png" 
            alt="Peaceful sunset with tree and silhouette" 
            className="w-full h-full object-cover scale-x-[-1]" 
          />
          <div className="image-branding centered-branding">
            <h1 className="font-unbounded solvynai-title-desktop mb-4">SolvynAI</h1>
            <p className="text-white/90 text-2xl font-medium">by SolvynAI tech</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
