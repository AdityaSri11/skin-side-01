import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Heart, MapPin, Clock, Users, MessageCircle, Settings, Bell, Bookmark, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = {
    name: "Sarah Murphy",
    email: "sarah.murphy@email.com",
    phone: "+353 87 123 4567",
    age: 25,
    location: "North Dublin",
    condition: "Eczema / Atopic Dermatitis",
    joinDate: "January 2024"
  };

  const savedTrials = [
    {
      id: 1,
      title: "Advanced Eczema Treatment Study",
      hospital: "Mater Hospital",
      status: "Applied",
      appliedDate: "2024-01-15",
      matchScore: 95
    },
    {
      id: 2,
      title: "Biologics for Eczema Research",
      hospital: "St. Vincent's Hospital",
      status: "Saved",
      savedDate: "2024-01-10",
      matchScore: 87
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "application",
      title: "Application Status Update",
      message: "Your application for the Advanced Eczema Treatment Study has been received and is under review.",
      date: "2024-01-16",
      read: false
    },
    {
      id: 2,
      type: "match",
      title: "New Trial Match",
      message: "We found a new clinical trial that matches your profile: Digital Health Monitoring Trial",
      date: "2024-01-14",
      read: true
    },
    {
      id: 3,
      type: "reminder",
      title: "Profile Update Reminder",
      message: "Consider updating your preferences to get better trial matches.",
      date: "2024-01-12",
      read: true
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Applied":
        return <Badge variant="success">Applied</Badge>;
      case "Saved":
        return <Badge variant="secondary">Saved</Badge>;
      case "Reviewing":
        return <Badge variant="secondary">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <Calendar className="h-4 w-4 text-healthcare-blue" />;
      case "match":
        return <Heart className="h-4 w-4 text-success" />;
      case "reminder":
        return <Bell className="h-4 w-4 text-destructive" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-trust py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
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
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-foreground mb-1">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{user.age} years old</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>{user.condition}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-xs text-muted-foreground mb-4">
                  Member since {user.joinDate}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="soft" className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Support
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Preferences
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="trials" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trials">My Trials</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Trials Tab */}
              <TabsContent value="trials" className="space-y-6">
                <Card variant="healthcare">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bookmark className="h-5 w-5 mr-2" />
                      Saved & Applied Trials
                    </CardTitle>
                    <CardDescription>
                      Track your clinical trial applications and saved options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savedTrials.map((trial) => (
                        <div key={trial.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-foreground">{trial.title}</h3>
                              {getStatusBadge(trial.status)}
                              <Badge variant="success" className="text-xs">
                                {trial.matchScore}% match
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{trial.hospital}</p>
                            <p className="text-xs text-muted-foreground">
                              {trial.status === "Applied" 
                                ? `Applied on ${new Date(trial.appliedDate).toLocaleDateString()}`
                                : `Saved on ${new Date(trial.savedDate).toLocaleDateString()}`
                              }
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Link to={`/trial/${trial.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                            {trial.status === "Saved" && (
                              <Button variant="hero" size="sm">
                                Apply Now
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {savedTrials.length === 0 && (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-foreground mb-2">No saved trials yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start by finding trials that match your condition and preferences.
                        </p>
                        <Link to="/questionnaire">
                          <Button variant="hero">
                            Find Trials
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card variant="healthcare">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Recent Notifications
                    </CardTitle>
                    <CardDescription>
                      Stay updated on your trial applications and new matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 rounded-xl border ${
                          notification.read ? 'bg-muted/20 border-muted' : 'bg-primary-light/10 border-primary-light'
                        }`}>
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-foreground">{notification.title}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(notification.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card variant="healthcare">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Trial Preferences
                    </CardTitle>
                    <CardDescription>
                      Update your preferences to get better trial matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Current Preferences</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Age:</span>
                            <span>{user.age} years old</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Condition:</span>
                            <span>{user.condition}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{user.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Travel willingness:</span>
                            <span>Local area (5-10km)</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-3">Notification Settings</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">New trial matches</span>
                            <Badge variant="success">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Application updates</span>
                            <Badge variant="success">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Weekly summaries</span>
                            <Badge variant="secondary">Disabled</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Update Preferences
                      </Button>
                      <Button variant="soft">
                        Run New Matching
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Section */}
                <Card variant="healing">
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
                        Chat with Nurse
                      </Button>
                      <Button variant="outline">
                        Email Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;