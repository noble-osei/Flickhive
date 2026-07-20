import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";

export default function SignupForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password && value && value !== password) {
      // Silently check without showing error - UX will show visual feedback
    }
  };

  return (
    <>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Full Name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="input input-bordered w-full rounded-full border-white/10 bg-base-100/70"
          minLength={3}
          maxLength={100}
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email Address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          placeholder="you@example.com"
          className="input input-bordered w-full rounded-full border-white/10 bg-base-100/70"
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>

        <label className="input input-bordered flex items-center rounded-full border-white/10 bg-base-100/70 w-full">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            minLength={8}
            maxLength={30}
            required
          />

          <button
            type="button"
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <LuEye size={17} /> : <LuEyeClosed size={17} />}
          </button>
        </label>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
          Confirm Password
        </label>

        <label
          className={`input input-bordered flex items-center rounded-full border-white/10 bg-base-100/70 w-full transition-colors ${
            confirmPassword && !passwordsMatch ? "border-error" : ""
          }`}
        >
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Re-enter password"
            minLength={8}
            maxLength={30}
            required
          />

          <button
            type="button"
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Toggle confirm password visibility"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <LuEye size={17} />
            ) : (
              <LuEyeClosed size={17} />
            )}
          </button>
        </label>

        {confirmPassword && !passwordsMatch && (
          <p className="text-error text-sm mt-1">Passwords do not match</p>
        )}
      </div>
    </>
  );
}
