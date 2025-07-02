import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle";

const Login = () => {
  const { login, register } = useAppContext();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (isRegister) {
      res = await register(name, email, password);
    } else {
      res = await login(email, password);
    }

    if (res.success) {
      toast.success("Logged in");
      navigate("/");
    } else {
      toast.error(res.message || "Auth failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <BlurCircle top="10%" left="-100px" />
      <BlurCircle bottom="10%" right="-100px" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/10 backdrop-blur p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">
          {isRegister ? "Register" : "Login"}
        </h2>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-transparent border border-gray-500 outline-none"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-transparent border border-gray-500 outline-none"
          required
        />
        <div className="relative mb-3">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-gray-500 outline-none pr-10"
            required
          />
          {showPass ? (
            <EyeOffIcon
              className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowPass(false)}
            />
          ) : (
            <EyeIcon
              className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowPass(true)}
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-primary py-2 rounded text-white"
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <p className="text-center text-sm mt-3">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
