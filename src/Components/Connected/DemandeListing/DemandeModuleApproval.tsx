import React,{useEffect, useState} from "react";

function DemandeModuleApproval(props:any){

    useEffect(() => {   
        setDemandeIdToApprove(props.demandeid);
    }, [props]);

    let [demandeIdToApprove,setDemandeIdToApprove] = useState<number>(-1);
    let [isChecked,setIschecked] = useState<boolean>(false);
    let [feedBack,setfeedBack] = useState<string>("");

    function ApproveByID(){
        let postData = {
            demandeId : demandeIdToApprove,
            estApprouver : isChecked       
        }

        fetch(`${props.protocol}://${props.domain}/Demande/ApprouverDemande`,
            {
                headers: { "Content-Type": "application/json" },
                method:"Post",
                credentials:"include",
                body:JSON.stringify(postData)
            }
            ).then(response => {
                if (response.ok ) {
                    setfeedBack("Succès")
                    return ;
                }else{
                    setfeedBack("Erreur")
                } 
            })
            .then(response => {
                
            })
            .catch(err => {
                setfeedBack("Erreur")
                console.error('Api error: ', err);
            });
    }

    return(
        <>
            <h3>État actuel: {props.etat}</h3>
            <br />
                {props.etat === "Ferme" ? null :<> <input  onClick={()=>setIschecked(true)} type="radio" name="appr" value="Approver"   />Approuver
            <br />
                <input  onClick={()=>setIschecked(false)}  value="Refuser"  name="appr" type="radio"   />Refuser
            <br />
                <button onClick={ApproveByID}>Save</button>
            <br />
            <br />
            {feedBack}
            </>
            }
        </>
    );

}

export default DemandeModuleApproval;