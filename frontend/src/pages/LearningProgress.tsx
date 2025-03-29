import React, { useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ChevronUp, Plus, Target, Trophy } from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";
import AddProgressDialog from "@/components/learning-progress/AddProgressDialog";

const LearningProgress = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const progressUpdates = [
    {
      id: 1,
      title: "Completed React Advanced Hooks Course",
      description: "Finished all modules and exercises in the Advanced React Hooks course on Frontend Masters.",
      progressPercent: 100,
      milestone: "React Mastery",
      author: {
        name: "Alex Johnson",
        avatar: "AJ",
      },
      createdAt: "2 hours ago",
    },
    {
      id: 2,
      title: "Spring Security Module Progress",
      description: "Completed 4 out of 8 modules in the Spring Security course. Learning about authentication providers.",
      progressPercent: 50,
      milestone: "Spring Framework Expert",
      author: {
        name: "Jamie Park",
        avatar: "JP",
      },
      createdAt: "1 day ago",
    },
    {
      id: 3,
      title: "UI Design Fundamentals",
      description: "Started learning about color theory and typography for better UI design. Completed the first two chapters.",
      progressPercent: 25,
      milestone: "UI/UX Designer",
      author: {
        name: "Sam Taylor",
        avatar: "ST",
      },
      createdAt: "2 days ago",
    },
    {
      id: 4,
      title: "Git Advanced Commands",
      description: "Learned about rebasing, cherry-picking, and advanced Git workflows. Still need to practice more.",
      progressPercent: 75,
      milestone: "Version Control Master",
      author: {
        name: "Morgan Lee",
        avatar: "ML",
      },
      createdAt: "3 days ago",
    },
  ];

  return (
    <PageContainer 
      title="Learning Progress"
      description="Track and share your learning journey with structured templates and celebrate milestones."
    >
      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
          <TabsTrigger value="all">All Updates</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="my">My Progress</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-end mb-6">
        <Button className="rounded-full" onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Progress Update
        </Button>
      </div>

      <div className="space-y-6">
        {progressUpdates.map((update, index) => (
          <AnimatedTransition key={update.id} direction="up" delay={0.05 * index}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${update.author.avatar}`} />
                    <AvatarFallback>{update.author.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{update.author.name}</p>
                    <p className="text-xs text-muted-foreground">{update.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{update.title}</CardTitle>
                    <CardDescription className="mt-1">{update.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium py-1 px-2 rounded-full">
                    <Target className="h-3 w-3" />
                    {update.milestone}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{update.progressPercent}%</span>
                  </div>
                  <Progress value={update.progressPercent} className="h-2" />
                  
                  {update.progressPercent === 100 && (
                    <div className="mt-4 bg-green-50 text-green-700 py-2 px-4 rounded-md flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-medium">Milestone completed!</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {update.createdAt}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronUp className="h-4 w-4 mr-1" /> Cheer
                </Button>
              </CardFooter>
            </Card>
          </AnimatedTransition>
        ))}
      </div>
      
      <AddProgressDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </PageContainer>
  );
};

export default LearningProgress;
