import React, { useState, useEffect } from 'react';
import './obtenirListePermisStyle.css';
import { Contenu } from '../../Model/Contenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ContenuObject from '../Contenu/Contenu';

interface ListePermisProps{
    urlBase: string
}

interface PermisObjectProps {
    nomApprobateur: string;
    prenomApprobateur: string;
    nomResponsable: string;
    prenomResponsable: string;
    nomDemandeur: string;
    prenomDemandeur: string;
    dateCreation: Date;
    dateExpiration: Date;
    contenu: Contenu;
}

const PermisObject: React.FC<PermisObjectProps> = ({
    nomApprobateur,
    prenomApprobateur,
    nomResponsable,
    prenomResponsable,
    nomDemandeur,
    prenomDemandeur,
    dateCreation,
    dateExpiration,
    contenu
}) => {

    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    return (
        <div className="permis-object">
            <div className="permis-header">
                <div>
                    <strong>Approbateur:</strong> {prenomApprobateur} {nomApprobateur}
                </div>
                <div>
                    <strong>Responsable:</strong> {prenomResponsable} {nomResponsable}
                </div>
                <div>
                    <strong>Demandeur:</strong> {prenomDemandeur} {nomDemandeur}
                </div>
            </div>
            <div className="permis-body">
                <div>
                    <strong>Création:</strong> {new Date(dateCreation).toLocaleDateString()}
                </div>
                <div>
                    <strong>Expiration:</strong> {new Date(dateExpiration).toLocaleDateString()}
                </div>
            </div>
            <button className="boutonAfficherContenu" onClick={toggleContent}>
                {showContent ? 'Masquer le contenu' : 'Afficher le contenu'}
            </button>
            {showContent && <ContenuObject contenu={contenu}/>}
        </div>
    );
};

interface RetourPermis {
    nomApprobateur: string;
    prenomApprobateur: string;
    nomResponsable: string;
    prenomResponsable: string;
    nomDemandeur: string;
    prenomDemandeur: string;
    dateCreation: Date;
    dateExpiration: Date;
    contenu: Contenu;
}

function ObtenirListePermis(props: ListePermisProps){

    const [permisList, setPermisList] = useState<RetourPermis[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${props.urlBase}/Permis/Obtenir`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data: RetourPermis[] = await response.json();
                setPermisList(data);
            } catch (error) {
                setError("Erreur lors de la recuperation des permis.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Chargement... <FontAwesomeIcon icon={faSpinner} spin /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='permis-container'>
            <h1>
                Liste des permis qui vous sont liés
            </h1>

            <div className='listePermis-container'>
                {permisList.map((permis, index) => (
                    <PermisObject key={index} {...permis} />
                ))}
            </div>
        </div>
    );

}

export default ObtenirListePermis;