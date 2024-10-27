import { useState, useContext, useEffect, createContext } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase"
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}


export function AuthProvider(props) {
    const { children } = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    function signup (email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login (email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function logout () {
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
    }

    const value = { globalUser, globalData, setGlobalData, isLoading, signup, login, logout
     }

    useEffect( () => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => 
            {
                // console.log('CURRENT USER: ', user)
                setGlobalUser(user)
                //if !user then empty user state and return out of this listener
                if(!user) { 
                    console.log('No active users')
                    return 
                }


                //if user then check if user has data in the database, and if they do then we fetch that data and update the global state
                try {
                    setIsLoading(true)

                    // first we create a reference for the document (labelled json object), and the we get the doc, and then we snapshot it to see if there's anything in there
                    const docRef = doc(db, 'users', user.uid)
                    const docSnap = await getDoc(docRef)

                    let firebaseData = {}
                    if (docSnap.exists()) {
                        firebaseData = docSnap.data()
                        console.log('Found user data', firebaseData)
                    }
                    setGlobalData(firebaseData)
                } 

                catch (error) {
                console.log(error.message)   
                }

                finally{
                    setIsLoading(false)
                }

            })
          return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}