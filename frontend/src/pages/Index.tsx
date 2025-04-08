import React from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedTransition from "@/components/ui/AnimatedTransition";

const Index: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      
      {/* CTA Section */}
      <section className="py-24 bg-secondary/50">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedTransition direction="up">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
                Ready to enhance your learning journey?
              </h2>
            </AnimatedTransition>
            
            <AnimatedTransition direction="up" delay={0.1}>
              <p className="text-lg text-muted-foreground mb-8">
                Join our community today and start sharing your skills, tracking your progress, and connecting with others.
              </p>
            </AnimatedTransition>
            
            <AnimatedTransition direction="up" delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/skill-sharing">Explore Platform</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <a href="#">Learn More</a>
                </Button>
              </div>
            </AnimatedTransition>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-24">
        <div className="content-container">
          <AnimatedTransition direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              This project is being developed by a team of four full-stack developers for IT3030 - PAF Assignment 2025.
            </p>
          </AnimatedTransition>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <AnimatedTransition key={index} direction="up" delay={0.1 + index * 0.05}>
                <div className="bg-secondary/30 rounded-2xl p-6 text-center">
                  <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-4"></div>
                  <h3 className="font-medium text-lg">Team Member {index + 1}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Full-stack Contributor</p>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 && "Skill Sharing Posts"}
                    {index === 1 && "Learning Progress Updates"}
                    {index === 2 && "Learning Plan Sharing"}
                    {index === 3 && "Interactivity, Profiles, Notifications"}
                  </p>
                </div>
              </AnimatedTransition>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;