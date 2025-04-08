import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { API_BASE_URL } from "@/config/api";

const progressSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  milestone: z.string().min(3, { message: "Milestone must be specified" }),
  progressPercent: z.coerce.number().min(0).max(100),
  template: z.enum(["course", "project", "skill"]),
});

type ProgressFormValues = z.infer<typeof progressSchema>;

interface AddProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddProgressDialog: React.FC<AddProgressDialogProps> = ({ open, onOpenChange }) => {
  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      title: "",
      description: "",
      milestone: "",
      progressPercent: 0,
      template: "course",
    },
  });

  const onSubmit = async (data: ProgressFormValues) => {
    const progressData = {
      ...data,
      author: { name: "Current User", avatar: "CU" }, // Replace with actual user data
    };

    await fetch(`${API_BASE_URL}/learning-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progressData),
    });
    toast.success("Progress update added successfully!");
    form.reset();
    onOpenChange(false);
  };

  const selectedTemplate = form.watch("template");

  React.useEffect(() => {
    if (selectedTemplate === "course") {
      form.setValue("title", form.getValues("title") || "Completed Course: ");
      form.setValue("milestone", form.getValues("milestone") || "Course Completion");
    } else if (selectedTemplate === "project") {
      form.setValue("title", form.getValues("title") || "Project Progress: ");
      form.setValue("milestone", form.getValues("milestone") || "Project Milestone");
    } else if (selectedTemplate === "skill") {
      form.setValue("title", form.getValues("title") || "Skill Development: ");
      form.setValue("milestone", form.getValues("milestone") || "Skill Mastery");
    }
  }, [selectedTemplate, form]);

  const watchProgress = form.watch("progressPercent");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Progress Update</DialogTitle>
          <DialogDescription>
            Share your learning progress with the community
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Template</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="course" id="course" />
                        <label htmlFor="course" className="text-sm">Course</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="project" id="project" />
                        <label htmlFor="project" className="text-sm">Project</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="skill" id="skill" />
                        <label htmlFor="skill" className="text-sm">Skill</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your progress update" {...field} />
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
                      placeholder="Describe what you've learned or achieved..." 
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
              name="milestone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestone</FormLabel>
                  <FormControl>
                    <Input placeholder="What milestone are you working towards?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="progressPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress: {field.value}%</FormLabel>
                  <FormControl>
                    <Input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      {...field} 
                    />
                  </FormControl>
                  <Progress value={watchProgress} className="h-2" />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Add Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProgressDialog;