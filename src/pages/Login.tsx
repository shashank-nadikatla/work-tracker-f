import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      await login(email, password);
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        className="w-full max-w-sm bg-card p-6 rounded-lg shadow-md space-y-4"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>
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
        <Button type="submit" className="w-full" disabled={loadingSubmit}>
          {loadingSubmit ? "Logging in..." : "Login"}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            Register
          </Link>
        </p>
        <p className="text-xs text-center mt-2">
          <Link
            to="/privacy"
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
