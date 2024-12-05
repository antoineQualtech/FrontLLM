import { useNavigate } from "react-router-dom";

const CustomPopup = ({ message, onClose, route }) => {

    const navigate = useNavigate();
    const handleCloseAndRedirect = () => {
        onClose();
        navigate(route);
    };
    return (
        <div className="custom-popup">
            <div className="custom-popup-content">
                <p>{message}</p>
                <button onClick={handleCloseAndRedirect}>Fermer</button>
            </div>
        </div>
    );
};

export default CustomPopup;