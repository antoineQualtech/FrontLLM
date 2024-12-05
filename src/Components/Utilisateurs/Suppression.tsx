import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './utilisateursStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface SuppressionProps{
    urlBase: string
}

interface Utilisateur {
    nom: string;
    prenom: string;
    login: string;
    email: string;
    groupeId: number;
    groupeName: string;
}

function Suppression(props: SuppressionProps): JSX.Element {

    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [loginUserSelected, setLoginUserSelected] = useState<string>("");
    const [popUp, setPopUp] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Fonction pour récupérer les utilisateurs depuis l'API
        const fetchUtilisateurs = async () => {
            try {
                const response = await fetch(props.urlBase + "/utilisateur/ObtenirListeUtilisateurs", {
                    method: "GET",
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }
                })
                if (!response.ok) {
                    throw new Error();
                }
                const data = await response.json();
                setUtilisateurs(data);
            } catch (error) {
                console.error("Impossible de recuperer les utilisateurs");
            }
        };

        // Appel de la fonction pour récupérer les utilisateurs
        fetchUtilisateurs();
    }, [popUp]);

    const supprimerCompteSubmit = async () => {

        if(!loginUserSelected){
            setPopUp("Veuillez sélectionner un utilisateur!");
            return;
        }

        setLoading(true);

        // Aller demander au backend
        try {
            const response = await fetch(`${props.urlBase}/utilisateur/Supprimer?login=${loginUserSelected}`, {
                method: "DELETE",
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
            })

            const data = await response.json();

            if(response.status === 200){
                setPopUp(`L'utilisateur ` + data.nom + ` ` + data.prenom + ` avec le login "` + data.login + `" a bien été supprimé!`);
                setLoginUserSelected("");
            }else{
                setPopUp(`Impossible de supprimer l'utilisateur "` + data.message + `".`);
            }
        } catch (error) {
            setPopUp("Erreur technique, veuillez réessayer ou contacter un administrateur du système.");
        }

        setLoading(false);
    }

    return(
        <div className='operation-container operation-suppression'>
            <h2>Suppression d'utilisateurs</h2>
            <div className='select-container suppression-container'>
                <select
                    onChange={(e) => setLoginUserSelected(e.target.value)}
                    value={loginUserSelected || ''}>
                    <option value=''>Sélectionnez un utilisateur</option>
                    {utilisateurs.map((utilisateur) => (
                        <option key={utilisateur.login} value={utilisateur.login}>
                            {utilisateur.nom} {utilisateur.prenom} ({utilisateur.login})
                        </option>
                    ))}
                </select>
                <div className='select-arrow'></div>
            </div>
            <button className='suppressionButton' disabled={loading} onClick={supprimerCompteSubmit}>{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Supprimer'}</button>
            {popUp && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>{popUp}</p>
                        <button onClick={() => setPopUp(null)}>Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Suppression;