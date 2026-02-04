import { useState, useEffect } from 'react';
import { Heart, MapPin, Briefcase, GraduationCap, Star, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { SUDAN_CITIES, INTERESTS, type User } from '@/types';

export default function Browse() {
  const { user } = useAuth();
  const { getFilteredUsers, getRecommendations, sendMatchRequest, filters, setFilters } = useUsers();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [recommendations, setRecommendations] = useState<{ user: User; compatibilityScore: number }[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [ageRange, setAgeRange] = useState<[number, number]>(filters.ageRange);

  useEffect(() => {
    if (user) {
      const filtered = getFilteredUsers(user.id);
      setUsers(filtered);
      
      const recs = getRecommendations(user.id);
      setRecommendations(recs.slice(0, 3));
    }
  }, [user, filters]);

  const handleAgeChange = (value: number[]) => {
    setAgeRange([value[0], value[1]]);
    setFilters({ ageRange: [value[0], value[1]] });
  };

  const handleCityToggle = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city];
    setFilters({ cities: newCities });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = filters.interests.includes(interest)
      ? filters.interests.filter(i => i !== interest)
      : [...filters.interests, interest];
    setFilters({ interests: newInterests });
  };

  const handleLike = async (targetUserId: string) => {
    if (!user) return;
    
    const success = await sendMatchRequest(user.id, targetUserId);
    
    if (success) {
      toast({
        title: 'تم إرسال الإعجاب',
        description: 'سيتم إخطارك عند قبول الطلب',
      });
    } else {
      toast({
        title: 'تم الإرسال مسبقاً',
        description: 'لقد أرسلت طلب إعجاب لهذا الشخص من قبل',
      });
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Age Range */}
      <div>
        <h4 className="font-semibold text-sudan-dark mb-4">العمر</h4>
        <Slider
          value={ageRange}
          onValueChange={handleAgeChange}
          min={18}
          max={80}
          step={1}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-sudan-dark/60">
          <span>{ageRange[0]} سنة</span>
          <span>{ageRange[1]} سنة</span>
        </div>
      </div>

      {/* Cities */}
      <div>
        <h4 className="font-semibold text-sudan-dark mb-4">المدينة</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {SUDAN_CITIES.slice(0, 10).map((city) => (
            <div key={city} className="flex items-center gap-2">
              <Checkbox
                id={`city-${city}`}
                checked={filters.cities.includes(city)}
                onCheckedChange={() => handleCityToggle(city)}
              />
              <Label htmlFor={`city-${city}`} className="text-sm cursor-pointer">
                {city}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h4 className="font-semibold text-sudan-dark mb-4">الاهتمامات</h4>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.slice(0, 8).map((interest) => (
            <Badge
              key={interest}
              variant={filters.interests.includes(interest) ? 'default' : 'outline'}
              className={`cursor-pointer ${
                filters.interests.includes(interest)
                  ? 'bg-sudan-brown hover:bg-sudan-brown/90'
                  : 'hover:bg-sudan-brown/10'
              }`}
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        className="w-full border-sudan-brown/20"
        onClick={() => {
          setAgeRange([18, 80]);
          setFilters({
            ageRange: [18, 80],
            cities: [],
            education: [],
            religion: [],
            interests: [],
          });
        }}
      >
        إعادة ضبط الفلاتر
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-sudan-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-amiri text-3xl font-bold text-sudan-dark mb-2">
              اكتشف شريك حياتك
            </h1>
            <p className="text-sudan-dark/60">
              {users.length} عضو متوافق مع معاييرك
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden border-sudan-brown/20">
                <Filter className="w-4 h-4 ml-2" />
                فلترة
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white">
              <div className="py-6">
                <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-6">فلترة النتائج</h3>
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-sudan-gold" />
              <h2 className="font-amiri text-xl font-bold text-sudan-dark">توصيات ذكية لك</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map(({ user: recUser, compatibilityScore }) => (
                <div key={recUser.id} className="card-sudan relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sudan-brown to-sudan-gold" />
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-sudan-gold">
                      <AvatarImage src={recUser.profileImage} alt={recUser.name} />
                      <AvatarFallback className="bg-sudan-brown text-white">
                        {recUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sudan-dark">{recUser.name}</h3>
                      <p className="text-sm text-sudan-dark/60">{recUser.age} سنة • {recUser.city}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-sudan-gold fill-sudan-gold" />
                        <span className="text-sm font-medium text-sudan-brown">{compatibilityScore}% توافق</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 btn-primary"
                      onClick={() => handleLike(recUser.id)}
                    >
                      <Heart className="w-4 h-4 ml-1" />
                      مهتم
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-sudan-brown/20"
                      onClick={() => toast({ title: 'قريباً', description: 'سيتم إضافة هذه الميزة قريباً' })}
                    >
                      عرض الملف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sudan p-6 sticky top-24">
              <h3 className="font-amiri text-lg font-bold text-sudan-dark mb-6">فلترة النتائج</h3>
              <FilterContent />
            </div>
          </div>

          {/* Users Grid */}
          <div className="flex-1">
            {users.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sudan-brown/10 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-sudan-brown" />
                </div>
                <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-2">
                  لا يوجد أعضاء متطابقين
                </h3>
                <p className="text-sudan-dark/60 max-w-md mx-auto">
                  جرب تعديل معايير البحث أو إزالة بعض الفلاتر لرؤية المزيد من الأعضاء
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((userItem) => (
                  <div key={userItem.id} className="card-sudan group">
                    {/* Image */}
                    <div className="relative mb-4">
                      <img
                        src={userItem.profileImage}
                        alt={userItem.name}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      {userItem.isOnline && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                      {userItem.isVerified && (
                        <div className="absolute top-3 left-3 w-8 h-8 bg-sudan-gold rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-amiri text-lg font-bold text-sudan-dark">
                          {userItem.name}
                        </h3>
                        <span className="text-sudan-brown font-medium">{userItem.age} سنة</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sudan-dark/60 text-sm">
                        <MapPin className="w-4 h-4" />
                        {userItem.city}
                      </div>

                      {userItem.occupation && (
                        <div className="flex items-center gap-1 text-sudan-dark/60 text-sm">
                          <Briefcase className="w-4 h-4" />
                          {userItem.occupation}
                        </div>
                      )}

                      {userItem.education && (
                        <div className="flex items-center gap-1 text-sudan-dark/60 text-sm">
                          <GraduationCap className="w-4 h-4" />
                          {userItem.education}
                        </div>
                      )}

                      {/* Interests */}
                      <div className="flex flex-wrap gap-1 pt-2">
                        {userItem.interests.slice(0, 3).map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs bg-sudan-brown/10 text-sudan-brown">
                            {interest}
                          </Badge>
                        ))}
                        {userItem.interests.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{userItem.interests.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          className="flex-1 btn-primary"
                          onClick={() => handleLike(userItem.id)}
                        >
                          <Heart className="w-4 h-4 ml-1" />
                          مهتم
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-sudan-brown/20"
                          onClick={() => toast({ title: 'قريباً', description: 'سيتم إضافة هذه الميزة قريباً' })}
                        >
                          عرض الملف
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
