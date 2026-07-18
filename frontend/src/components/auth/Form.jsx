import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";

export default function AuthForm({ email, setEmail, password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
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

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>

        <label
          className="input input-bordered flex items-center rounded-full border-white/10 
          bg-base-100/70 w-full"
        >
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={8}
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
    </>
  );
}
