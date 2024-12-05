
export interface InfoUrgence {
  nom: string;
  numero: string;
}

export interface Contenu {
  risques: Array<string>;
  lieuxTravail: Array<string>;
  lieuTravailExact: string;
  dateDebutTravail: Date | undefined;
  dateFinTravail: Date | undefined;
  service: string;
  infosUrgence: Array<InfoUrgence> | undefined;
}