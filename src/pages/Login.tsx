import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await login({
      email: formData.email,
      password: formData.password,
    });
    
    if (success) {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في مجتمعنا',
      });
      navigate('/browse');
    } else {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-sudan-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Image */}
        <div className="hidden lg:block relative">
          <div className="relative rounded-3xl overflow-hidden shadow-sudan-lg">
            <img
              src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=1000&fit=crop"
              alt="Sudanese pattern"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sudan-dark/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="font-amiri text-3xl font-bold mb-4">
                مرحباً بعودتك!
              </h2>
              <p className="text-white/80 leading-relaxed">
                سعداء بعودتك إلى منصة مجتمعنا. سجل دخولك واستمر في رحلة 
                البحث عن شريك حياتك.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-sudan p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="font-amiri text-3xl font-bold text-sudan-dark mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-sudan-dark/60">
              أدخل بياناتك للوصول إلى حسابك
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sudan-dark">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sudan-dark/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`h-12 pr-10 border-sudan-brown/20 focus:border-sudan-gold ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sudan-dark">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sudan-dark/40" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`h-12 pr-10 pl-10 border-sudan-brown/20 focus:border-sudan-gold ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sudan-dark/40 hover:text-sudan-dark"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm text-sudan-dark/70 cursor-pointer">
                  تذكرني
                </Label>
              </div>
              <button
                type="button"
                onClick={() => toast({ title: 'قريباً', description: 'سيتم إضافة هذه الميزة قريباً' })}
                className="text-sm text-sudan-brown hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full btn-primary h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-sudan-cream rounded-lg">
            <p className="text-sm text-sudan-dark/70 text-center mb-2">
              بيانات تجريبية للدخول:
            </p>
            <div className="text-center text-sm" dir="ltr">
              <p className="text-sudan-brown">ahmed@example.com</p>
              <p className="text-sudan-dark/60">أي كلمة مرور</p>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sudan-dark/70 mt-6">
            ليس لديك حساب؟{' '}
            <button onClick={() => navigate('/register')} className="text-sudan-brown hover:underline font-medium">
              سجل الآن
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
