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
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#2D2C5A] text-white"> 
      <div className="flex flex-col items-center justify-center w-full">
        <form onSubmit={(e)=>{e.preventDefault();connexion(email, password)}} className="p-5 rounded-lg w-[300px] text-center">
          <h2 className="mb-6 text-2xl font-semibold">Se connecter</h2>
          
          <p className="text-red-500 mb-4">{error}</p>

          <div className="relative right-20">
            <label htmlFor="mail" className="mb-2 text-md">Adresse mail</label>
          </div>
          <div className="mb-5">
            <input 
              type="email" 
              value={email} 
              onChange={handleEmailChange} 
              placeholder="Adresse mail" 
              className="w-full p-2.5 rounded border border-gray-300 text-black bg-white"
              required 
            />
          </div>
          <div className="relative right-20">
            <label htmlFor="password">Mot de passe</label>
          </div>
          <div className="mb-5">
            <input 
              type="password" 
              value={password} 
              onChange={handlePasswordChange} 
              placeholder="**************" 
              className="w-full p-2.5 rounded border border-gray-300 text-black bg-white"
              required 
            />
          </div>

          <div className="flex justify-center items-center mb-10">
            <label className="text-sm">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={handleRememberMeChange} 
                className="mr-2"
              /> 
              Se souvenir de moi
            </label>
          </div>
          <button type="submit" className="w-full p-2.5 bg-[#f8c700] rounded text-[#2D2C5A] text-lg mb-5 cursor-pointer">
            Connectez-vous
          </button>
          <div className="my-4">
            <div className="relative w-full h-1 bg-[#007bff] mb-6"> 
              <div className="absolute left-0 h-1 bg-[#f8c700]" style={{ width: "50%" }} ></div>
          </div>
          </div>
          <p className="p-3">Vous n'avez pas de compte ?</p>
          <div className="flex justify-between mb-3 text-sm">
            <button onClick={() => navigate("/register")} className="w-full p-2.5 bg-[#007bff] mt-0 rounded text-[#000000] text-lg cursor-pointer">
              Créer mon compte
            </button>
          </div>
        </form>
            <NavLink to="/reset" className="text-[#007bff] ml-4 text-lg">Mot de passe oublié ?</NavLink>
      </div>
    </div>
  );
};

