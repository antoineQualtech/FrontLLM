import { Contenu } from "./Contenu";

export interface Demande {
    dateCreation: Date | null;
    responsableNom: string | "";
    contenu: Contenu | undefined;
}