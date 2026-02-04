import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { SUDAN_CITIES } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    city: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم الكامل مطلوب';
    } else if (formData.name.length < 3) {
      newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }
    
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

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.age) {
      newErrors.age = 'العمر مطلوب';
    } else {
      const age = parseInt(formData.age);
      if (age < 18 || age > 80) {
        newErrors.age = 'العمر يجب أن يكون بين 18 و 80 سنة';
      }
    }
    
    if (!formData.city) {
      newErrors.city = 'المدينة مطلوبة';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'يجب الموافقة على الشروط والأحكام';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: parseInt(formData.age),
      gender: formData.gender,
      city: formData.city,
    });
    
    if (success) {
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'مرحباً بك في مجتمعنا',
      });
      navigate('/profile');
    } else {
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى',
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
              src="https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=1000&fit=crop"
              alt="Sudanese wedding"
              className="w-full h-[700px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sudan-dark/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="font-amiri text-3xl font-bold mb-4">
                انضم إلينا اليوم!
              </h2>
              <p className="text-white/80 leading-relaxed">
                أنشئ حسابك الآن وابدأ رحلة البحث عن شريك حياتك بين آلاف 
                السودانيين المسجلين في منصتنا.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-sudan p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="font-amiri text-3xl font-bold text-sudan-dark mb-2">
              إنشاء حساب جديد
            </h1>
            <p className="text-sudan-dark/60">
              {step === 1 ? 'أدخل بياناتك الأساسية' : 'أكمل بياناتك الشخصية'}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-sudan-brown text-white' : 'bg-sudan-brown/20 text-sudan-dark'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 rounded ${
              step >= 2 ? 'bg-sudan-brown' : 'bg-sudan-brown/20'
            }`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-sudan-brown text-white' : 'bg-sudan-brown/20 text-sudan-dark'
            }`}>
              2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sudan-dark">
                    الاسم الكامل
                  </Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sudan-dark/40" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="محمد أحمد"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`h-12 pr-10 border-sudan-brown/20 focus:border-sudan-gold ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

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

                {/* Next Button */}
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full btn-primary h-12 text-lg"
                >
                  التالي
                  <ChevronLeft className="w-5 h-5 mr-2" />
                </Button>
              </>
            ) : (
              <>
                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sudan-dark">
                      العمر
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sudan-dark/40" />
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className={`h-12 pr-10 border-sudan-brown/20 focus:border-sudan-gold ${
                          errors.age ? 'border-red-500' : ''
                        }`}
                        min="18"
                        max="80"
                      />
                    </div>
                    {errors.age && (
                      <p className="text-red-500 text-sm">{errors.age}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sudan-dark">الجنس</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value: 'male' | 'female') => 
                        setFormData({ ...formData, gender: value })
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">ذكر</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">أنثى</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sudan-dark">
                    المدينة
                  </Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData({ ...formData, city: value })}
                  >
                    <SelectTrigger className={`h-12 border-sudan-brown/20 focus:border-sudan-gold ${
                      errors.city ? 'border-red-500' : ''
                    }`}>
                      <SelectValue placeholder="اختر مدينتك" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUDAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city}</p>
                  )}
                </div>

                {/* Terms */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeTerms: checked as boolean })
                      }
                      className={errors.agreeTerms ? 'border-red-500' : ''}
                    />
                    <Label htmlFor="terms" className="text-sm text-sudan-dark/70 cursor-pointer leading-relaxed">
                      أوافق على{' '}
                      <button type="button" onClick={() => toast({ title: 'قريباً', description: 'سيتم إضافة هذه الميزة قريباً' })} className="text-sudan-brown hover:underline">
                        شروط الاستخدام
                      </button>{' '}
                      و{' '}
                      <button type="button" onClick={() => toast({ title: 'قريباً', description: 'سيتم إضافة هذه الميزة قريباً' })} className="text-sudan-brown hover:underline">
                        سياسة الخصوصية
                      </button>
                    </Label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-sm">{errors.agreeTerms}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12 border-sudan-brown/20"
                  >
                    <ChevronRight className="w-5 h-5 ml-2" />
                    السابق
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-primary h-12 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      'إنشاء حساب'
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-sudan-dark/70 mt-6">
            لديك حساب؟{' '}
            <button onClick={() => navigate('/login')} className="text-sudan-brown hover:underline font-medium">
              سجل دخولك
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
