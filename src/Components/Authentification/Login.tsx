import React, { useState } from 'react';
import usine from '../../images/usine.png';
import henkelimg from '../../images/OIP.png';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/*interface LoginProps {
    protocol: string;
    onLogin: (arg: string) => void;
    onClickApropos: (arg: boolean) => void;
    apropos: boolean;
}*/

function Login(props:any): JSX.Element {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const closeErrorPopUp = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setError("");
    }

    const handleLogin = (event?: React.FormEvent<HTMLFormElement>) => {

        setLoading(true);

        if (event) event.preventDefault();

        const UserNpass = {
            username: username,
            password: password
        }

        if(username == "test" && password == "test"){
            localStorage.token = "connected";
            props.onLogin("change state for refresh");

        }

        /*fetch(`${props.protocol}://${props.domain}/Authentification/Connexion`, {
            method: "POST",
            body: JSON.stringify(UserNpass),
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            
        })
            .then(response => {
                setLoading(false);
                if (response.ok) {
                    localStorage.token = "connected";
                    props.onLogin("change state for refresh");
                    return;
                } else {
                    return response.json();
                }
            })
            .then(response => {
                if (response === undefined) {
                    return;
                }
                setError(response.message);
            })
            .catch(err => {
                setLoading(false);
                console.error('Login error: ', err);
                setError("Erreur technique, veuillez réessayer ou contacter un administrateur du système.")
            });*/
    }

    return (
        <div className='main'>
            <div className='top-container' >
                <img src={usine} alt='Background' className='background-image'></img>
                <div className='red-container'></div>
                <div className='connexion-container' >
                    <h1 className='connexion-container-title'>Connexion</h1>
                    <form onSubmit={(e) => handleLogin(e)} className="login-form" noValidate >
                        <label htmlFor='username'>Nom d'utilisateur</label>
                        <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)} required></input>
                        <label htmlFor='password'>Mot de passe</label>
                        <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                        <br />
                        <button type='submit' disabled={loading} className='button-login'>{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Se connecter'}</button>
                    </form>
                </div>
            </div>
            {error !== "" ?
                <div className="modal-container">
                    <div id="error-popup" className="modal" >
                        {error}
                        <br />
                        <button onClick={closeErrorPopUp}>Fermer</button>
                    </div>
                </div>
                : null}
        </div>
    );
}

export default Login;