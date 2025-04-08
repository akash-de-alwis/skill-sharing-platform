import React, { useState, useEffect } from "react";
import PageContainer from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MessageSquare, Heart, Share2, Edit2, Trash2, LogOut } from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";
import CreatePostDialog from "@/components/skill-sharing/CreatePostDialog";
import EditPostDialog from "@/components/skill-sharing/EditPostDialog";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface Author {
  name: string;
  avatar: string;
}

interface SkillPost {
  id: string;
  title: string;
  description: string;
  author: Author;
  likes: number;
  comments: number;
  createdAt: string;
  image?: string;
  category: string;
  tags?: string[];
  allowComments?: boolean;
  visibility?: "public" | "followers" | "private";
}

const SkillSharing: React.FC = () => {
  const [posts, setPosts] = useState<SkillPost[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SkillPost | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/skill-posts`, { withCredentials: true });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to load posts:", error);
        toast.error("Failed to load posts. Please try again.");
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/skill-posts/auth/check`, { withCredentials: true });
        if (response.status === 200) {
          setUserName(response.data.name); // Updated to use actual name from auth/check
        }
      } catch (error) {
        console.error("User not authenticated:", error);
      }
    };

    fetchPosts();
    fetchUser();
  }, []);

  const handlePostCreated = (newPost: SkillPost) => {
    console.log("Added Post:", newPost);
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const handlePostUpdated = (updatedPost: SkillPost) => {
    console.log("Updated Post:", updatedPost);
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    setEditDialogOpen(false);
    setSelectedPost(null); // Clear selected post after update
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/skill-posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete post: ${response.status} ${errorText}`);
      }
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:8081/logout";
  };

  const isPostOwner = (post: SkillPost) => {
    return post.author.name === userName; // Simplified; use user ID in production
  };

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
        <div className="flex gap-4">
          <Button className="rounded-full" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
          <Button variant="outline" className="rounded-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, index) => (
          <AnimatedTransition key={post.id} direction="up" delay={0.05 * index}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
                <div className="mt-2">
                  <Badge variant="secondary" className="mr-2">{post.category}</Badge>
                  {post.tags && post.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="mr-1">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="aspect-video object-cover rounded-lg w-full"
                    onError={(e) => console.error("Image failed to load:", post.image)}
                  />
                ) : (
                  <div className="aspect-video bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground">
                    No media available
                  </div>
                )}
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
                <div className="flex gap-2">
                  {isPostOwner(post) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPost(post);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </AnimatedTransition>
        ))}
      </div>

      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onPostCreated={handlePostCreated}
      />
      {selectedPost && (
        <EditPostDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          post={selectedPost}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </PageContainer>
  );
};

export default SkillSharing;