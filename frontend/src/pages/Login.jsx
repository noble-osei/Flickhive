import { useState } from "react";
import { Link } from "react-router-dom";

import AuthForm from "../components/auth/Form.jsx";
import { useAuth } from "../context/Auth.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password, rememberMe);
    setLoading(false);
  };

  return (
    <main>
      <div
        className="
            w-full
            max-w-md
            rounded-box
            border border-white/10
            bg-base-200/70
            backdrop-blur-xl
            shadow-2xl
            p-6
            lg:p-8
          "
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight">Welcome Back</h1>

          <p className="mt-3 text-base-content/70">
            Sign in to continue discovering your next favourite movie or TV
            show.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />

          {/* Remember */}
          <div className="flex items-center justify-between">
            <label className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox checkbox-primary checkbox-sm"
              />

              <span className="label-text text-base-content/80">
                Remember me
              </span>
            </label>

            <button type="button" className="link text-primary text-sm">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full rounded-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider my-7" />

        <p className="text-center text-sm text-base-content/70">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
