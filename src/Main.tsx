import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Location } from 'react-router-dom';
import DashBoard from './Components/Connected/DashBoard/DashBoard';
import DemandesList from './Components/Connected/DemandeListing/DemandesList';
import Utilisateur from './Components/Utilisateurs/Utilisateurs';
import Accueil from './Components/Accueil/Accueil';
import Login from './Components/Authentification/Login';
import ObtenirListePermis from './Components/Permis/ObtenirListePermis';

interface AppRoutesProps {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    protocol: string;
    domain: string;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ token, setToken, protocol, domain }) => {
    const location = useLocation();
    const [usergroup, setUserGroup] = useState<string>("");

    const testSession = async () => {
       /* try {
            const response = await fetch(`${protocol}://${domain}/authentification/TestSession`, {
                method: "GET",
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error('Session test failed');
            }

            const data = await response.json();
            setUserGroup(data.groupe);
        } catch (error) {
            localStorage.removeItem("token");
            window.location.reload();
        }*/
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            //testSession();
        }

        const currentPath = location.pathname;
        if (!token && currentPath !== "/login") {
            window.location.href = "/login";
        } else if (token && currentPath === "/login") {
            window.location.href = "/";
        }
    }, [token, location]);

    return (
        <div className='app-container'>
            {token && <DashBoardContainer token={token} protocol={protocol} location={location} domain={domain} />}
            <div className='content-display'>
                <Routes>
                    <Route path="/" element={token ? <Accueil /> : <Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login onLogin={setToken} protocol={protocol} domain={domain} />} />
                    <Route path="/chat" element={token ? <DemandesList protocol={protocol} domain={domain} usergroup={usergroup} /> : <Navigate to="/login" replace />} />
                    <Route path="/gestion-utilisateurs" element={token ? <Utilisateur urlBase={`${protocol}://${domain}`} /> : <Navigate to="/login" replace />} />
                    <Route path="/liste-permis" element={token ? <ObtenirListePermis urlBase={`${protocol}://${domain}`} /> : <Navigate to="/login" replace />} />
                </Routes>
            </div>
        </div>
    );
};

const DashBoardContainer: React.FC<{ token: string; protocol: string; location: Location; domain: string }> = ({ token, protocol, location, domain }) => {
    return (
        <div className="dashboard-container">
            <DashBoard protocol={protocol} location={location} domain={domain} />
        </div>
    );
};

const Main: React.FC = () => {
    const [token, setToken] = useState<string>(localStorage.getItem("token") || "");
    const protocol = 'http';
    const domain = 'localhost:5054';

    return (
        <BrowserRouter>
            <AppRoutes token={token} setToken={setToken} protocol={protocol} domain={domain} />
        </BrowserRouter>
    );
}

export default Main;