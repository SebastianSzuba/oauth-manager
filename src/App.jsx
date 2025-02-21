// Installiere die Abhängigkeiten zuerst mit:
// npm install pocketbase react-router-dom

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

function Home() {
  const [user, setUser] = useState(pb.authStore.record);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.record);
    });
    return () => unsubscribe();
  }, []);

  const loginWithOAuth = async (provider) => {
    try {
      const authData = await pb.collection("users").authWithOAuth2({ provider });
      console.log("Eingeloggt als:", authData);
    } catch (error) {
      console.error("OAuth-Login fehlgeschlagen:", error);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return (
    <div>
      <h1>OAuth2 Manager</h1>
      {user ? (
        <div>
          <p>Angemeldet als: {user.email || user.id}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>

          <button onClick={() => loginWithOAuth("github")}>Login mit GitHub</button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
