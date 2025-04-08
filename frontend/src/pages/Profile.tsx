import React, { useState, useEffect } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Edit, Github, Linkedin, Mail, MapPin, UserPlus, LogOut, Save } from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  title?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  stats: {
    posts: number;
    plans: number;
    following: number;
    followers: number;
  };
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch authenticated user details
        console.log("Fetching auth status from:", `${API_BASE_URL}/skill-posts/auth/check`);
        const authResponse = await axios.get(`${API_BASE_URL}/skill-posts/auth/check`, {
          withCredentials: true,
        });
        console.log("Auth response:", authResponse.data);

        if (authResponse.data.status !== "Authenticated") {
          throw new Error("User not authenticated");
        }

        const email = authResponse.data.email;
        const name = authResponse.data.name || "Unknown User";
        const avatar = authResponse.data.picture || name.substring(0, 2).toUpperCase();
        console.log("Authenticated email:", email);

        // Fetch additional profile data if available
        console.log("Fetching profile from:", `${API_BASE_URL}/users/${email}`);
        let profileData;
        try {
          const profileResponse = await axios.get(`${API_BASE_URL}/users/${email}`, {
            withCredentials: true,
          });
          profileData = profileResponse.data;
          console.log("Profile response:", profileData);
        } catch (profileError: any) {
          console.warn("Profile not found in database, using auth data:", profileError.message);
          profileData = null; // Use auth data if profile not found
        }

        const profile: UserProfile = {
          name: name,
          avatar: avatar,
          email: email,
          title: profileData?.title || "",
          location: profileData?.location || "",
          bio: profileData?.bio || "",
          skills: profileData?.skills || [],
          github: profileData?.github || "",
          linkedin: profileData?.linkedin || "",
          stats: {
            posts: profileData?.stats?.posts || 0,
            plans: profileData?.stats?.plans || 0,
            following: profileData?.stats?.following || 0,
            followers: profileData?.stats?.followers || 0,
          },
        };
        setUserProfile(profile);
        setFormData(profile);
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        setErrorMessage("Failed to load profile. Please try logging in again.");
        toast.error("Redirecting to login...");
        setTimeout(() => {
          window.location.href = "http://localhost:8081/oauth2/authorization/google";
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userProfile || {});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, skills }));
  };

  const handleSave = async () => {
    if (!userProfile?.email) return;
    try {
      // Merge formData with existing userProfile to ensure name and avatar are included
      const updatedProfile = {
        ...userProfile,
        ...formData,
        email: userProfile.email, // Ensure email is preserved
        name: userProfile.name,   // Preserve Google name
        avatar: userProfile.avatar // Preserve Google avatar
      };
      const response = await axios.put(`${API_BASE_URL}/users/${userProfile.email}`, updatedProfile, {
        withCredentials: true,
      });
      setUserProfile(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:8081/logout";
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-10">Loading profile...</div>
      </PageContainer>
    );
  }

  if (!userProfile) {
    return (
      <PageContainer>
        <div className="text-center py-10">
          {errorMessage || "Profile not available. Please log in."}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <AnimatedTransition direction="up">
          <div className="relative mb-8">
            <div className="h-48 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/30 w-full"></div>
            <div className="absolute -bottom-16 left-8 flex items-end">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="text-3xl">{userProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute right-4 bottom-4 flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleSave} className="bg-background/80 backdrop-blur-sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel} className="bg-background/80 backdrop-blur-sm">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEdit} className="bg-background/80 backdrop-blur-sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
              <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </AnimatedTransition>

        <div className="pt-16 px-4">
          <AnimatedTransition direction="up" delay={0.1}>
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <Input
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      placeholder="Title (e.g., Developer)"
                    />
                    <Input
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      placeholder="Location (e.g., Panadura, Sri Lanka)"
                    />
                    <Textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      placeholder="Bio"
                    />
                    <Input
                      name="skills"
                      value={formData.skills?.join(", ") || ""}
                      onChange={handleSkillsChange}
                      placeholder="Skills (comma-separated, e.g., React, Java)"
                    />
                    <Input
                      name="github"
                      value={formData.github || ""}
                      onChange={handleInputChange}
                      placeholder="GitHub username"
                    />
                    <Input
                      name="linkedin"
                      value={formData.linkedin || ""}
                      onChange={handleInputChange}
                      placeholder="LinkedIn username"
                    />
                  </div>
                ) : (
                  <>
                    {userProfile.title && (
                      <p className="text-muted-foreground flex items-center mt-1">
                        {userProfile.title}
                        {userProfile.location && (
                          <>
                            <span className="mx-2">•</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            {userProfile.location}
                          </>
                        )}
                      </p>
                    )}
                    {userProfile.bio && <p className="mt-4 max-w-xl">{userProfile.bio}</p>}
                  </>
                )}

                <div className="flex gap-4 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${userProfile.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  {userProfile.github && !isEditing && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://github.com/${userProfile.github}`} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {userProfile.linkedin && !isEditing && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://linkedin.com/in/${userProfile.linkedin}`} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <Button className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Follow
                </Button>

                <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                  <div>
                    <div className="font-bold">{userProfile.stats.posts}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div>
                    <div className="font-bold">{userProfile.stats.plans}</div>
                    <div className="text-xs text-muted-foreground">Plans</div>
                  </div>
                  <div>
                    <div className="font-bold">{userProfile.stats.following}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                  <div>
                    <div className="font-bold">{userProfile.stats.followers}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>

          <AnimatedTransition direction="up" delay={0.2}>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills && userProfile.skills.length > 0 ? (
                  userProfile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills listed yet.</p>
                )}
              </div>
            </div>
          </AnimatedTransition>

          <AnimatedTransition direction="up" delay={0.3}>
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
                <TabsTrigger value="progress" className="flex-1">Progress</TabsTrigger>
                <TabsTrigger value="plans" className="flex-1">Plans</TabsTrigger>
                <TabsTrigger value="liked" className="flex-1">Liked</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6">
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No posts yet</h3>
                  <p className="text-muted-foreground mt-2">Start sharing your skills and knowledge.</p>
                  <Button className="mt-4">Create Post</Button>
                </div>
              </TabsContent>

              <TabsContent value="progress">
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No progress updates yet</h3>
                  <p className="text-muted-foreground mt-2">Start tracking your learning journey.</p>
                  <Button className="mt-4">Add Progress Update</Button>
                </div>
              </TabsContent>

              <TabsContent value="plans">
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No learning plans yet</h3>
                  <p className="text-muted-foreground mt-2">Create a structured learning plan.</p>
                  <Button className="mt-4">Create Learning Plan</Button>
                </div>
              </TabsContent>

              <TabsContent value="liked">
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No liked content yet</h3>
                  <p className="text-muted-foreground mt-2">Like posts and plans to see them here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </AnimatedTransition>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;