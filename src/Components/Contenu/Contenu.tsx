import { Contenu, InfoUrgence } from '../../Model/Contenu';
import React, { useState, useEffect } from 'react';
import './contenu.css';

interface ContenuProps {
    contenu: Contenu;
}

const InfoUrgenceObject: React.FC<InfoUrgence> = ({ nom, numero }) => {
    return (
      <div className="info-urgence">
        <div><strong>Nom:</strong> {nom}</div>
        <div><strong>Numéro:</strong> {numero}</div>
      </div>
    );
  };

const ContenuObject: React.FC<ContenuProps> = ({ contenu }) => {
    return (
        <div className="contenu-object">
            <div className="contenu-section">
                <strong>Risques:</strong>
                <ul>
                    {contenu.risques.map((risque, index) => (
                        <li key={index}>{risque}</li>
                    ))}
                </ul>
            </div>
            <div className="contenu-section">
                <strong>Lieux de Travail:</strong>
                <ul>
                    {contenu.lieuxTravail.map((lieu, index) => (
                        <li key={index}>{lieu}</li>
                    ))}
                </ul>
            </div>
            <div className="contenu-section">
                <strong>Lieu de Travail Exact:</strong> {contenu.lieuTravailExact || 'N/A'}
            </div>
            <div className="contenu-section">
                <strong>Date de Début de Travail:</strong> {contenu.dateDebutTravail ? new Date(contenu.dateDebutTravail).toLocaleString() : 'N/A'}
            </div>
            <div className="contenu-section">
                <strong>Date de Fin de Travail:</strong> {contenu.dateFinTravail ? new Date(contenu.dateFinTravail).toLocaleString() : 'N/A'}
            </div>
            <div className="contenu-section">
                <strong>Service:</strong> {contenu.service}
            </div>
            <div className="contenu-section">
                <strong>Infos d'Urgence:</strong>
                {contenu.infosUrgence && contenu.infosUrgence.length > 0 ? (
                    contenu.infosUrgence.map((info, index) => (
                        <div key={index} className="info-urgence">
                            <div><strong>Nom:</strong> {info.nom}</div>
                            <div><strong>Numéro:</strong> {info.numero}</div>
                        </div>
                    ))
                ) : (
                    <div>N/A</div>
                )}
            </div>
        </div>
    );
  };

export default ContenuObject;