import React, {useState,useEffect} from "react";
import { DemandeModel } from "../../../Model/DemandeModel";
import DemandeModuleApp  from "./DemandeModuleApproval";


//retourne les demandes 
function DemandeVue(props:any){
    const [demande,setDemande] = useState<DemandeModel>(props.value);
    const [modalData,setModalData] = useState<any>({});
    const [openModal,setOpenModal] = useState(false);

    //get du data lancer chaque changement dans les props
    useEffect(()=>{
        setDemande(props.value);
    },[props.value])

    
    //
    const viewDemande = async (idDemande:number) =>{
        await getDataForDemande(idDemande)
        //ouverture modal avec data
        setOpenModal(true);
    }

    //get le data selon demande id et ouvre le modal
    async function getDataForDemande(idDemande:number){
        //fetch(props.protocol + "://localhost:5054/Demande/GetDemande", {
        fetch(`${props.protocol}://${props.domain}/Demande/GetDemande?demandeId=${idDemande}`, {
            method: "Get",
            credentials: 'include',
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.ok ) {
                    return response.json();
                } else {
                    return new Error("Une erreur est survenu lors de l'appel à l'api");
                }
            })
            .then(response => {
                //ajoute le data du modal 
                setModalData(response);
            })
            .catch(err => {
                console.error('Api error: ', err);
            }); 

    }

    return (
        <div className="demande-permis-div">
           <div className="permis-value clickable-demande" onClick={()=>viewDemande(demande["Numéro"])}><span style={{width: "100%", overflow: "hidden" , whiteSpace:"nowrap" }}>{demande["Numéro"]}</span></div>
           <div className="permis-value">{demande["Service engineering"]}</div>
           <div className="permis-value">{demande["Hse"]}</div>
            <div className="permis-value">{demande["Chargé de projet"]}</div>
            <div className="permis-value">{demande["Date de création"].toString()}</div>
            <div className="permis-value">{demande["État"]}</div>
           {openModal === true ?
                <div className="modal-container">
                    <div  className="modal" >
                        <div className="modal-content">
                        <h1>Info supplémentaire</h1>
                            <div>Id:{modalData.id}</div>
                            {props.userGroupId}
                                <br />
                                { props.userGroupId == "HSE" ?  <DemandeModuleApp demandeid={modalData.id} etat={modalData.etat} protocol={props.protocol} domain={props.domain}  /> : null}
                                <br />
                            </div>
                        <br />
                        <button onClick={(event) => { setOpenModal(!openModal); window.location.reload(); }}>Fermer</button>
                    </div>
                </div>
                : null}
        </div>
    );
}

export default DemandeVue;