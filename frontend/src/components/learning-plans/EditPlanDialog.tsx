import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/config/api";
import axios from "axios";

const planSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  duration: z.string().min(1, { message: "Duration must be specified" }),
  topics: z.array(z.string()).min(1, { message: "At least one topic must be added" }),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface EditPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: any;
  onPlanUpdated: (updatedPlan: any) => void;
}

const EditPlanDialog: React.FC<EditPlanDialogProps> = ({ open, onOpenChange, plan, onPlanUpdated }) => {
  const [topicInput, setTopicInput] = useState("");
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      topics: [],
    },
  });

  useEffect(() => {
    if (open && plan) {
      form.reset({
        title: plan.title || "",
        description: plan.description || "",
        duration: plan.duration || "",
        topics: Array.isArray(plan.topics) ? plan.topics : [],
      });
    }
  }, [open, plan, form]);

  const onSubmit = async (data: PlanFormValues) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/learning-plans/${plan.id}`, data, {
        withCredentials: true,
      });
      toast.success("Learning plan updated successfully!");
      form.reset();
      setTopicInput("");
      onOpenChange(false);
      onPlanUpdated(response.data);
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update learning plan. Please try again.");
    }
  };

  const addTopic = () => {
    if (topicInput.trim() !== "") {
      const currentTopics = form.getValues("topics") || [];
      if (!currentTopics.includes(topicInput.trim())) {
        form.setValue("topics", [...currentTopics, topicInput.trim()]);
        setTopicInput("");
      }
    }
  };

  const removeTopic = (topic: string) => {
    const currentTopics = form.getValues("topics");
    form.setValue("topics", currentTopics.filter((t) => t !== topic));
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTopic();
    }
  };

  const watchTopics = form.watch("topics");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Learning Plan</DialogTitle>
          <DialogDescription>
            Update the details of your learning plan
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your learning plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this learning plan covers..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 8 weeks, 3 months" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topics</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add topics covered in this plan"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={handleTopicKeyDown}
                    />
                    <Button type="button" onClick={addTopic} variant="secondary">
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchTopics && watchTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {topic}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTopic(topic)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Plan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlanDialog;