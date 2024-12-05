import React, {  useState,useEffect  } from 'react';
import DemandeVue from "./DemandeVue";
import { DemandeModel } from '../../../Model/DemandeModel';


/*interface LoginProps {
    protocol: string;
    onLogin: (arg: string) => void;
    onClickApropos: (arg: boolean) => void;
    apropos: boolean;
}*/

//le composant list de demandes
function DemandesList(props:any){
    
    const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState([]);
  const [withLLMAnswer, setWithLLMAnswer] = useState(false);
  const [nbSource, setnbSource] = useState(10);
  //const 

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleNbSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setnbSource(event.target.value ? parseInt(event.target.value) : 0);
  };

  const callLocalAPI =  async () => {
    setLoading(true);
    setError("");

    let bodyIn = {
      question: text,
      withLLMAnswer : withLLMAnswer,
      nbSource : nbSource
    };
    //bouton
    setLoading(true)

    fetch('http://10.4.117.25:5205/q-a', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*',
          'Accept': '*/*',
          'Cache-Control': 'no-cache',
        },
        //mode : "no-cors",
        body :  JSON.stringify( bodyIn),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); 
        })
        .then(data => {
          //console.log('Response:', data); 
          setAnswer(data.response.response)
          setMetadata(data.sources)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error:', error); 
        });
  };

  const afficheAnswer =  async () => {
    if (text.trim() === "") {
      setError("Entre une question.");
      return;
    }
    await callLocalAPI();
  };

  const buildDiv =  (data:any) => {
    let div = <div style={{width:"100%",marginBottom:"2px",border:"1px solid black"}}><b>Doc:</b> {data.doc}<br></br><b>URI:</b> {data.uri}</div>;
    return div;
  }

  const handleCheckboxChange = (event:any) => {
    setWithLLMAnswer(event.target.checked);
  };
    
    //le render
    return(
    <div className='demandes-background'>
        <div className='demandes-holder'>
            <div className="chat-container">
            <label>Question:</label>
                        <textarea
                        id="Q"
                        value={text}
                        onChange={handleChange}
                        rows={5}
                        cols={40}
                        />

                        <label>Reponse:</label>
                        <textarea
                        id="A"
                        value={answer}
                        rows={5}
                        cols={40}
                        readOnly
                        />
                        {error && <div>{error}</div>}

                        <button
                        onClick={afficheAnswer}
                        >
                        {loading ? "Loading..." : "Get Reponse"}
                        </button>

                        <label>LLM response:</label>
                        <input 
                        type="checkbox" 
                        checked={withLLMAnswer}
                        onChange={handleCheckboxChange}
                        />

                        <label>Nb de sources:</label>
                        <input 
                        type="number" 
                        value={nbSource}
                        onChange={handleNbSourceChange}
                        />

                        <label>Sources:</label>
                        <div style={{overflow:"scroll", height:"200px"}}>
                            {metadata.length > 0 ? (
                            metadata.map((source, index) => (
                                <div key={index}>
                                {buildDiv(source)}
                                </div>
                            ))
                            ) : (
                            <p>Pas de data</p>
                            )}
                        </div>

                            </div>
                        </div>
                    </div>    
    
    );
}

export default DemandesList;

//<h1 className="chat-title">Chat</h1>
//<div className="chat-input-container">
//<textarea className="chat-textarea"></textarea>
//</div>

/*<h1 className='demande-holder-title'>Demandes de permis de travail</h1>
            <div className='info-boxes-container'>
                {(typesDetat!==undefined && typesDetat!==null) ?typesDetat.map((value,index) => (
                <div className='info-boxes' key={index}>
                    <p>Demandes : {value.type}</p>
                    <h4>{value.nombre}</h4>
                </div>
                )):null}         
            </div>
            <div className='permis-tabs-holder'>
                {(typesDetat!==undefined && typesDetat!==null) ? typesDetat.map((value,index) => (
                <div key={index} className={clickedTab === value.type ? "permis-tab clicked-permis-tab" : "permis-tab"} onClick={()=>handleClickTab(value.type)}>
                    {value.type}
                </div>
                )):null}
            </div> 
            <div className='permis-headers-container'>
                { (DemandesArr && DemandesArr.length > 0 )  ? Object.keys( DemandesArr[0]).map((v,i) => (
                <div  className='permis-header' key={i}>{v}</div>
                )) : null}
                
            </div>  
             <div className='permis-headers-container'>
             {(DemandesArr && DemandesArr.length > 0 )  ?Object.keys( DemandesArr[0]).map((v,i) => (
               <div  className='permis-header' key={i} style={{paddingRight:"20px"}}><input type='text'  onChange={changefilterData} name={v} style={{width: "100%", overflow: "hidden" , whiteSpace:"nowrap" }} ></input></div> 
            )):null}
            </div>
            <div className='permis-top-container'>
                <div className='permis-container' >
                    { DemandesArrView.map((value, index) => (
                        value["État"] === clickedTab ? (
                            <DemandeVue key={index}  value={value} protocol={props.protocol} domain={props.domain} userGroupId={props.usergroup} /> 
                        ) : null
                    ))} 
                </div>
            </div>
            
               
    //get du data
    useEffect(() => {  
        getDataForUser(); 
    }, []);

    //les types d'états
    const [typesDetat,setTypeDetat] = useState<any[]>([]);

    //filtres de vues
    const [dataFilters, setdataFilters] = useState<{ [key: string]: string }>({});

    //les demandes et la vue des demandes
    const [DemandesArr, setDemanArr] = useState<DemandeModel[]>([]);
    const [DemandesArrView, setDemandesArrView] = useState<DemandeModel[]>([]);
    //filtre des états
    useEffect(() => {  
        getEtats();
    }, [DemandesArr]);

    //filtre du data
    useEffect(() => {   
        filterData();
    }, [dataFilters]);

    //de base en cours
    const [clickedTab, setClickedTab] = useState<string>("");

    const handleClickTab = (tabName :string) =>{
        setClickedTab(tabName);
    }

    //vas chercher les états une fois à chaque reload
    const getEtats = () =>{
        let uniqueEtats = new Set(DemandesArr.map(demande => demande["État"]));
        let typesDetatlet = Array.from(uniqueEtats);
        let arrayCountBytype : any[] = [];
        let nb = 0;
        typesDetatlet.forEach(etat => {
            nb =0;
            DemandesArr.forEach(demande => {
                if(demande["État"] == etat){
                    nb++;
                }
            });

            if (etat !== undefined) { 
                let json = {}; 
                arrayCountBytype.push( { type: etat , nombre: nb });
            }
        });
        setTypeDetat(arrayCountBytype);
        if(arrayCountBytype.length>0){
            setClickedTab(arrayCountBytype[0].type);
        }
    }

    //change dynamiquement les filtres
    const changefilterData: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        let nameOfInput = e.target.name;
        let valueOfInput = e.target.value;
        
        let objectJ: { [key: string]: any } = { ...dataFilters };
        objectJ[nameOfInput] =valueOfInput;
        
        setdataFilters(objectJ);
    };

    //pour filtrer le data selon les params
    function filterData(){
        let hasChanges = false;
        let filteredData:DemandeModel[] = [];
        filteredData = DemandesArr;

        DemandesArr.forEach(demande => {
            let ajouteData = true;
            for (let key in dataFilters) {
                if(dataFilters[key]!==undefined){
                    hasChanges = true;
                    const demandeValue = demande[key as keyof DemandeModel]; // Accéder à la propriété dynamiquement
                    const filterValue = dataFilters[key];
                    if (!String(demandeValue).toLowerCase().includes(String(filterValue).toLowerCase())) {
                        ajouteData= false;
                        if(arrayHasObject(filteredData,demande)){
                            let updatedFilteredData = filteredData.filter((item:DemandeModel) => !arrayHasObject([demande], item));
                            filteredData = updatedFilteredData;
                        }
                        break;
                }
            }
            if (ajouteData && !arrayHasObject(filteredData,demande)) {
                filteredData.push(demande);
            }
        }
        });
        if(hasChanges){
            setDemandesArrView(filteredData);
        }
    }

    //function similaire à equals() 
    function arrayHasObject(array: any[], targetObject: any): boolean {
        return array.some((object) => {
            return JSON.stringify(object) === JSON.stringify(targetObject);
        });
    }

    //fetch du data selon le user id
    function getDataForUser(){
        //fetch(props.protocol + "://localhost:5054/Demande/GetDemandes", {

        //props.userid props.groupid
        fetch(`${props.protocol}://${props.domain}/Demande/GetDemandes`, {
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
                setDemanArr(response);
                setDemandesArrView(response); 
                
            })
            .catch(err => {
                console.error('Api error: ', err);
            });
    }*/