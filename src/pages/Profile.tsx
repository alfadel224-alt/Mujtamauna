import { useState, useRef } from 'react';
import { Camera, MapPin, Briefcase, Edit2, Save, X, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { INTERESTS, SUDAN_CITIES, EDUCATION_LEVELS, RELIGION_LEVELS } from '@/types';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);

  if (!user) {
    return (
      <div className="min-h-screen bg-sudan-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-sudan-dark/60">يرجى تسجيل الدخول أولاً</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateUser({
      ...editedUser,
      interests: selectedInterests,
    });
    setIsEditing(false);
    toast({
      title: 'تم الحفظ',
      description: 'تم تحديث ملفك الشخصي بنجاح',
    });
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => prev ? { ...prev, profileImage: reader.result as string } : prev);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-sudan-cream pb-12">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={user.coverImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sudan-dark/60 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sudan p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg">
                <AvatarImage src={isEditing ? editedUser?.profileImage : user.profileImage} alt={user.name} />
                <AvatarFallback className="bg-sudan-brown text-white text-4xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-sudan-brown text-white rounded-full flex items-center justify-center hover:bg-sudan-brown/90 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              
              {/* Online Status */}
              <div className="absolute bottom-2 left-2 w-5 h-5 bg-green-500 rounded-full border-3 border-white" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-right">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h1 className="font-amiri text-2xl md:text-3xl font-bold text-sudan-dark">
                      {isEditing ? editedUser?.name : user.name}
                    </h1>
                    {user.isVerified && (
                      <div className="w-6 h-6 bg-sudan-gold rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sudan-dark/70">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {isEditing ? (
                        <select
                          value={editedUser?.city}
                          onChange={(e) => setEditedUser(prev => prev ? { ...prev, city: e.target.value } : prev)}
                          className="border border-sudan-brown/20 rounded px-2 py-1"
                        >
                          {SUDAN_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      ) : (
                        user.city
                      )}
                    </span>
                    <span>•</span>
                    <span>{user.age} سنة</span>
                    {user.occupation && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {isEditing ? (
                            <Input
                              value={editedUser?.occupation || ''}
                              onChange={(e) => setEditedUser(prev => prev ? { ...prev, occupation: e.target.value } : prev)}
                              className="w-32 h-8"
                            />
                          ) : (
                            user.occupation
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedUser(user);
                          setSelectedInterests(user.interests);
                        }}
                      >
                        <X className="w-4 h-4 ml-1" />
                        إلغاء
                      </Button>
                      <Button
                        size="sm"
                        className="btn-primary"
                        onClick={handleSave}
                      >
                        <Save className="w-4 h-4 ml-1" />
                        حفظ
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-sudan-brown/20"
                    >
                      <Edit2 className="w-4 h-4 ml-1" />
                      تعديل الملف
                    </Button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                {isEditing ? (
                  <Textarea
                    value={editedUser?.bio || ''}
                    onChange={(e) => setEditedUser(prev => prev ? { ...prev, bio: e.target.value } : prev)}
                    placeholder="اكتب نبذة عن yourself..."
                    className="w-full"
                    rows={3}
                  />
                ) : (
                  <p className="text-sudan-dark/70 leading-relaxed">
                    {user.bio || 'لا يوجد نبذة'}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-sudan-brown">0</p>
                  <p className="text-sm text-sudan-dark/60">تطابق</p>
                </div>
                <div className="w-px h-10 bg-sudan-brown/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-sudan-brown">0</p>
                  <p className="text-sm text-sudan-dark/60">إعجاب</p>
                </div>
                <div className="w-px h-10 bg-sudan-brown/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-sudan-brown">{user.interests.length}</p>
                  <p className="text-sm text-sudan-dark/60">اهتمام</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-white shadow-sudan p-1 rounded-xl">
            <TabsTrigger value="about" className="rounded-lg data-[state=active]:bg-sudan-brown data-[state=active]:text-white">
              عني
            </TabsTrigger>
            <TabsTrigger value="interests" className="rounded-lg data-[state=active]:bg-sudan-brown data-[state=active]:text-white">
              اهتماماتي
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-lg data-[state=active]:bg-sudan-brown data-[state=active]:text-white">
              معاييري
            </TabsTrigger>
            <TabsTrigger value="photos" className="rounded-lg data-[state=active]:bg-sudan-brown data-[state=active]:text-white">
              الصور
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="bg-white rounded-2xl shadow-sudan p-6 md:p-8">
              <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-6">معلوماتي</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sudan-dark/60">التعليم</Label>
                  {isEditing ? (
                    <select
                      value={editedUser?.education || ''}
                      onChange={(e) => setEditedUser(prev => prev ? { ...prev, education: e.target.value } : prev)}
                      className="w-full mt-1 border border-sudan-brown/20 rounded-lg px-3 py-2"
                    >
                      <option value="">اختر</option>
                      {EDUCATION_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium text-sudan-dark">{user.education || 'غير محدد'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sudan-dark/60">الدين</Label>
                  {isEditing ? (
                    <select
                      value={editedUser?.religion || ''}
                      onChange={(e) => setEditedUser(prev => prev ? { ...prev, religion: e.target.value } : prev)}
                      className="w-full mt-1 border border-sudan-brown/20 rounded-lg px-3 py-2"
                    >
                      <option value="">اختر</option>
                      {RELIGION_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium text-sudan-dark">{user.religion || 'غير محدد'}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sudan-dark/60">المهنة</Label>
                  <p className="font-medium text-sudan-dark">{user.occupation || 'غير محدد'}</p>
                </div>

                <div>
                  <Label className="text-sudan-dark/60">تاريخ الانضمام</Label>
                  <p className="font-medium text-sudan-dark">
                    {new Date(user.createdAt).toLocaleDateString('ar-SD')}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Interests Tab */}
          <TabsContent value="interests">
            <div className="bg-white rounded-2xl shadow-sudan p-6 md:p-8">
              <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-6">اهتماماتي</h3>
              
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                      className={`cursor-pointer text-sm py-2 px-4 ${
                        selectedInterests.includes(interest)
                          ? 'bg-sudan-brown hover:bg-sudan-brown/90'
                          : 'hover:bg-sudan-brown/10'
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {selectedInterests.includes(interest) && (
                        <Check className="w-3 h-3 ml-1" />
                      )}
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.interests.length > 0 ? (
                    user.interests.map((interest) => (
                      <Badge
                        key={interest}
                        className="bg-sudan-brown/10 text-sudan-brown text-sm py-2 px-4"
                      >
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sudan-dark/60">لم تضف أي اهتمامات بعد</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="bg-white rounded-2xl shadow-sudan p-6 md:p-8">
              <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-6">معايير البحث</h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sudan-dark/60 mb-2 block">العمر المفضل</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sudan-brown font-medium">20 - 35 سنة</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sudan-dark/60 mb-2 block">المدن المفضلة</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">الخرطوم</Badge>
                    <Badge variant="secondary">أم درمان</Badge>
                    <Badge variant="secondary">بحري</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sudan-dark/60 mb-2 block">المستوى التعليمي</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">بكالوريوس</Badge>
                    <Badge variant="secondary">ماجستير</Badge>
                  </div>
                </div>

                <Button variant="outline" className="border-sudan-brown/20">
                  <Edit2 className="w-4 h-4 ml-2" />
                  تعديل المعايير
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <div className="bg-white rounded-2xl shadow-sudan p-6 md:p-8">
              <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-6">صوري</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-sudan-cream flex items-center justify-center">
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button className="aspect-square rounded-xl border-2 border-dashed border-sudan-brown/30 flex flex-col items-center justify-center gap-2 hover:border-sudan-brown hover:bg-sudan-brown/5 transition-colors">
                  <Plus className="w-8 h-8 text-sudan-brown/50" />
                  <span className="text-sm text-sudan-brown/50">إضافة صورة</span>
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
