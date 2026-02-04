import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, MessageCircle, Sparkles, ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect for hero section
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'توافق ذكي',
      description: 'ذكاء اصطناعي يفهم قيمك وتقاليدك ويساعدك في إيجاد الشريك المناسب',
    },
    {
      icon: Shield,
      title: 'خصوصية تامة',
      description: 'حماية كاملة لبياناتك الشخصية ومحادثاتك مع نظام تشفير متقدم',
    },
    {
      icon: MessageCircle,
      title: 'تواصل آمن',
      description: 'محادثات نصية ومكالمات فيديو مشفرة وآمنة مع الأعضاء الموثقين',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'أنشئ ملفك',
      description: 'أضف صورك ومعلوماتك واهتماماتك بخطوات بسيطة',
    },
    {
      number: '02',
      title: 'اكتشف',
      description: 'تصفح الملفات المتوافقة معك حسب معاييرك وتفضيلاتك',
    },
    {
      number: '03',
      title: 'تواصل',
      description: 'ابدأ محادثة آمنة مع من يعجبك وتعرف عليهم أكثر',
    },
    {
      number: '04',
      title: 'التقِ',
      description: 'قابل شريك حياتك وابدأ رحلة الحب والزواج',
    },
  ];

  const successStories = [
    {
      name: 'أحمد وفاطمة',
      location: 'الخرطوم',
      quote: 'التقينا عبر الموقع ووجدنا التوافق الكبير بيننا. الآن نحن متزوجون وسعداء جداً',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
    },
    {
      name: 'عمر ومريم',
      location: 'بورتسودان',
      quote: 'الموقع ساعدنا كثيراً في التعرف على بعض قبل اللقاء الحقيقي',
      image: 'https://images.unsplash.com/photo-1621624666561-84d034f7e03a?w=400&h=400&fit=crop',
    },
    {
      name: 'خالد ونورا',
      location: 'كسلا',
      quote: 'نظام التوافق الذكي فعلاً يعمل! وجدنا اهتمامات مشتركة كثيرة',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-sudan-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          ref={heroRef}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-sudan-cream via-sudan-cream/90 to-sudan-cream/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sudan-brown/10 rounded-full">
                <Star className="w-4 h-4 text-sudan-gold" />
                <span className="text-sm text-sudan-brown font-medium">
                  أكثر من 10,000 زواج ناجح
                </span>
              </div>

              <h1 className="font-amiri text-4xl md:text-5xl lg:text-6xl font-bold text-sudan-dark leading-tight">
                اكتشف شريك حياتك
                <span className="block text-sudan-brown">بين أهلك وناسك</span>
              </h1>

              <p className="text-lg text-sudan-dark/70 max-w-lg leading-relaxed">
                منصة موثوقة تجمع بين التقاليد السودانية الأصيلة والتقنية الحديثة 
                لمساعدتك في إيجاد شريك حياتك المناسب
              </p>

              {isAuthenticated ? (
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigate('/browse')}
                    className="btn-primary text-lg px-8"
                  >
                    ابدأ التصفح
                    <ChevronLeft className="w-5 h-5 mr-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    className="border-sudan-gold text-sudan-brown hover:bg-sudan-gold/10 text-lg px-8"
                  >
                    ملفي الشخصي
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigate('/register')}
                    className="btn-primary text-lg px-8"
                  >
                    ابدأ رحلتك
                    <ChevronLeft className="w-5 h-5 mr-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="border-sudan-gold text-sudan-brown hover:bg-sudan-gold/10 text-lg px-8"
                  >
                    تسجيل الدخول
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-sudan-brown">50K+</p>
                  <p className="text-sm text-sudan-dark/60">عضو نشط</p>
                </div>
                <div className="w-px h-12 bg-sudan-brown/20" />
                <div>
                  <p className="text-3xl font-bold text-sudan-brown">10K+</p>
                  <p className="text-sm text-sudan-dark/60">زواج ناجح</p>
                </div>
                <div className="w-px h-12 bg-sudan-brown/20" />
                <div>
                  <p className="text-3xl font-bold text-sudan-brown">98%</p>
                  <p className="text-sm text-sudan-dark/60">رضا العملاء</p>
                </div>
              </div>
            </div>

            {/* Right Content - Quick Register Form */}
            {!isAuthenticated && (
              <div className="hidden lg:block animate-slide-in-right">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sudan-lg max-w-md mr-auto">
                  <div className="text-center mb-6">
                    <h3 className="font-amiri text-2xl font-bold text-sudan-dark mb-2">
                      سجل مجاناً
                    </h3>
                    <p className="text-sudan-dark/60 text-sm">
                      انضم إلينا وابحث عن شريك حياتك
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/register'); }}>
                    <div>
                      <Input
                        type="text"
                        placeholder="الاسم الكامل"
                        className="h-12 border-sudan-brown/20 focus:border-sudan-gold"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        className="h-12 border-sudan-brown/20 focus:border-sudan-gold"
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="كلمة المرور"
                        className="h-12 border-sudan-brown/20 focus:border-sudan-gold"
                      />
                    </div>
                    <Button type="submit" className="w-full btn-primary h-12 text-lg">
                      إنشاء حساب
                    </Button>
                  </form>

                  <p className="text-center text-sm text-sudan-dark/60 mt-4">
                    لديك حساب؟{' '}
                    <button onClick={() => navigate('/login')} className="text-sudan-brown hover:underline">
                      تسجيل الدخول
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 pattern-islamic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-amiri text-3xl md:text-4xl font-bold text-sudan-dark mb-4">
              لماذا تختار <span className="text-sudan-brown">مجتمعنا</span>؟
            </h2>
            <p className="text-sudan-dark/70 max-w-2xl mx-auto">
              نقدم لك تجربة فريدة تجمع بين الأصالة والحداثة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-sudan card-tilt text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sudan-brown/10 flex items-center justify-center group-hover:bg-sudan-brown group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-8 h-8 text-sudan-brown group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sudan-dark/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-amiri text-3xl md:text-4xl font-bold text-sudan-dark mb-4">
              كيف يعمل <span className="text-sudan-brown">الموقع</span>؟
            </h2>
            <p className="text-sudan-dark/70 max-w-2xl mx-auto">
              أربع خطوات بسيطة تفصلك عن إيجاد شريك حياتك
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sudan-gradient flex items-center justify-center shadow-gold">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sudan-dark/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-l from-sudan-gold to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-sudan-brown/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-amiri text-3xl md:text-4xl font-bold text-sudan-dark mb-4">
              قصص <span className="text-sudan-brown">حب حقيقية</span>
            </h2>
            <p className="text-sudan-dark/70 max-w-2xl mx-auto">
              قصص نجاح من أزواج وجدوا بعضهم عبر موقعنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="card-sudan group">
                <div className="relative mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-12 rounded-full bg-sudan-gradient flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-1">
                    {story.name}
                  </h3>
                  <p className="text-sudan-gold text-sm mb-4">{story.location}</p>
                  <p className="text-sudan-dark/70 text-sm leading-relaxed italic">
                    "{story.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-sudan-gradient p-12 md:p-20 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
            
            <div className="relative z-10">
              <h2 className="font-amiri text-3xl md:text-5xl font-bold text-white mb-6">
                جاهز تلقى حب حياتك؟
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
                انضم إلى آلاف السودانيين الذين وجدوا شريك حياتهم عبر منصتنا
              </p>
              <Button
                size="lg"
                onClick={() => navigate(isAuthenticated ? '/browse' : '/register')}
                className="bg-white text-sudan-brown hover:bg-white/90 text-lg px-12 py-6 h-auto animate-pulse-slow"
              >
                {isAuthenticated ? 'ابدأ التصفح' : 'سجل مجاناً الآن'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
