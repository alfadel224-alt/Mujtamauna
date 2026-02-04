import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials check
    if (formData.username === 'admin' && formData.password === 'admin123') {
      toast({
        title: 'تم تسجيل الدخول',
        description: 'مرحباً بك في لوحة التحكم الإدارية',
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'اسم المستخدم أو كلمة المرور غير صحيحة',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-sudan-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sudan-gradient flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-amiri text-3xl font-bold text-white mb-2">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-white/60">مجتمعنا - إدارة الموقع</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sudan-lg p-8">
          <div className="text-center mb-6">
            <h2 className="font-amiri text-xl font-bold text-sudan-dark">
              تسجيل دخول المشرف
            </h2>
            <p className="text-sudan-dark/60 text-sm mt-1">
              هذه الصفحة مخصصة للموظفين المعتمدين فقط
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sudan-dark">
                اسم المستخدم
              </Label>
              <div className="relative">
                <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sudan-dark/40" />
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`h-12 pr-10 border-sudan-brown/20 focus:border-sudan-gold ${
                    errors.username ? 'border-red-500' : ''
                  }`}
                  dir="ltr"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
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
                <>
                  <Shield className="w-5 h-5 ml-2" />
                  دخول الإدارة
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-sudan-cream rounded-lg">
            <p className="text-sm text-sudan-dark/70 text-center mb-2">
              بيانات تجريبية للدخول:
            </p>
            <div className="text-center text-sm" dir="ltr">
              <p className="text-sudan-brown">admin / admin123</p>
            </div>
          </div>

          {/* Back Link */}
          <button
            onClick={() => navigate('/')}
            className="w-full text-center text-sudan-dark/60 hover:text-sudan-brown mt-4 text-sm"
          >
            العودة للموقع الرئيسي
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-white/40 text-sm">
            <Shield className="w-4 h-4" />
            <span>جميع محاولات الدخول مسجلة ومراقبة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
