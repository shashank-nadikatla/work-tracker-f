import React from "react";
import { CodeBracketIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const GameHeader: React.FC = () => {
  const { logout } = useAuth();
  return (
    <header className="w-full bg-card border-b border-border py-4 px-6 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow-primary">
              <CodeBracketIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <SparklesIcon className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Work Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Your gamified work activity tracker
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">
              Software Engineer
            </p>
            <p className="text-xs text-muted-foreground">
              Level up your productivity! 🚀
            </p>
          </div>

          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center glow-primary">
            <UserCircleIcon className="w-6 h-6 text-white" />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            className="transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
