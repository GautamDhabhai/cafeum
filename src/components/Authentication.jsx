import { useState } from "react"
import { useAuth } from "../Context/AuthContext"

export default function Authentication(props) {

    const { handleCloseModal} = props

    const [isRegistration, setIsRegistration] = useState(false) //this state will define if user is signing up or signing in
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAuthenticating, setIsAuthenticating] = useState(false) //a loading state for when the user is in the authenticating process ( until they've logged in or failed to do so)
    const [error, setError] = useState(null)

    const {signup, login } = useAuth()


    async function handleAuthenticate() { 
        if (!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating){ return }

        try {
            setIsAuthenticating(true)
            setError(null)
            if (isRegistration){
                //register the user
                await signup(email,password)
            }
    
            else {
                //login the user
                await login(email, password)
            }
            handleCloseModal()
        } catch (error) {
            console.log(error.message)
            setError(error.message)
        } finally {
            setIsAuthenticating(false)
        }
        
    }

    return(
        <>
            <h2 className="sign-up-text">{isRegistration ? 'Sign Up' : 'Login'}</h2>
            <p>{isRegistration ? 'Register and start tracking your caffeine data today!' : 'Log into your cafeum account!'}</p>
            {error && (<p>❌ {error}</p>)}
            <input type="text" placeholder="Enter E-mail" value={email} onChange={(event) => {
                setEmail(event.target.value)
            }} />
            <input type="password" placeholder="Enter Password" value={password} onChange={(event) => {
                setPassword(event.target.value)
            }} />
            <button onClick={ handleAuthenticate } >
                { isAuthenticating ? 'Authenticating...' : 'Submit' }
            </button>
            <hr />
            <div className="register-content">
                <p>{isRegistration ? 'Already have an account' : 'Don\'t have an account?'}</p>
                <button onClick={() => {setIsRegistration(!isRegistration)}}><p>{isRegistration ? 'Sign In' : 'Sign Up'}</p></button>
            </div>  
        </>
    )
}