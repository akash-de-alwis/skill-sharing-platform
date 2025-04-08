import React, { useState, useEffect } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ChevronUp, Plus, Target, Trophy } from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";
import AddProgressDialog from "@/components/learning-progress/AddProgressDialog";
import { API_BASE_URL } from "@/config/api";
import { fetchData } from "@/utils/api";

interface Author {
  name: string;
  avatar: string;
}

interface LearningProgress {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  milestone: string;
  author: Author;
  createdAt: string;
}

const LearningProgress: React.FC = () => {
  const [progressUpdates, setProgressUpdates] = useState<LearningProgress[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      const data = await fetchData(`${API_BASE_URL}/learning-progress`);
      setProgressUpdates(data);
    };
    loadProgress();
  }, []);

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
                    <p className="text-xs text-muted-foreground">{new Date(update.createdAt).toLocaleString()}</p>
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
                  <span>Updated {new Date(update.createdAt).toLocaleString()}</span>
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