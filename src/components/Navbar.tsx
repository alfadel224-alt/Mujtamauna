import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Users, User, Menu, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isAuthenticated ? [
    { path: '/', label: 'الرئيسية', icon: Heart },
    { path: '/browse', label: 'تصفح', icon: Users },
    { path: '/chat', label: 'محادثات', icon: MessageCircle },
    { path: '/profile', label: 'ملفي', icon: User },
  ] : [
    { path: '/', label: 'الرئيسية', icon: Heart },
    { path: '/about', label: 'عن الموقع', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sudan'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-sudan-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className={`font-amiri text-xl lg:text-2xl font-bold transition-colors ${
              isScrolled ? 'text-sudan-brown' : 'text-sudan-brown'
            }`}>
              مجتمعنا
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-sudan-brown/10 text-sudan-brown'
                      : 'text-sudan-dark/70 hover:text-sudan-brown hover:bg-sudan-brown/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-sudan-dark/70 hover:text-sudan-brown hover:bg-sudan-brown/10"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* User Avatar */}
                <button onClick={() => navigate('/profile')} className="hidden sm:block">
                  <Avatar className="w-9 h-9 border-2 border-sudan-gold cursor-pointer hover:scale-105 transition-transform">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="bg-sudan-brown text-white">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hidden sm:flex text-sudan-dark/70 hover:text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-sudan-brown hover:text-sudan-brown hover:bg-sudan-brown/10"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="btn-primary"
                >
                  إنشاء حساب
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-sudan-brown"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-sudan-cream">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between py-4 border-b border-sudan-brown/10">
                    <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-sudan-gradient flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-amiri text-xl font-bold text-sudan-brown">
                        مجتمعنا
                      </span>
                    </button>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 py-6">
                    <div className="space-y-2">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        
                        return (
                          <button
                            key={link.path}
                            onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                              isActive
                                ? 'bg-sudan-brown text-white'
                                : 'text-sudan-dark hover:bg-sudan-brown/10'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{link.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Footer */}
                  <div className="py-4 border-t border-sudan-brown/10">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 px-4">
                          <Avatar className="w-12 h-12 border-2 border-sudan-gold">
                            <AvatarImage src={user?.profileImage} alt={user?.name} />
                            <AvatarFallback className="bg-sudan-brown text-white">
                              {user?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sudan-dark">{user?.name}</p>
                            <p className="text-sm text-sudan-dark/60">{user?.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full border-red-300 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 ml-2" />
                          تسجيل الخروج
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          className="w-full btn-primary"
                          onClick={() => {
                            navigate('/register');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          إنشاء حساب
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-sudan-gold text-sudan-brown hover:bg-sudan-brown/10"
                          onClick={() => {
                            navigate('/login');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          تسجيل الدخول
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
