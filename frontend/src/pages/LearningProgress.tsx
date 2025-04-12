import React, { useState, useEffect } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ChevronUp, Plus, Target, Trophy, Edit2, Trash2 } from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";
import AddProgressDialog from "@/components/learning-progress/AddProgressDialog";
import EditProgressDialog from "@/components/learning-progress/EditProgressDialog";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";
import axios from "axios";

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
  template: string;
}

const LearningProgress: React.FC = () => {
  const [progressUpdates, setProgressUpdates] = useState<LearningProgress[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<LearningProgress | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/learning-progress`, { withCredentials: true });
        setProgressUpdates(response.data);
      } catch (error) {
        console.error("Failed to load progress updates:", error);
        toast.error("Failed to load progress updates. Please try again.");
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/skill-posts/auth/check`, { withCredentials: true });
        if (response.status === 200) {
          setUserName(response.data.name);
        }
      } catch (error) {
        console.error("User not authenticated:", error);
      }
    };

    fetchProgress();
    fetchUser();
  }, []);

  const handleProgressCreated = (newProgress: LearningProgress) => {
    setProgressUpdates((prevUpdates) => [...prevUpdates, newProgress]);
  };

  const handleProgressUpdated = (updatedProgress: LearningProgress) => {
    setProgressUpdates((prevUpdates) =>
      prevUpdates.map((update) => (update.id === updatedProgress.id ? updatedProgress : update))
    );
    setEditDialogOpen(false);
    setSelectedProgress(null);
  };

  const handleDeleteProgress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this progress update?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/learning-progress/${id}`, { withCredentials: true });
      setProgressUpdates((prevUpdates) => prevUpdates.filter((update) => update.id !== id));
      toast.success("Progress update deleted successfully!");
    } catch (error) {
      console.error("Error deleting progress:", error);
      toast.error("Failed to delete progress update. Please try again.");
    }
  };

  const isProgressOwner = (progress: LearningProgress) => {
    return progress.author.name === userName;
  };

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
                    <AvatarImage src={update.author.avatar} />
                    <AvatarFallback>{update.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{update.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(update.createdAt).toLocaleDateString()}
                    </p>
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
                  <span>Updated {new Date(update.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  {isProgressOwner(update) && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedProgress(update);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProgress(update.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm">
                    <ChevronUp className="h-4 w-4 mr-1" /> Cheer
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </AnimatedTransition>
        ))}
      </div>

      <AddProgressDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onProgressCreated={handleProgressCreated}
      />
      {selectedProgress && (
        <EditProgressDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          progress={selectedProgress}
          onProgressUpdated={handleProgressUpdated}
        />
      )}
    </PageContainer>
  );
};

export default LearningProgress;