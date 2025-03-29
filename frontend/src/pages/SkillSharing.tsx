import React, { useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MessageSquare, Heart, Share2 } from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";
import CreatePostDialog from "@/components/skill-sharing/CreatePostDialog";

const SkillSharing = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const posts = [
    {
      id: 1,
      title: "React Router v6 - Complete Overview",
      description: "Learn how to use React Router v6 with this comprehensive guide covering all the new features and changes.",
      author: {
        name: "Alex Johnson",
        avatar: "AJ",
      },
      likes: 42,
      comments: 8,
      createdAt: "2 hours ago",
    },
    {
      id: 2,
      title: "Building Responsive UIs with Tailwind CSS",
      description: "A step-by-step guide to creating beautiful, responsive user interfaces using Tailwind CSS.",
      author: {
        name: "Sam Taylor",
        avatar: "ST",
      },
      likes: 38,
      comments: 5,
      createdAt: "4 hours ago",
    },
    {
      id: 3,
      title: "Spring Security OAuth 2.0 Implementation",
      description: "Learn how to implement OAuth 2.0 in your Spring Boot applications for secure authentication.",
      author: {
        name: "Jamie Park",
        avatar: "JP",
      },
      likes: 56,
      comments: 12,
      createdAt: "1 day ago",
    },
    {
      id: 4,
      title: "Git Workflow Best Practices for Teams",
      description: "Discover the most effective Git workflows for collaborative development in small to medium-sized teams.",
      author: {
        name: "Morgan Lee",
        avatar: "ML",
      },
      likes: 29,
      comments: 7,
      createdAt: "2 days ago",
    },
  ];

  return (
    <PageContainer 
      title="Skill Sharing"
      description="Share your skills and knowledge with others, or discover new skills to learn."
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full">All Posts</Button>
          <Button variant="outline" className="rounded-full">Popular</Button>
          <Button variant="outline" className="rounded-full">Recent</Button>
        </div>
        <Button className="rounded-full" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, index) => (
          <AnimatedTransition key={post.id} direction="up" delay={0.05 * index}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author.avatar}`} />
                    <AvatarFallback>{post.author.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                  </div>
                </div>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground">
                  Post media preview
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" /> {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> {post.comments}
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </AnimatedTransition>
        ))}
      </div>
      
      <CreatePostDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </PageContainer>
  );
};

export default SkillSharing;
