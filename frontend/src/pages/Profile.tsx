
import React from "react";
import PageContainer from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Edit, Github, Linkedin, Mail, MapPin, UserPlus } from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";

const Profile = () => {
  const userProfile = {
    name: "Alex Johnson",
    avatar: "AJ",
    title: "Full Stack Developer",
    location: "San Francisco, CA",
    bio: "Passionate about web development, UX design, and learning new technologies. Currently focused on React and Spring Boot.",
    skills: ["React", "Spring Boot", "TypeScript", "Java", "REST API", "UI/UX", "Git"],
    email: "alex.johnson@example.com",
    github: "alexjohnson",
    linkedin: "alexjohnson",
    stats: {
      posts: 18,
      plans: 4,
      following: 67,
      followers: 42
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <AnimatedTransition direction="up">
          <div className="relative mb-8">
            <div className="h-48 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/30 w-full"></div>
            <div className="absolute -bottom-16 left-8 flex items-end">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.avatar}`} />
                <AvatarFallback className="text-3xl">{userProfile.avatar}</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute right-4 bottom-4 flex gap-2">
              <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </AnimatedTransition>

        <div className="pt-16 px-4">
          <AnimatedTransition direction="up" delay={0.1}>
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground flex items-center mt-1">
                  {userProfile.title}
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  {userProfile.location}
                </p>
                <p className="mt-4 max-w-xl">{userProfile.bio}</p>
                
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${userProfile.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://github.com/${userProfile.github}`} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://linkedin.com/in/${userProfile.linkedin}`} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
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
                {userProfile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
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
                  <Button className="mt-4">
                    Create Post
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="progress">
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No progress updates yet</h3>
                  <p className="text-muted-foreground mt-2">Start tracking your learning journey.</p>
                  <Button className="mt-4">
                    Add Progress Update
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="plans">
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No learning plans yet</h3>
                  <p className="text-muted-foreground mt-2">Create a structured learning plan.</p>
                  <Button className="mt-4">
                    Create Learning Plan
                  </Button>
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
