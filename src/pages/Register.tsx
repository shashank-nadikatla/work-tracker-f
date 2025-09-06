import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      await register(email, password);
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        className="w-full max-w-sm card-gaming p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center gap-3 text-sm mb-2">
          <Switch checked={agreed} onCheckedChange={setAgreed} />
          <span>
            I agree to the&nbsp;
            <Link
              to="/privacy"
              className="text-primary hover:underline font-medium"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loadingSubmit || !agreed}
        >
          {loadingSubmit ? "Signing up..." : "Sign Up"}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
