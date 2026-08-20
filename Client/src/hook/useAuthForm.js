// src/hooks/useAuthForm.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useAuthForm() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    if (activeTab === "login") {
      await login(email, password);
      navigate("/");
    } else {
      const name = e.target.name.value;
      const phone = e.target.phone.value;
      const address = {
        line1: e.target.line1.value,
        line2: e.target.line2.value,
        city: e.target.city.value,
        state: e.target.state.value,
        pincode: e.target.pincode.value,
      };
      await register(name, email, password, phone, address);
      setActiveTab("login");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return { activeTab, setActiveTab, showPassword, setShowPassword, error, loading, handleSubmit };
}