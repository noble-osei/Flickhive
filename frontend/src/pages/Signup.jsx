import { useState } from "react";
import { Link } from "react-router-dom";

import SignupForm from "../components/auth/SignupForm.jsx";
import { useAuth } from "../context/Auth.jsx";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);
    await signup(name, email, password);
    setLoading(false);
  };

  const isFormValid =
    name.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    password === confirmPassword;

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
          <h1 className="text-4xl font-black tracking-tight">Create Account</h1>

          <p className="mt-3 text-base-content/70">
            Join us to discover and save your favourite movies and TV shows.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <SignupForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />

          <button
            type="submit"
            className="btn btn-primary w-full rounded-full"
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="divider my-7" />

        <p className="text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
