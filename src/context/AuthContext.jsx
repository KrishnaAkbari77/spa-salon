/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("spa_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    try {
      const res = await fetch(
        `http://localhost:3001/users?email=${email}&password=${password}`,
      );
      const data = await res.json();

      if (data.length > 0) {
        const loggedInUser = data[0];
        setUser(loggedInUser);
        localStorage.setItem("spa_user", JSON.stringify(loggedInUser));
        return { success: true };
      } else {
        return { success: false, message: "Invalid email or password" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Server error. Please try again." };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      // First check if user exists
      const checkRes = await fetch(
        `http://localhost:3001/users?email=${email}`,
      );
      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        return { success: false, message: "Email already exists" };
      }

      // Create user
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const newUser = await res.json();
      setUser(newUser);
      localStorage.setItem("spa_user", JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Server error. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("spa_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
