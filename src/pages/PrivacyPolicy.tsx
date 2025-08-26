import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CodeBracketIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow-primary">
              <CodeBracketIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Work Tracker
            </span>
          </Link>

          <Link to="/">
            <Button variant="ghost">
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <ShieldCheckIcon className="w-5 h-5" />
              Privacy & Security
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Privacy Policy
            </h1>

            <p className="text-lg text-muted-foreground">
              Last updated: 26 August 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <Card className="card-gaming p-8 space-y-4">
            <p className="text-lg text-foreground leading-relaxed">
              Work Tracker ("the App") is a personal-productivity tool that
              helps software engineers record daily activities, track progress
              and unlock achievements. We value your privacy and have designed
              the App so you stay in control of your data.
            </p>
          </Card>

          {/* What We Collect */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow-primary">
                <DocumentTextIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                What we collect
              </h2>
            </div>

            <Card className="card-gaming p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Account data
                  </h3>
                  <p className="text-muted-foreground">
                    Email address and password (handled by Firebase
                    Authentication, encrypted in transit and at rest).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Activity entries
                  </h3>
                  <p className="text-muted-foreground">
                    The text you write, the tags you pick and the timestamp.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Usage metrics
                  </h3>
                  <p className="text-muted-foreground">
                    Anonymous, aggregated counts (e.g., total number of entries)
                    used only to improve the product; no IP addresses or device
                    fingerprints are stored.
                  </p>
                </div>

                <div className="p-4 bg-accent/20 rounded-lg border border-accent/20">
                  <p className="text-sm text-foreground font-medium">
                    <strong>We do not collect:</strong> credit-card data,
                    location data, contact lists, or any files on your device.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* How We Use Data */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-success rounded-xl flex items-center justify-center glow-success">
                <UserIcon className="w-5 h-5 text-success-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                How we use your data
              </h2>
            </div>

            <Card className="card-gaming p-6">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  Display your timeline, streaks, achievements and analytics
                  inside the App.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  Sync your entries across devices (stored in our own MongoDB
                  database hosted on Render).
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  Send authentication tokens required to keep your session
                  secure.
                </li>
              </ul>

              <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
                <p className="text-sm text-foreground font-medium">
                  We never sell, rent or share your personal data with
                  advertisers or third-parties.
                </p>
              </div>
            </Card>
          </div>

          {/* Data Security */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gaming rounded-xl flex items-center justify-center">
                <LockClosedIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Data security
              </h2>
            </div>

            <Card className="card-gaming p-6">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  Transport Layer Security (HTTPS) on every request.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  Firebase Authentication tokens validated on the server;
                  passwords never touch our servers.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  Database access limited to backend services behind a firewall;
                  no public access.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  Regular dependency auditing; the source code will be public
                  soon, so anyone can verify.
                </li>
              </ul>
            </Card>
          </div>

          {/* Additional Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-gaming p-6 space-y-4">
              <h3 className="text-xl font-bold text-foreground">
                Data retention & deletion
              </h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Your entries remain until you delete them.</li>
                <li>
                  • You can export or erase all your data at any time via
                  Settings → Export / Delete account.
                </li>
                <li>
                  • Or email us at{" "}
                  <span className="text-primary">shashanknadikatla@gmail.com</span>
                </li>
              </ul>
            </Card>

            <Card className="card-gaming p-6 space-y-4">
              <h3 className="text-xl font-bold text-foreground">
                Children's privacy
              </h3>
              <p className="text-muted-foreground text-sm">
                Work Tracker is intended for users aged 16 and above; we do not
                knowingly collect data from children.
              </p>
            </Card>
          </div>

          <Card className="card-gaming p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              Changes to this policy
            </h3>
            <p className="text-muted-foreground text-sm">
              We'll post any future changes on this page and update the "Last
              updated" date. Significant changes will be announced in-app.
            </p>
          </Card>

          <Card className="card-gaming p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Contact</h3>
            <p className="text-muted-foreground text-sm">
              Questions? Email{" "}
              <span className="text-primary">shashanknadikatla@gmail.com</span>.
            </p>
          </Card>

          <Card className="card-gaming p-6 bg-accent/10 border-accent/20">
            <p className="text-sm text-foreground text-center">
              This concise policy follows Google Safe-Browsing and Firebase
              Hosting guidelines—no deceptive downloads, phishing or hidden
              trackers. The entire codebase and build pipeline are open-source,
              giving users and security researchers full transparency.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CodeBracketIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium">Work Tracker</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
