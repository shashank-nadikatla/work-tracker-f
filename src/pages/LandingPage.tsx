import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CodeBracketIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
  RocketLaunchIcon,
  UserPlusIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import heroImage from "@/assets/hero-illustration.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const handleSignUp = () => navigate("/register");
  const handleLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow-primary">
              <CodeBracketIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Work Tracker
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost">
              <Link to="/privacy">Privacy</Link>
            </Button>
            <Button variant="ghost" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="gaming" onClick={handleSignUp}>
              <UserPlusIcon className="w-4 h-4" /> Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-medium">
                <SparklesIcon className="w-5 h-5" /> Gamified Work Tracking
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Level Up Your{" "}
                <span className="text-primary block">Productivity</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your daily work activities into an engaging quest.
                Track progress, build streaks, unlock achievements, and generate
                powerful summaries for appraisals and career growth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="gaming"
                className="text-lg px-8 py-4"
                onClick={handleSignUp}
              >
                <RocketLaunchIcon className="w-5 h-5" /> Start Your Quest{" "}
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4"
                onClick={handleLogin}
              >
                Login to Continue
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-border">
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Achievement System
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Progress Analytics
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Developer Focused
                </span>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative">
              <img
                src={heroImage}
                alt="Gamified work tracking illustration"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 animate-bounce-in">
                <Card className="p-3 bg-gradient-success text-success-foreground glow-success">
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">7 Day Streak!</span>
                  </div>
                </Card>
              </div>
              <div
                className="absolute -bottom-4 -left-4 animate-bounce-in"
                style={{ animationDelay: "0.3s" }}
              >
                <Card className="p-3 bg-gradient-primary text-primary-foreground glow-primary">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Quest Complete!</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Why Choose Work Tracker?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built specifically for software engineers who want to track their
            work in a fun, engaging way while building career-boosting
            documentation.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="card-gaming p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl mx-auto flex items-center justify-center glow-primary">
              <CodeBracketIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Daily Activity Logging
            </h3>
            <p className="text-muted-foreground">
              Quick, intuitive logging of your development work, testing,
              analysis, and learning activities.
            </p>
          </Card>
          <Card className="card-gaming p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-success rounded-xl mx-auto flex items-center justify-center glow-success">
              <TrophyIcon className="w-6 h-6 text-success-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Achievement System
            </h3>
            <p className="text-muted-foreground">
              Build streaks, unlock badges, and gamify your productivity to stay
              motivated and consistent.
            </p>
          </Card>
          <Card className="card-gaming p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-gaming rounded-xl mx-auto flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Smart Summaries
            </h3>
            <p className="text-muted-foreground">
              Generate powerful work summaries for regular updated, appraisals
              and career progression.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Ready to Level Up Your Career?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join developers using Work Tracker to manage work items, showcase
            portfolios, and accelerate their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="gaming"
              className="text-lg px-12 py-4"
              onClick={handleSignUp}
            >
              <RocketLaunchIcon className="w-5 h-5" /> Start Free Today
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required • Start tracking in under 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <CodeBracketIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground font-medium">Work Tracker</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
