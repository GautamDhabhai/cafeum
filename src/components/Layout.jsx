import { useAuth } from "../context/AuthContext"
import Authentication from "./Authentication"
import Modal from "./Modal"
import { useState } from "react"


export default function Layout(props) {

    const { children } = props
    const [showModal, setShowModal] = useState(false)
    const { globalUser, logout } = useAuth()
    
    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFEUM</h1>
                <p>For Coffee Insatiates</p>
            </div>

            {globalUser ? (
                    <button onClick={logout}>
                        <p>Log Out</p>
                    </button> 
                ) : (
                <button onClick={() =>{setShowModal(true) }}>
                    <p>Log in</p>
                    <i className="fa-solid fa-mug-hot fa-lg"></i>
                </button>
            )}
        </header>
    )

    const footer = (
        <footer>
            <p><span className="text-gradient">CAFEUM </span>was made by <a href="https://www.linkedin.com/in/gautam-dhabhai-5866a42b9/" target="_blank" className="text-gradient">Gautam </a>using the <a href="https://www.fantacss.smoljames.com" target="_blank" className="text-gradient">fantaCSS</a> design library. <br /> Check out the project on <a className="text-gradient" href="https://github.com/GautamDhabhai" target="_blank">Github</a>!</p>
        </footer>
    )

    function handleCloseModal(){
        setShowModal(false)
    }
    return (
    <>
        {showModal && (
            <Modal handleCloseModal={ handleCloseModal }>
                <Authentication handleCloseModal={ handleCloseModal } />
            </Modal>
        )}

        {header}
        <main>
            {children}
        </main>
        {footer}
    </>
    )

}