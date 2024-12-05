import React, { Component } from 'react';
import { Location, NavLink } from 'react-router-dom';
import profil from '../../../images/profile-svgrepo-com.svg';
import pages from '../../../images/layer-svgrepo-com.svg';
import hse from '../../../images/hse.png';
import user from '../../../images/user.png';
import './dashboard-styles.css';

interface DashboardProps {
    protocol: string;
    location: Location;
    domain:string; 
}

interface DashboardState {
    showMenu: boolean;
    nomUtilisateur: string;
    showUserMenu: boolean;
    usergroup: string;
    userId: number;
    affichePages:boolean;
    afficheProfil:boolean;
}

class DashBoard extends Component<DashboardProps, DashboardState> {
    constructor(props: DashboardProps) {
        super(props);
        this.state = {
            showMenu: false,
            showUserMenu: false,
            nomUtilisateur: "",
            userId: -1,
            usergroup: "",
            afficheProfil : false,
            affichePages: false
        };

       // this.testSession = this.testSession.bind(this);
        this.destroySession = this.destroySession.bind(this);
        this.renderNavLink = this.renderNavLink.bind(this);
    }

    componentDidMount(): void {
        //this.testSession();
    }

    async testSession(){
        try {
            const response = await fetch(`${this.props.protocol}://${this.props.domain}/authentification/TestSession`, {
                method: "GET",
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error('Session test failed');
            }

            const data = await response.json();
            this.setState({
                nomUtilisateur: data.prenom,
                userId: data.userid,
                usergroup: data.groupe
            });
        } catch (error) {
            localStorage.removeItem("token");
            window.location.reload();
        }
    }

    async destroySession(){
        /*try {
            await fetch(`${this.props.protocol}://${this.props.domain}/authentification/DeConnexion`, {
                method: "DELETE",
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
            });
        } finally {
            localStorage.removeItem("token");
            window.location.reload();
        }*/
        localStorage.removeItem("token");
        window.location.reload();
    }

    renderNavLink(a: string, nom: string){
        return (
            <NavLink
                to={a}
                className='navLink'
                style={{
                    color: this.props.location.pathname === a ? '#fff' : '#999',
                    backgroundColor: this.props.location.pathname === a ? '#333' : 'transparent',
                }}
            >
                {nom}
            </NavLink>
        );
    }

    toggleProfil = () => {
        this.setState(prevState => ({
            afficheProfil: !prevState.afficheProfil
        }));
    };

    togglePages = () => {
        this.setState(prevState => ({
            affichePages: !prevState.affichePages
        }));
    };

    render() {
        return (
            <div>
                <div className='userLogged-container'>
                    <img src={user} alt="user" className="user-logo" />
                    <h2>Bonjour {this.state.nomUtilisateur}</h2>
                </div>
                <div onClick={this.toggleProfil}  className={`clickable${this.state.afficheProfil ? ' active' : ''}`}>
                    <img src={pages}></img>
                    <h3>Pages</h3>
                </div>
                {this.state.afficheProfil ?
                    <div className='navigationDashboard'>
                        <div>
                            {this.renderNavLink("/", "Accueil")}
                            {this.renderNavLink("/chat", "RAG")}
                        </div>
                    </div>
                    :
                    null
                }
                
                <br></br>

                <div onClick={this.togglePages}  className={`clickable${this.state.affichePages ? ' active' : ''}`} >
                    <img src={profil}></img>
                    <h3>Profil</h3>
                </div>
                {this.state.affichePages ? 
                    <div className='navigationDashboard'>
                        <a className='navLink disconnect-button' onClick={this.destroySession}>
                            Déconnexion
                        </a>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}
//{this.state.usergroup === "ADMIN"  && this.renderNavLink("/chat", "RAG")}
export default DashBoard;