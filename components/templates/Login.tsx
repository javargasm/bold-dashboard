"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Login.styles.css";
import useGoTo from "@hooks/useGoTo";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  const { goToPage } = useGoTo();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goToPage("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">BOLD</div>

        <h1>Inicia sesión con tu correo y contraseña</h1>

        <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email-input">Email*</label>
          <div className="email-section">
            {isEditing ? (
              <>
                <input
                  data-testid="email-input"
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                />
              </>
            ) : (
              <div className="email-display">
                <span>{email}</span>
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </button>
              </div>
            )}
          </div>

          <div className="password-section">
            <label htmlFor="password-input">Contraseña*</label>
            <div className="password-input-wrapper">
              <input
                data-testid="password-input"
                id="password-input"
                type={showPassword ? "text" : "password"}
                className="password-input"
              />
              <button
                id="toggle-password"
                data-testid="toggle-password"
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña? Recupérala aquí
          </a>

          <button type="submit" className="submit-button">
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
