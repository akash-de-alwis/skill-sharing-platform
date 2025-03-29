
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Skill Sharing", path: "/skill-sharing" },
    { title: "Learning Progress", path: "/learning-progress" },
    { title: "Learning Plans", path: "/learning-plans" },
    { title: "Profile", path: "/profile" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple",
        scrolled || isMenuOpen
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      )}
    >
      <div className="content-container flex justify-between items-center h-16">
        <Link
          to="/"
          className="font-semibold text-xl tracking-tight transition-opacity hover:opacity-80"
        >
          SkillSync<span className="text-primary">Lab</span>
        </Link>

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/70"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            Log In
          </Button>
          <Button size="sm" className="hidden md:flex">
            Sign Up
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 bg-background z-40 flex flex-col pt-16 px-6 pb-6 transition-all duration-300 ease-apple",
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <nav className="flex flex-col space-y-6 mt-10">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary flex items-center",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/70"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Button variant="outline" size="lg" className="w-full">
              Log In
            </Button>
            <Button size="lg" className="w-full">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
