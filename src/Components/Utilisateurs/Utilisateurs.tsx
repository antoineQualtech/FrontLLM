import React, { useState } from 'react';
import './utilisateursStyles.css'
import Creation from './Creation';
import Modification from './Modification';
import Suppression from './Suppression';

interface UtilisateurProps{
    urlBase: string
}

function Utilisateur(props: UtilisateurProps){

    const [mode, setMode] = useState<number>(0);
    
    return (
        <div className='utilisateur'>

            <h1>Panneau des opérations utilisateurs</h1>

            {/* Selection des operations utilisateur */}
            {mode === 0 ? (
                <div className='boutons-container'>
                    <button className='creationButton' onClick={() => setMode(1)}>Création</button>
                    <button className='modificationButton' onClick={() => setMode(2)}>Modification</button>
                    <button className='suppressionButton' onClick={() => setMode(3)}>Suppression</button>
                </div>
            ) : (
                <div className='retourChoix-container'>
                    <button className='modificationButton' onClick={() => setMode(0)}>Choix des opérations</button>
                </div>
            )}

            {/* Creation utilisateur */}
            {mode === 1 && (<Creation urlBase={props.urlBase}/>)}

            {/* Modification utilisateur */}
            {mode === 2 && (<Modification urlBase={props.urlBase}/>)}

            {/* Suppression utilisateur */}
            {mode === 3 && (<Suppression urlBase={props.urlBase}/>)}
        </div>
    );
}

export default Utilisateur;