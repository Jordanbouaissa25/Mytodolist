import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../Http/Axios.Instance";

export const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function inscription(email: string, password: string, confirmPassword: string) {

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return
    }

    try {
      const response = await http.post("/register", { email, password, confirmPassword });

      if (response.status === 201) {
        console.log("Inscription réussie");
        const token = response.data.token;
        const _id = response.data._id;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", _id);
        navigate("/Login"); // Rediriger l'utilisateur après une inscription réussie
      } else {
        setError("Impossible de s'inscrire.");
      }
    } catch (error) {
      console.error("Le mot de passe doit contenir 8 caractères, ou l'adresse-mail est déja existante:", error);
      setError("Le mot de passe doit contenir 8 caracères, ou l'adresse-mail est déja existante.");
    }
  }

  return (
    <form
  onSubmit={(e) => {
    e.preventDefault();
    inscription(email, password, confirmPassword);
  }}
  className="p-6 rounded-lg w-[300px] text-center"
>
  <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
    <div className="card-body">
      <fieldset className="fieldset">
        <label className="label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Email"
          required
        />

        <label className="label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="*********"
          required
        />

        <label className="label">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
          placeholder="*********"
          required
        />
          <p className="text-red-500 mb-4">{error}</p>

        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
          <legend className="fieldset-legend">Register options</legend>
          <label className="label">
            <input type="checkbox" required className="checkbox" />
            J'accepte les termes et conditions
          </label>
        </fieldset>

        <button type="submit" className="btn btn-neutral mt-4">
          S'inscrire
        </button>
        <button  onClick={() => navigate("/Login")} className="btn btn-neutral mt-4">Login</button>
      </fieldset>
    </div>
  </div>
</form>
  )
};

