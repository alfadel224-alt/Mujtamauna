import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sudan-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sudan-gradient flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-amiri text-xl font-bold">مجتمعنا</span>
            </button>
            <p className="text-white/70 text-sm leading-relaxed">
              منصة موثوقة تجمع بين التقاليد السودانية الأصيلة والتقنية الحديثة 
              لمساعدتك في إيجاد شريك حياتك المناسب.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {}}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sudan-gold transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => {}}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sudan-gold transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => {}}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sudan-gold transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-amiri text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { label: 'الرئيسية', path: '/' },
                { label: 'تصفح الأعضاء', path: '/browse' },
                { label: 'قصص النجاح', path: '/' },
                { label: 'عن الموقع', path: '/' },
                { label: 'اتصل بنا', path: '/' },
              ].map((link) => (
                <li key={link.path + link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-white/70 hover:text-sudan-gold transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-amiri text-lg font-bold mb-4">الدعم والمساعدة</h3>
            <ul className="space-y-2">
              {[
                { label: 'الأسئلة الشائعة', path: '/' },
                { label: 'شروط الاستخدام', path: '/' },
                { label: 'سياسة الخصوصية', path: '/' },
                { label: 'نصائح الأمان', path: '/' },
                { label: 'مركز المساعدة', path: '/' },
              ].map((link) => (
                <li key={link.path + link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-white/70 hover:text-sudan-gold transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-amiri text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-sudan-gold" />
                <span>support@sudanimarriage.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-sudan-gold" />
                <span dir="ltr">+249 123 456 789</span>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-sudan-gold mt-0.5" />
                <span>الخرطوم، السودان</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-right">
              © {currentYear} مجتمعنا. جميع الحقوق محفوظة.
            </p>
            <p className="text-white/60 text-sm text-center md:text-left">
              صنع بـ <Heart className="w-4 h-4 inline text-red-400 mx-1" /> في السودان
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
