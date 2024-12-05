import React, { useState, useEffect } from 'react';
import './utilisateursStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface CreationProps{
    urlBase: string
}

interface Groupe{
    groupeId: number;
    groupeName: string;
}

function Creation(props: CreationProps): JSX.Element {

    const [nom, setNom] = useState<string>("");
    const [prenom, setPrenom] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [emailValide, setEmailValide] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [motDePasse, setMotDePasse] = useState<string>("");
    const [groupe, setGroupe] = useState<number>(0);

    const [groupes, setGroupes] = useState<Groupe[]>([]);

    const [popUp, setPopUp] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Fonction pour récupérer les groupes depuis l'API
        const fetchGroupes = async () => {
            try {
                const response = await fetch(props.urlBase + "/groupe/ObtenirGroupes", {
                    method: "GET",
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }
                })
                if (!response.ok) {
                    throw new Error();
                }
                const data = await response.json();
                setGroupes(data);
            } catch (error) {
                console.error("Impossible de recuperer les groupes");
            }
        };

        // Appel de la fonction pour récupérer les groupes
        fetchGroupes();
    }, []);

    // Fonction de validation de l'e-mail
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Gestionnaire de changement de l'e-mail
    const handleEmailChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        // Vérifie si la nouvelle valeur de l'e-mail est valide, et la set au useState
        if(validateEmail(newEmail))
            setEmailValide(newEmail);
        else
            setEmailValide("");
    }

    const creerCompteSubmit = async () => {

        if(emailValide === ""){
            setPopUp("Le courriel entré est invalide!");
            return;
        }

        const options = {
            Nom: nom,
            Prenom: prenom,
            Email: emailValide,
            Login: login,
            MotDePasse: motDePasse,
            GroupeId: groupe
        };

        setLoading(true);

        try {
            const response = await fetch(props.urlBase + "/utilisateur/Creer", {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(options),
                headers: { "Content-Type": "application/json" }
            })

            const data = await response.json();

            if(response.status === 200){
                setPopUp(`L'utilisateur ` + data.nom + ` ` + data.prenom + ` a bien été ajouté sous le login "` + data.login + `" et le courriel "` + data.email + `"!`);
            }else{
                setPopUp(data.message);
            }
        } catch (error) {
            setPopUp("Erreur technique, veuillez réessayer ou contacter un administrateur du système.");
        }

        setLoading(false);
    }

    return(
        <div className='operation-container operation-creation'>
            <h2>Création d'utilisateurs</h2>
            <div className='form-group'>
                <label htmlFor='nomCreationInput'>Nom :</label>
                <input 
                    id='nomCreationInput' 
                    type='text' 
                    value={nom} 
                    onChange={(e) => setNom(e.target.value)}
                    placeholder='Entrez le nom'
                />
                <label htmlFor='prenomCreationInput'>Prénom :</label>
                <input 
                    id='prenomCreationInput' 
                    type='text' 
                    value={prenom} 
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder='Entrez le prénom'
                />
                <label htmlFor='loginCreationInput'>Login :</label>
                <input 
                    id='loginCreationInput' 
                    type='text' 
                    value={login} 
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder='Entrez le login'
                />
                <label htmlFor='emailCreationInput'>Courriel :</label>
                    <input 
                        id='emailCreationInput' 
                        type='email' 
                        value={email} 
                        onChange={handleEmailChange} // Utilise le gestionnaire de changement d'e-mail
                        placeholder='Entrez le courriel'
                        className={email && !emailValide ? 'invalid' : ''} // Ajoute une classe pour indiquer la validité de l'e-mail
                    />
                    {email && !emailValide && <p className='error-message'>Courriel invalide.</p>}
                <label htmlFor='passwordCreationInput'>Mot de passe :</label>
                <input 
                    id='passwordCreationInput' 
                    type='password' 
                    value={motDePasse} 
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder='Entrez le mot de passe'
                />
                <label htmlFor='groupeSelectionInput'>Groupe :</label>
                <div className='select-container'>
                    <select id="groupeSelectionInput"
                        onChange={(e) => setGroupe(parseInt(e.target.value, 10))}
                        value={groupe || ''}>
                        <option value=''>Sélectionnez un groupe</option>
                        {groupes.map((groupeActuel) => (
                            <option key={groupeActuel.groupeId} value={groupeActuel.groupeId}>
                                {groupeActuel.groupeName}
                            </option>
                        ))}
                    </select>
                    <div className='select-arrow'></div>
                </div>
            </div>
            <button className='creationButton' disabled={loading} onClick={creerCompteSubmit}>{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Créer'}</button>
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

export default Creation;