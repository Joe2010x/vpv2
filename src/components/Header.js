import logo from "./image/1280ut.svg.png"

const Header = () =>{

    return (
        <div  className = "header_bar">
            <img id="headerLogo" src={logo} alt="Logo" />
            <p>Fullstack development course final project ---- Lyyti VP project</p> 
            <div className="line"></div>
        </div>
    )
}

export default Header