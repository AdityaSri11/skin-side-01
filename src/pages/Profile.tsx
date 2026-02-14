import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Edit, Heart, MapPin, Users, MessageCircle, Settings, Bell, Bookmark, Calendar as CalendarIcon, LogOut, Save, X, Upload, FileText, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useTrialLookup } from "@/hooks/useTrialLookup";
import { Switch } from "@/components/ui/switch"; 

interface ProfileProps {
  onAIMatchClick?: () => void;
  userRole?: string | null;
  savedMatches?: any;
  onMatchSaved?: () => void;
}

const Profile = ({ onAIMatchClick, userRole, savedMatches: propSavedMatches, onMatchSaved }: ProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [newTestResultFile, setNewTestResultFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savedMatches, setSavedMatches] = useState<any>(propSavedMatches);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const profileTrialNumbers = useMemo(() => {
    const matches = savedMatches?.match_data?.matches || [];
    return matches.map((m: any) => m.trialNumber).filter(Boolean);
  }, [savedMatches]);

  const { trialDetails: profileTrialDetails } = useTrialLookup(profileTrialNumbers);

  // Update local state when prop changes
  useEffect(() => {
    setSavedMatches(propSavedMatches);
  }, [propSavedMatches]);

  const fetchSavedMatches = async (userId: string) => {
    const { data, error } = await supabase
      .from('ai_match_results')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setSavedMatches(data);
      onMatchSaved?.();
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Redirect doctors to dashboard
      if (userRole === 'doctor') {
        navigate('/doctor-dashboard');
        return;
      }
      
      setUser(session.user);
      
      // Fetch user profile data
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (!error && profile) {
        setProfileData(profile);
        setEditedProfile(profile);
      }

      // Fetch saved AI match results
      await fetchSavedMatches(session.user.id);
      
      setLoading(false);
    };

    fetchUserProfile();
  }, [navigate, userRole]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (userRole === 'doctor') {
      navigate('/doctor-auth');
    } else {
      navigate('/');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profileData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile(profileData);
    setNewTestResultFile(null);
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('derm_test_results')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    return fileName;
  };

  const deleteOldFile = async (fileName: string) => {
    if (!fileName) return;
    
    const { error } = await supabase.storage
      .from('derm_test_results')
      .remove([fileName]);
    
    if (error) {
      console.error('Error deleting old file:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editedProfile) return;

    setUploading(true);
    
    try {
      let updatedProfile = { ...editedProfile };

      // Handle test result file upload
      if (newTestResultFile) {
        // Delete old file if it exists
        if (profileData?.recent_test_results) {
          await deleteOldFile(profileData.recent_test_results);
        }

        // Upload new file
        const newFileName = await handleFileUpload(newTestResultFile);
        if (newFileName) {
          updatedProfile.recent_test_results = newFileName;
        }
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updatedProfile)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setProfileData(updatedProfile);
      setIsEditing(false);
      setNewTestResultFile(null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };


  if (loading) {
    return <div className="min-h-screen bg-gradient-trust flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const displayName = profileData ? `${profileData.first_name} ${profileData.last_name}` : 'No name provided';
  const displayEmail = user?.email || '';
  const displayAge = profileData?.date_of_birth ? 
    Math.floor((new Date().getTime() - new Date(profileData.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
    null;
  const displayLocation = profileData?.address || null;
  const displayCondition = profileData?.primary_condition || null;

  return (
    <div className="min-h-screen bg-gradient-trust py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your information and track your clinical trial journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="healthcare">
              <CardContent className="p-6 text-center">
                 <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-foreground mb-1">{displayName}</h2>
                <p className="text-sm text-muted-foreground mb-4">{displayEmail}</p>
                
                {profileData && (
                  <div className="space-y-2 text-sm">
                    {displayLocation && (
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{displayLocation}</span>
                      </div>
                    )}
                    {displayAge && (
                      <div className="flex items-center justify-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{displayAge} years old</span>
                      </div>
                    )}
                    {displayCondition && (
                      <div className="flex items-center justify-center space-x-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>{displayCondition}</span>
                      </div>
                    )}
                  </div>
                )}

                <Separator className="my-4" />

                <div className="text-xs text-muted-foreground mb-4">
                  Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                </div>

                {!isEditing ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button variant="hero" size="sm" className="w-full" onClick={handleSaveProfile} disabled={uploading}>
                      <Save className="h-4 w-4 mr-2" />
                      {uploading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="soft" className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="hero" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={onAIMatchClick}
                  disabled={!profileData}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Match Trials
                </Button>
                {/* <Button variant="ghost" size="sm" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Support
                </Button> */}
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
                {/* <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Preferences
                </Button> */}
              </CardContent>
            </Card>

          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">My Profile</TabsTrigger>
                <TabsTrigger value="matches">AI Matches</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Profile Information Tab */}
              <TabsContent value="profile" className="space-y-6">
                {profileData ? (
                  <Card variant="healthcare">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Your health information and preferences for clinical trial matching
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {!isEditing ? (
                        // Display Mode
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                              <p className="text-foreground">{profileData.first_name} {profileData.last_name}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                              <p className="text-foreground">{profileData.date_of_birth ? format(new Date(profileData.date_of_birth), 'PPP') : 'Not provided'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                              <p className="text-foreground">{profileData.gender || 'Not provided'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                              <p className="text-foreground">{profileData.email_address}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                              <p className="text-foreground">{profileData.phone_number || 'Not provided'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                              <p className="text-foreground">{profileData.address || 'Not provided'}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Primary Condition</Label>
                              <p className="text-foreground">{profileData.primary_condition || 'Not provided'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Condition Stage/Severity</Label>
                              <p className="text-foreground">{profileData.condition_stage_severity || 'Not provided'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Date of Diagnosis</Label>
                              <p className="text-foreground">{profileData.date_of_diagnosis ? format(new Date(profileData.date_of_diagnosis), 'PPP') : 'Not provided'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Current Medications</Label>
                              <p className="text-foreground">{profileData.current_prescription_medications || 'Not provided'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Allergies</Label>
                              <p className="text-foreground">{profileData.allergies || 'Not provided'}</p>
                            </div>
                            {profileData.recent_test_results && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Test Results</Label>
                                <div className="flex items-center space-x-2 mt-1">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-foreground">PDF uploaded</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Edit Mode
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="first_name">First Name</Label>
                              <Input
                                id="first_name"
                                value={editedProfile?.first_name || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, first_name: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="last_name">Last Name</Label>
                              <Input
                                id="last_name"
                                value={editedProfile?.last_name || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, last_name: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="gender">Gender</Label>
                              <Select value={editedProfile?.gender || ''} onValueChange={(value) => setEditedProfile(prev => ({ ...prev, gender: value }))}>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-background">
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="non-binary">Non-binary</SelectItem>
                                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="phone_number">Phone Number</Label>
                              <Input
                                id="phone_number"
                                value={editedProfile?.phone_number || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, phone_number: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="address">Address</Label>
                              <Textarea
                                id="address"
                                value={editedProfile?.address || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="primary_condition">Primary Condition</Label>
                              <Input
                                id="primary_condition"
                                value={editedProfile?.primary_condition || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, primary_condition: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="condition_stage_severity">Condition Stage/Severity</Label>
                              <Input
                                id="condition_stage_severity"
                                value={editedProfile?.condition_stage_severity || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, condition_stage_severity: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="current_prescription_medications">Current Medications</Label>
                              <Textarea
                                id="current_prescription_medications"
                                value={editedProfile?.current_prescription_medications || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, current_prescription_medications: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="allergies">Allergies</Label>
                              <Textarea
                                id="allergies"
                                value={editedProfile?.allergies || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, allergies: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="test_results">Test Results (PDF)</Label>
                              <div className="space-y-2">
                                {profileData.recent_test_results && !newTestResultFile && (
                                  <div className="flex items-center space-x-2 p-2 bg-muted/20 rounded">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Current file uploaded</span>
                                  </div>
                                )}
                                <Input
                                  id="test_results"
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => setNewTestResultFile(e.target.files?.[0] || null)}
                                  className="bg-background"
                                />
                                {newTestResultFile && (
                                  <p className="text-sm text-muted-foreground">
                                    New file: {newTestResultFile.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card variant="healthcare">
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">No profile information yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Complete your health questionnaire to get started with clinical trial matching.
                      </p>
                      <Link to="/health-questionnaire">
                        <Button variant="hero">
                          Complete Health Questionnaire
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* AI Matches Tab */}
              <TabsContent value="matches" className="space-y-6">
                <Card variant="healthcare">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Your AI Match Results
                    </CardTitle>
                    <CardDescription>
                      Saved clinical trial matches based on your health profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedMatches?.match_data?.matches && savedMatches.match_data.matches.length > 0 ? (
                      <div className="space-y-4">
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            Last match ran: {new Date(savedMatches.created_at).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="font-semibold text-primary">
                            {savedMatches.match_data.matches.length} Trial{savedMatches.match_data.matches.length > 1 ? 's' : ''} Matched
                          </p>
                        </div>

                        {savedMatches.match_data.matches.map((match: any, idx: number) => {
                          const dbTrial = profileTrialDetails[match.trialNumber];
                          const trialName = dbTrial?.Description || match.trialName || `Trial ${match.trialNumber}`;
                          const trialNumber = match.trialNumber;
                          const product = dbTrial?.Product || match.product || null;
                          const sponsor = dbTrial?.Sponsor || match.sponsor || null;

                          return (
                          <Card key={idx} variant="soft">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-semibold">{trialName}</h4>
                                <Badge variant={match.matchScore >= 80 ? "default" : "secondary"} className="text-base px-3 py-1 shrink-0 ml-3">
                                  {match.matchScore}% Match
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm bg-muted/50 rounded-lg p-3">
                                <div>
                                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Trial Number</Label>
                                  <p className="text-foreground font-medium">{trialNumber}</p>
                                </div>
                                {product && (
                                  <div>
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</Label>
                                    <p className="text-foreground font-medium">{product}</p>
                                  </div>
                                )}
                                {sponsor && (
                                  <div>
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sponsor</Label>
                                    <p className="text-foreground font-medium">{sponsor}</p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-4">
                                {match.matchReasons && match.matchReasons.length > 0 && (
                                  <div>
                                    <Label className="text-sm font-semibold text-muted-foreground">Match Reasons:</Label>
                                    <ul className="list-disc list-inside space-y-1 mt-2">
                                      {match.matchReasons.map((reason: string, i: number) => (
                                        <li key={i} className="text-foreground text-sm">{reason}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {match.concerns && match.concerns.length > 0 && (
                                  <div>
                                    <Label className="text-sm font-semibold text-muted-foreground">Considerations:</Label>
                                    <ul className="list-disc list-inside space-y-1 mt-2">
                                      {match.concerns.map((concern: string, i: number) => (
                                        <li key={i} className="text-orange-600 text-sm">{concern}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {match.recommendation && (
                                  <div>
                                    <Label className="text-sm font-semibold text-muted-foreground">Recommendation:</Label>
                                    <p className="text-foreground text-sm mt-2 leading-relaxed">{match.recommendation}</p>
                                  </div>
                                )}
                                <div className="pt-2">
                                  <Link to={`/trial/${encodeURIComponent(trialNumber)}`}>
                                    <Button variant="default" className="w-full">
                                      View All Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-foreground mb-2">No AI matches yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Run AI matching to find clinical trials that match your health profile
                        </p>
                        <Button 
                          variant="hero"
                          onClick={onAIMatchClick}
                          disabled={!profileData}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Start AI Matching
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>


              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card variant="healthcare">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account preferences and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Profile Summary</h4>
                        <div className="space-y-2 text-sm">
                          {displayAge && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Age:</span>
                              <span>{displayAge} years old</span>
                            </div>
                          )}
                          {displayCondition && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Condition:</span>
                              <span>{displayCondition}</span>
                            </div>
                          )}
                          {displayLocation && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Location:</span>
                              <span>{displayLocation}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-3">Account Actions</h4>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <Settings className="h-4 w-4 mr-2" />
                            Privacy Settings
                          </Button>
                          {/* <Button variant="outline" className="w-full justify-start">
                            <Bell className="h-4 w-4 mr-2" />
                            Notification Preferences
                          </Button> */}
                          <Button variant="outline" className="w-full justify-between px-3 cursor-default hover:bg-transparent">
                            <div className="flex items-center">
                              <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm font-medium">Notifications</span>
                            </div>
                            <Switch 
                              id="notifications"
                              checked={notificationsEnabled}
                              onCheckedChange={setNotificationsEnabled}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Button>
                          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Section */}
                {/* <Card variant="healing">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Our support team is here to help you with any questions about clinical trials or using SkinSide.
                    </p>
                    <div className="flex space-x-3">
                      <Button variant="healthcare">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat with Support
                      </Button>
                      <Button variant="outline">
                        Email Support
                      </Button>
                    </div>
                  </CardContent>
                </Card> */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
