import React, { useState, useEffect } from 'react';
import Select, {MultiValue} from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './utilisateursStyles.css';

interface ModificationProps{
    urlBase: string
}

interface Groupe{
    groupeId: number;
    groupeName: string;
}

interface ModificationOptions{
    login: boolean;
    nom: boolean;
    prenom: boolean;
    email: boolean;
    motDePasse: boolean;
    groupe: boolean;
};

interface Utilisateur {
    nom: string;
    prenom: string;
    login: string;
    email: string;
    groupeId: number;
    groupeName: string;
}


function Modification(props: ModificationProps): JSX.Element {

    const [nom, setNom] = useState<string>("");
    const [prenom, setPrenom] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [emailValide, setEmailValide] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [loginAModifier, setLoginAModifier] = useState<string>("");
    const [motDePasse, setMotDePasse] = useState<string>("");
    const [groupe, setGroupe] = useState<number>(0);

    const [groupes, setGroupes] = useState<Groupe[]>([]);
    const [popUp, setPopUp] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [options, setOptions] = useState<ModificationOptions>({
        login: false,
        nom: false,
        prenom: false,
        email: false,
        motDePasse: false,
        groupe: false
    });

    const dropdownOptions = [
        { value: 'login', label: 'Login' },
        { value: 'nom', label: 'Nom' },
        { value: 'prenom', label: 'Prénom' },
        { value: 'email', label: 'Courriel' },
        { value: 'motDePasse', label: 'Mot de passe' },
        { value: 'groupe', label: 'Groupe' }
    ];

    const optionsSelectLogin = utilisateurs.map((utilisateur) => ({
        value: utilisateur.login,
        label: utilisateur.login,
      }));

    useEffect(() => {
        // Fonction pour récupérer les utilisateurs depuis l'API
        const fetchLogins = async () => {
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
        fetchLogins();
    }, [popUp]);

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

    const handleOptionChange = (selectedOptions: MultiValue<{value:string, label:string}>) => {
        const updatedOptions: Partial<ModificationOptions> = {};
        
        // Mettre à true les options sélectionnées
        selectedOptions.forEach((option) => {
            updatedOptions[option.value as keyof ModificationOptions] = true;
        });
        
        // Mettre à false les options désélectionnées
        dropdownOptions.forEach((option) => {
            if (!selectedOptions.some((selectedOption) => selectedOption.value === option.value)) {
                updatedOptions[option.value as keyof ModificationOptions] = false;

                switch(option.value){
                    case "login":
                        setLogin("");
                        break;
                    case "nom":
                        setNom("");
                        break;
                    case "prenom":
                        setPrenom("");
                        break;
                    case "email":
                        setEmail("");
                        break;
                    case "motDePasse":
                        setMotDePasse("");
                        break;
                    case "groupe":
                        setGroupe(0);
                        break;
                    default:
                        break;
                }

            }
        });
    
        setOptions({ ...options, ...updatedOptions });
    };

    const modifierCompteSubmit = async () =>{

        if(!loginAModifier){
            setPopUp("Veuillez entrer le login de l'utilisateur que vous souhaitez modifier.");
            return;
        }

        setLoading(true);
        
        const options = {
            Nom: nom,
            Prenom: prenom,
            Email: email,
            Login: login,
            MotDePasse: motDePasse,
            GroupeId: groupe
        }

        // Aller demander au backend
        try {
            const response = await fetch(props.urlBase + `/utilisateur/Modifier?login=${loginAModifier}`, {
                method: "PUT",
                credentials: 'include',
                body: JSON.stringify(options),
                headers: { "Content-Type": "application/json" }
            })

            const data = await response.json();

            if(response.status === 200){
                let successMessage = `L'utilisateur ${data.nom} ${data.prenom} a bien été modifié sous le login "${data.login}" et le courriel "${data.email}"!`;

                // S'il y a des messages d'erreur
                if (data.msgErreurs && data.msgErreurs.length > 0) {
                    // Concaténation des messages d'erreur
                    const errorMessage = data.msgErreurs.join(", ");
                    // Ajout des messages d'erreur au message de succès
                    successMessage += ` Erreurs : ${errorMessage}`;
                }

                setPopUp(successMessage);
            }else{
                setPopUp(data.message);
            }
        } catch (error) {
            setPopUp("Erreur technique, veuillez réessayer ou contacter un administrateur du système.");
        }

        setLoading(false);
    }

    return(
        <div className='operation-container operation-modification'>
            <h2>Modification d'utilisateurs</h2>
            <div className='form-group'>
                <Select
                    isMulti
                    options={dropdownOptions}
                    onChange={(selectedOptions) => handleOptionChange(selectedOptions)}
                    placeholder="Sélectionnez les options de modification"
                />
                <Select
                    options={optionsSelectLogin}
                    onChange={(optionSelect) => optionSelect?.value && setLoginAModifier(optionSelect?.value?.toString())}
                    placeholder="Sélectionnez un utilisateur à modifier"
                />
            </div>
            <div className='form-group'>
                {options.nom && (
                    <div>
                        <label htmlFor='nomCreationInput'>Nom :</label>
                        <input 
                            id='nomCreationInput' 
                            type='text' 
                            value={nom} 
                            onChange={(e) => setNom(e.target.value)}
                            placeholder='Entrez le nouveau nom'
                        />
                    </div>
                )}
                {options.prenom &&(
                    <div>
                        <label htmlFor='prenomCreationInput'>Prénom :</label>
                        <input 
                            id='prenomCreationInput' 
                            type='text' 
                            value={prenom} 
                            onChange={(e) => setPrenom(e.target.value)}
                            placeholder='Entrez le nouveau prénom'
                        />
                    </div>
                )}
                {options.login &&(
                    <div>
                        <label htmlFor='loginCreationInput'>Login :</label>
                        <input 
                            id='loginCreationInput' 
                            type='text' 
                            value={login} 
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder='Entrez le nouveau login'
                        />
                    </div>
                )}
                {options.email && (
                    <div>
                        <label htmlFor='emailCreationInput'>Courriel :</label>
                        <input 
                            id='emailCreationInput' 
                            type='email' 
                            value={email} 
                            onChange={handleEmailChange} // Utilise le gestionnaire de changement d'e-mail
                            placeholder='Entrez le nouveau courriel'
                            className={email && !emailValide ? 'invalid' : ''} // Ajoute une classe pour indiquer la validité de l'e-mail
                        />
                        {email && !emailValide && <p className='error-message'>Courriel invalide.</p>}
                    </div>
                )}
                {options.motDePasse && (
                    <div>
                        <label htmlFor='passwordCreationInput'>Mot de passe :</label>
                        <input 
                            id='passwordCreationInput' 
                            type='password' 
                            value={motDePasse} 
                            onChange={(e) => setMotDePasse(e.target.value)}
                            placeholder='Entrez le nouveau mot de passe'
                        />
                    </div>
                )}
                {options.groupe && (
                    <div>
                        <label htmlFor='groupeSelectionInput'>Groupe :</label>
                        <div className='select-container'>
                            <select id="groupeSelectionInput"
                                onChange={(e) => setGroupe(parseInt(e.target.value, 10))}
                                value={groupe || ''}>
                                <option value=''>Sélectionnez le nouveau groupe</option>
                                {groupes.map((groupeActuel) => (
                                    <option key={groupeActuel.groupeId} value={groupeActuel.groupeId}>
                                        {groupeActuel.groupeName}
                                    </option>
                                ))}
                            </select>
                            <div className='select-arrow'></div>
                        </div>
                    </div>
                )}
            </div>
            <button className='modificationButton' disabled={loading} onClick={modifierCompteSubmit}>{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Modifier'}</button>
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

export default Modification;