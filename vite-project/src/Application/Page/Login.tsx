import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { http } from "../../Http/Axios.Instance";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);


async function connexion(username: string, password: string) {
  try {
    const response = await http.post("/login", { username, password });
    
    if (response.status === 200) {  // Utiliser un statut 200 pour succès
      console.log("Connexion réussie");
      const token = response.data.token;
      const _id = response.data._id;
      
      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);
      navigate("/search"); // Rediriger l'utilisateur après une connexion réussie
    } else {
    }
  } catch (error) {
    setError("Addresse mail ou mot de passe incorrecte")
    console.error("Erreur lors de la connexion:", error);
    // Afficher un message d'erreur à l'utilisateur si nécessaire
  }
}

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.currentTarget.value);
  };

  const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(event.currentTarget.checked);
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <form onSubmit={(e)=>{e.preventDefault();connexion(email, password)}}>
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold"> CONNECTE TOI MAINTENANT !</h1>
      <p className="py-6">
        Accède à ta TodoList personnelle et ne rate plus aucune de tes tâches importantes !
      </p>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email"  value={email} 
              onChange={handleEmailChange}  className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" value={password} 
              onChange={handlePasswordChange}  className="input" placeholder="*********" />
          <div><a className="link link-hover">Mot de passe oublié ?</a></div>
           <div><a onClick={() => navigate("/Register")} className="link link-hover">S'inscrire</a></div>
          <button onClick={() => navigate("/")} className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </div>
    </div>
    </form>
  </div>
</div>
  )
};

