import React, { useState, useEffect } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, Copy, Plus, Share2, Users } from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";
import CreatePlanDialog from "@/components/learning-plans/CreatePlanDialog";
import { API_BASE_URL } from "@/config/api";
import { fetchData } from "@/utils/api";

interface Author {
  name: string;
  avatar: string;
}

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  author: Author;
  topics: string[];
  duration: string;
  followers: number;
  createdAt: string;
}

const LearningPlans: React.FC = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      const data = await fetchData(`${API_BASE_URL}/learning-plans`);
      setPlans(data);
    };
    loadPlans();
  }, []);

  return (
    <PageContainer 
      title="Learning Plans"
      description="Discover structured learning plans or create your own to guide your learning journey."
    >
      <Tabs defaultValue="discover" className="w-full mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="my">My Plans</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-end mb-6">
        <Button className="rounded-full" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Learning Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, index) => (
          <AnimatedTransition key={plan.id} direction="up" delay={0.05 * index}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${plan.author.avatar}`} />
                    <AvatarFallback>{plan.author.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{plan.author.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(plan.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.topics.map((topic, i) => (
                    <Badge key={i} variant="secondary">{topic}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{plan.followers} followers</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Follow Plan
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </AnimatedTransition>
        ))}
      </div>
      
      <CreatePlanDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </PageContainer>
  );
};

export default LearningPlans;