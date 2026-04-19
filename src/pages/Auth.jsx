import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, go to profile
    if (user) {
      navigate("/user");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      const res = await register(name, email, phone, password);
      if (!res.success) {
        setError(res.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Log in to manage your appointments" : "Sign up to book spa services"}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required={!isLogin} 
                placeholder="Jane Doe"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="jane@example.com"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required={!isLogin} 
                placeholder="+1 (555) 123-4567"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-auth-submit">
            {isLogin ? "Log In" : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => { setIsLogin(!isLogin); setError(""); }} className="auth-toggle">
              {isLogin ? " Sign Up" : " Log In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
