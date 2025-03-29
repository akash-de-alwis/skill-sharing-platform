
import React from "react";
import { 
  Share2, 
  LineChart, 
  Compass, 
  Users, 
  BookOpen, 
  Bell 
} from "lucide-react";
import AnimatedTransition from "@/components/ui/AnimatedTransition";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <AnimatedTransition direction="up" delay={delay} className="flex flex-col">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </AnimatedTransition>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Share2 size={24} />,
      title: "Skill Sharing Posts",
      description: "Share your skills with photos and videos to help others learn from your expertise.",
    },
    {
      icon: <LineChart size={24} />,
      title: "Learning Progress Updates",
      description: "Track and share your learning journey with structured templates and milestones.",
    },
    {
      icon: <Compass size={24} />,
      title: "Learning Plan Sharing",
      description: "Create and share structured learning plans with topics, resources, and timelines.",
    },
    {
      icon: <Users size={24} />,
      title: "Community Interaction",
      description: "Connect with others through comments, likes, and follow features for better engagement.",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Personalized Profiles",
      description: "Showcase your skills, learning progress, and contributions on your profile.",
    },
    {
      icon: <Bell size={24} />,
      title: "Real-time Notifications",
      description: "Stay updated with notifications about interactions and activity on your content.",
    },
  ];

  return (
    <section className="py-24">
      <div className="content-container">
        <AnimatedTransition direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Key Platform Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform provides all the tools you need to share skills, track learning progress, 
            and collaborate with fellow students.
          </p>
        </AnimatedTransition>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 + index * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
