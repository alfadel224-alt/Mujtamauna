import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Flag, 
  Shield, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search,
  Eye,
  Ban,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock admin data
const MOCK_USERS = [
  { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', age: 28, city: 'الخرطوم', status: 'active', reports: 0, joinedAt: '2024-01-15', isVerified: true },
  { id: '2', name: 'فاطمة علي', email: 'fatima@example.com', age: 24, city: 'أم درمان', status: 'active', reports: 1, joinedAt: '2024-02-20', isVerified: true },
  { id: '3', name: 'عمر خالد', email: 'omar@example.com', age: 30, city: 'بورتسودان', status: 'warning', reports: 3, joinedAt: '2024-03-10', isVerified: false },
  { id: '4', name: 'مريم عثمان', email: 'mariam@example.com', age: 26, city: 'مدني', status: 'banned', reports: 5, joinedAt: '2024-01-05', isVerified: true },
  { id: '5', name: 'خالد إبراهيم', email: 'khaled@example.com', age: 32, city: 'كسلا', status: 'active', reports: 0, joinedAt: '2024-04-01', isVerified: true },
];

const MOCK_REPORTS = [
  { id: '1', reporterId: '2', reportedId: '3', reporterName: 'فاطمة علي', reportedName: 'عمر خالد', reason: 'محتوى غير لائق', status: 'pending', createdAt: '2024-05-20', evidence: 'رسائل مسيئة في المحادثة' },
  { id: '2', reporterId: '1', reportedId: '4', reporterName: 'أحمد محمد', reportedName: 'مريم عثمان', reason: 'صورة مزيفة', status: 'resolved', createdAt: '2024-05-18', evidence: 'الصورة الشخصية مسروقة من حساب آخر' },
  { id: '3', reporterId: '5', reportedId: '3', reporterName: 'خالد إبراهيم', reportedName: 'عمر خالد', reason: 'تحرش', status: 'pending', createdAt: '2024-05-22', evidence: 'رسائل متكررة غير مرغوب فيها' },
  { id: '4', reporterId: '2', reportedId: '5', reporterName: 'فاطمة علي', reportedName: 'خالد إبراهيم', reason: 'كلام بذيء', status: 'dismissed', createdAt: '2024-05-15', evidence: 'لم يثبت التهمة' },
];

const STATS = {
  totalUsers: 5234,
  activeUsers: 3421,
  newUsersToday: 45,
  pendingReports: 12,
  resolvedReports: 156,
  bannedUsers: 23,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [selectedReport, setSelectedReport] = useState<typeof MOCK_REPORTS[0] | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7');

  // Filter users
  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.includes(searchQuery) || 
    user.email.includes(searchQuery) ||
    user.city.includes(searchQuery)
  );

  // Filter reports
  const filteredReports = MOCK_REPORTS.filter(report =>
    report.reporterName.includes(searchQuery) ||
    report.reportedName.includes(searchQuery) ||
    report.reason.includes(searchQuery)
  );

  const handleViewUser = (user: typeof MOCK_USERS[0]) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleViewReport = (report: typeof MOCK_REPORTS[0]) => {
    setSelectedReport(report);
    setShowReportDialog(true);
  };

  const handleBanUser = (user: typeof MOCK_USERS[0]) => {
    setSelectedUser(user);
    setShowBanDialog(true);
  };

  const confirmBan = () => {
    toast({
      title: 'تم حظر المستخدم',
      description: `تم حظر ${selectedUser?.name} لمدة ${banDuration} يوم بسبب: ${banReason}`,
    });
    setShowBanDialog(false);
    setBanReason('');
    setBanDuration('7');
  };

  const handleResolveReport = (_reportId: string, action: 'resolve' | 'dismiss') => {
    toast({
      title: action === 'resolve' ? 'تم معالجة البلاغ' : 'تم رفض البلاغ',
      description: action === 'resolve' ? 'تم اتخاذ الإجراء المناسب' : 'لم يثبت وجود مخالفة',
    });
    setShowReportDialog(false);
  };

  const handleVerifyUser = (_userId: string) => {
    toast({
      title: 'تم التوثيق',
      description: 'تم توثيق حساب المستخدم بنجاح',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      banned: 'bg-red-100 text-red-700',
      pending: 'bg-orange-100 text-orange-700',
      resolved: 'bg-green-100 text-green-700',
      dismissed: 'bg-gray-100 text-gray-700',
    };
    const labels: Record<string, string> = {
      active: 'نشط',
      warning: 'تحذير',
      banned: 'محظور',
      pending: 'معلق',
      resolved: 'محلول',
      dismissed: 'مرفوض',
    };
    return <Badge className={styles[status] || 'bg-gray-100'}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-sudan-cream">
      {/* Admin Header */}
      <div className="bg-sudan-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sudan-gradient flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-amiri text-xl font-bold">لوحة التحكم الإدارية</h1>
                <p className="text-white/60 text-sm">مجتمعنا</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-white/70 hover:text-white"
                onClick={() => navigate('/')}
              >
                <ChevronLeft className="w-4 h-4 ml-2" />
                العودة للموقع
              </Button>
              <Button 
                variant="ghost" 
                className="text-white/70 hover:text-white"
                onClick={() => navigate('/login')}
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white shadow-sudan p-1 rounded-xl mb-8">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-sudan-brown data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 ml-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-sudan-brown data-[state=active]:text-white">
              <Users className="w-4 h-4 ml-2" />
              المستخدمين
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-lg data-[state=active]:bg-sudan-brown data-[state=active]:text-white">
              <Flag className="w-4 h-4 ml-2" />
              البلاغات
              {STATS.pendingReports > 0 && (
                <span className="mr-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {STATS.pendingReports}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="moderation" className="rounded-lg data-[state=active]:bg-sudan-brown data-[state=active]:text-white">
              <Shield className="w-4 h-4 ml-2" />
              المراقبة
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-white rounded-xl shadow-sudan p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sudan-dark/60 text-sm">إجمالي المستخدمين</p>
                    <p className="text-3xl font-bold text-sudan-brown">{STATS.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-sudan-brown/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-sudan-brown" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sudan p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sudan-dark/60 text-sm">المستخدمين النشطين</p>
                    <p className="text-3xl font-bold text-green-600">{STATS.activeUsers.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sudan p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sudan-dark/60 text-sm">مستخدمين جدد اليوم</p>
                    <p className="text-3xl font-bold text-sudan-gold">+{STATS.newUsersToday}</p>
                  </div>
                  <div className="w-12 h-12 bg-sudan-gold/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-sudan-gold" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sudan p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sudan-dark/60 text-sm">البلاغات المعلقة</p>
                    <p className="text-3xl font-bold text-orange-600">{STATS.pendingReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sudan p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sudan-dark/60 text-sm">البلاغات المحلولة</p>
                    <p className="text-3xl font-bold text-green-600">{STATS.resolvedReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sudan p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sudan-dark/60 text-sm">المستخدمين المحظورين</p>
                    <p className="text-3xl font-bold text-red-600">{STATS.bannedUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Ban className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-xl shadow-sudan p-6">
              <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-4">آخر النشاطات</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-sudan-cream rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Ban className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sudan-dark">تم حظر مستخدم جديد</p>
                    <p className="text-sm text-sudan-dark/60">مريم عثمان - مخالفة شروط الاستخدام</p>
                  </div>
                  <span className="text-sm text-sudan-dark/40">منذ ساعتين</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-sudan-cream rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sudan-dark">تم توثيق مستخدم</p>
                    <p className="text-sm text-sudan-dark/60">أحمد محمد - تم التحقق من الهوية</p>
                  </div>
                  <span className="text-sm text-sudan-dark/40">منذ 3 ساعات</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-sudan-cream rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flag className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sudan-dark">بلاغ جديد</p>
                    <p className="text-sm text-sudan-dark/60">فاطمة علي بلغت عن عمر خالد</p>
                  </div>
                  <span className="text-sm text-sudan-dark/40">منذ 5 ساعات</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-white rounded-xl shadow-sudan">
              {/* Search & Filter */}
              <div className="p-6 border-b border-sudan-brown/10">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sudan-dark/40" />
                    <Input
                      placeholder="البحث عن مستخدم..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="warning">تحذير</SelectItem>
                      <SelectItem value="banned">محظور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sudan-cream">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">المستخدم</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">المدينة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">الحالة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">البلاغات</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">تاريخ الانضمام</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sudan-brown/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-sudan-cream/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=8B5A2B&color=fff`} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sudan-dark">{user.name}</p>
                              <p className="text-sm text-sudan-dark/60">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sudan-dark">{user.city}</td>
                        <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-6 py-4">
                          <span className={`${user.reports > 0 ? 'text-red-600 font-medium' : 'text-sudan-dark/60'}`}>
                            {user.reports}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sudan-dark/60">{user.joinedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewUser(user)}>
                              <Eye className="w-4 h-4 text-sudan-brown" />
                            </Button>
                            {!user.isVerified && (
                              <Button variant="ghost" size="icon" onClick={() => handleVerifyUser(user.id)}>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            {user.status !== 'banned' && (
                              <Button variant="ghost" size="icon" onClick={() => handleBanUser(user)}>
                                <Ban className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="bg-white rounded-xl shadow-sudan">
              {/* Search & Filter */}
              <div className="p-6 border-b border-sudan-brown/10">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sudan-dark/40" />
                    <Input
                      placeholder="البحث في البلاغات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="pending">معلق</SelectItem>
                      <SelectItem value="resolved">محلول</SelectItem>
                      <SelectItem value="dismissed">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reports Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sudan-cream">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">المبلغ</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">المبلغ عنه</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">سبب البلاغ</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">الحالة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">التاريخ</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sudan-dark">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sudan-brown/5">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-sudan-cream/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{report.reporterName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sudan-dark">{report.reporterName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{report.reportedName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sudan-dark">{report.reportedName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sudan-dark">{report.reason}</td>
                        <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                        <td className="px-6 py-4 text-sudan-dark/60">{report.createdAt}</td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                            <Eye className="w-4 h-4 ml-2" />
                            عرض
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sudan p-6">
                <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-4">كلمات ممنوعة</h3>
                <p className="text-sudan-dark/60 mb-4">الكلمات التي يتم حظرها تلقائياً في المحادثات</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['كلمة محظورة 1', 'كلمة محظورة 2', 'سب', 'شتم'].map((word) => (
                    <Badge key={word} variant="secondary" className="bg-red-100 text-red-700">
                      {word}
                      <XCircle className="w-3 h-3 mr-1 cursor-pointer" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="إضافة كلمة جديدة..." />
                  <Button className="btn-primary">إضافة</Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sudan p-6">
                <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-4">إعدادات الحظر</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sudan-dark">الحظر التلقائي بعد بلاغات</span>
                    <Select defaultValue="3">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sudan-dark">مدة الحظر الافتراضية</span>
                    <Select defaultValue="7">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">يوم</SelectItem>
                        <SelectItem value="7">أسبوع</SelectItem>
                        <SelectItem value="30">شهر</SelectItem>
                        <SelectItem value="permanent">دائم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sudan p-6 md:col-span-2">
                <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-4">سجل الإجراءات الإدارية</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-sudan-cream rounded-lg">
                    <div className="flex items-center gap-3">
                      <Ban className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-sudan-dark">حظر مستخدم</p>
                        <p className="text-sm text-sudan-dark/60">مريم عثمان - 7 أيام</p>
                      </div>
                    </div>
                    <span className="text-sm text-sudan-dark/40">2024-05-20</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-sudan-cream rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sudan-dark">توثيق مستخدم</p>
                        <p className="text-sm text-sudan-dark/60">أحمد محمد</p>
                      </div>
                    </div>
                    <span className="text-sm text-sudan-dark/40">2024-05-19</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-sudan-cream rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-sudan-dark">تحذير مستخدم</p>
                        <p className="text-sm text-sudan-dark/60">عمر خالد - محتوى غير لائق</p>
                      </div>
                    </div>
                    <span className="text-sm text-sudan-dark/40">2024-05-18</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-amiri text-xl">تفاصيل المستخدم</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${selectedUser.name}&background=8B5A2B&color=fff`} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sudan-dark">{selectedUser.name}</h3>
                  <p className="text-sm text-sudan-dark/60">{selectedUser.email}</p>
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-sudan-dark/60">العمر:</span>
                  <span className="mr-2 text-sudan-dark">{selectedUser.age} سنة</span>
                </div>
                <div>
                  <span className="text-sudan-dark/60">المدينة:</span>
                  <span className="mr-2 text-sudan-dark">{selectedUser.city}</span>
                </div>
                <div>
                  <span className="text-sudan-dark/60">تاريخ الانضمام:</span>
                  <span className="mr-2 text-sudan-dark">{selectedUser.joinedAt}</span>
                </div>
                <div>
                  <span className="text-sudan-dark/60">البلاغات:</span>
                  <span className={`mr-2 ${selectedUser.reports > 0 ? 'text-red-600 font-medium' : 'text-sudan-dark'}`}>
                    {selectedUser.reports}
                  </span>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowUserDialog(false)}>إغلاق</Button>
                {selectedUser.status !== 'banned' && (
                  <Button variant="destructive" onClick={() => { setShowUserDialog(false); handleBanUser(selectedUser); }}>
                    <Ban className="w-4 h-4 ml-2" />
                    حظر
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Details Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-amiri text-xl">تفاصيل البلاغ</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-sudan-cream rounded-lg">
                  <p className="text-sm text-sudan-dark/60 mb-1">المبلغ</p>
                  <p className="font-medium text-sudan-dark">{selectedReport.reporterName}</p>
                </div>
                <div className="p-3 bg-sudan-cream rounded-lg">
                  <p className="text-sm text-sudan-dark/60 mb-1">المبلغ عنه</p>
                  <p className="font-medium text-sudan-dark">{selectedReport.reportedName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-sudan-dark/60 mb-1">سبب البلاغ</p>
                <p className="font-medium text-sudan-dark">{selectedReport.reason}</p>
              </div>
              <div>
                <p className="text-sm text-sudan-dark/60 mb-1">الدليل</p>
                <p className="text-sudan-dark bg-sudan-cream p-3 rounded-lg">{selectedReport.evidence}</p>
              </div>
              <div>
                <p className="text-sm text-sudan-dark/60 mb-1">الحالة</p>
                {getStatusBadge(selectedReport.status)}
              </div>
              {selectedReport.status === 'pending' && (
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => handleResolveReport(selectedReport.id, 'dismiss')}>
                    <XCircle className="w-4 h-4 ml-2" />
                    رفض البلاغ
                  </Button>
                  <Button className="btn-primary" onClick={() => handleResolveReport(selectedReport.id, 'resolve')}>
                    <CheckCircle className="w-4 h-4 ml-2" />
                    قبول واتخاذ إجراء
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-amiri text-xl text-red-600">حظر مستخدم</DialogTitle>
            <DialogDescription>
              سيتم حظر {selectedUser?.name} من استخدام الموقع
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>سبب الحظر</Label>
              <Input 
                placeholder="اكتب سبب الحظر..." 
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div>
              <Label>مدة الحظر</Label>
              <Select value={banDuration} onValueChange={setBanDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">يوم واحد</SelectItem>
                  <SelectItem value="3">3 أيام</SelectItem>
                  <SelectItem value="7">أسبوع</SelectItem>
                  <SelectItem value="30">شهر</SelectItem>
                  <SelectItem value="permanent">حظر دائم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={confirmBan} disabled={!banReason}>
              <Ban className="w-4 h-4 ml-2" />
              تأكيد الحظر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
