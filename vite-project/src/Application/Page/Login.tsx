import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { http } from "../../Http/Axios.Instance";

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    AppleID: any;
  }
}

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
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      const response = await http.post("/login", { username, password });
      if (response.status === 200) {
        const token = response.data.token;
        const _id = response.data._id;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", _id);
        navigate("/"); // Rediriger l'utilisateur après connexion réussie
      }
    } catch (error) {
      setError("Adresse mail ou mot de passe incorrecte");
      console.error("Erreur lors de la connexion:", error);
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


  // Charger le script Apple si nécessaire
  useEffect(() => {
    if (!window.AppleID) {
      const script = document.createElement("script");
      script.src =
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const loginWithApple = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      if (!window.AppleID) throw new Error("Apple SDK non chargé");

      // Initialiser AppleID
      window.AppleID.auth.init({
        clientId: "com.example.web", // ton client ID Apple
        scope: "email name",
        redirectURI: "https://example.com/callback", // facultatif si pas redirect
        usePopup: true,
      });

      // Ouvrir la popup Apple pour récupérer l'id_token
      const response = await window.AppleID.auth.signIn();
      const appleId = response.user?.sub || response.authorization.id_token; // identifiant Apple
      const userEmail = response.user?.email || email || "error@test.com";

      // Appel à ton backend
      const backendRes = await http.post("/loginWithApple", {
        appleId,
        email: userEmail,
      });

      if (backendRes.status === 200) {
        const { token, _id } = backendRes.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", _id);
        navigate("/"); // redirection après succès
      } else {
        console.error("Erreur backend Apple Sign-In", backendRes.data);
      }
    } catch (err: any) {
      console.error("Erreur login Apple:", err);
      alert(err.message || "Impossible de se connecter avec Apple");
    }
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
          <button type="submit" className="btn btn-active btn-info">Login</button>
            <p className="text-red-500 mb-4">{error}</p>
              <button type="button" className="btn bg-black text-white border-black" onClick={loginWithApple}>
                   <svg aria-label="Apple logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1195 1195">
                    <path fill="white" d="M1006.933 812.8c-32 153.6-115.2 211.2-147.2 249.6-32 25.6-121.6 25.6-153.6 6.4-38.4-25.6-134.4-25.6-166.4 0-44.8 32-115.2 19.2-128 12.8-256-179.2-352-716.8 12.8-774.4 64-12.8 134.4 32 134.4 32 51.2 25.6 70.4 12.8 115.2-6.4 96-44.8 243.2-44.8 313.6 76.8-147.2 96-153.6 294.4 19.2 403.2zM802.133 64c12.8 70.4-64 224-204.8 230.4-12.8-38.4 32-217.6 204.8-230.4z"></path>
                  </svg>
                  Login with Apple
                 </button>
                    <button className="btn bg-white text-black border-[#e5e5e5]">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            Login with Google
          </button>
              <button className="btn bg-[#0967C2] text-white border-[#0059b3]">
                <svg aria-label="LinkedIn logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="white" d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fillRule="evenodd"></path></svg>
                Login with LinkedIn
              </button>
        </fieldset>
      </div>
    </div>
    </form>
  </div>
</div>
  )
};