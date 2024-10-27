import { coffeeOptions} from '../utils'
import { useState } from 'react'
import Modal from './Modal'
import Authentication from './Authentication'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function CoffeeForm(props) {

    const { isAuthenticated } = props

    const [selectedCoffee, setSelectedCoffee] = useState(null)
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false)
    const [coffeeCost, setCoffeeCost] = useState(0)
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [showModal, setShowModal] = useState(false)

    const { globalData, setGlobalData, globalUser } = useAuth()

    async function handleSubmitForm() {
        
        if (!isAuthenticated){
            setShowModal(true)
            return
        }
        // define a guard clause that only submits the form if its completed
        if (!selectedCoffee) {
            return
        }

        try {
           
            // then create a new data object
            const newGlobalData = {
                ...(globalData || {})
            }

            const nowTime = Date.now()
            const timeToSubtract = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000)

            const timeStamp = nowTime - timeToSubtract

            const newData = {
                name: selectedCoffee, 
                cost: coffeeCost
            }
            newGlobalData[timeStamp] = newData

            console.log(timeStamp, selectedCoffee, coffeeCost)

            // update the global state
            setGlobalData(newGlobalData)

            // persist the data in the firebase firestore
            const userRef = doc(db, 'users', globalUser.uid)
            const response = await setDoc(userRef, {
                [timeStamp]: newData
            }, { merge: true })
            
            setSelectedCoffee(null)
            setHours(0)
            setMinutes(0)
            setCoffeeCost(0)
            
        } catch (error) {
            console.log(error.message)
        }   
        
    }

    function handleCloseModal(){
        setShowModal(false)
    }

    return(
        <>

            {showModal && (
                <Modal handleCloseModal={ handleCloseModal }>
                    <Authentication handleCloseModal={ handleCloseModal } />
                </Modal>
            )}
           <div className="section-header">
                <i className="fa-solid fa-pen-nib"></i>
                <h2> Start Tracking Today</h2>
            </div> 
            <h4>Select coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
                    return(
                        <button className={'button-card' + (option.name === selectedCoffee ? 'coffee-button-selected ' : ' ')} key={optionIndex} onClick={() => {
                                setSelectedCoffee(option.name)
                                setShowCoffeeTypes(false)
                            }}>
                            <h4>{option.name}</h4>
                            <p>{option.caffeine}mg</p>
                        </button>
                    )
                })}

                <button className={'button-card' + (showCoffeeTypes ? 'coffee-button-selected ' : ' ')} onClick={() => {
                            setShowCoffeeTypes(true)
                            setSelectedCoffee(null)
                    }}>
                    <h4>Other</h4>
                    <p>n/a</p>
                </button>
            </div>

            <div>
                {showCoffeeTypes && (
                    <select name="coffee-list" id="coffee-list" onChange={(event) => {
                        setSelectedCoffee(event.target.value)
                    }}>
                        <option value="null">Select Coffee Type</option>
                        {coffeeOptions.map((option, optionIndex) => {
                            return(
                                <option value={option.name} key={optionIndex}>
                                    {option.name} ({option.caffeine}mg)
                                </option>
                            )
                        })}
                    </select>
                )}
            </div>

            <h4>Add the cost (&#8377;)</h4>
            <input type="number" className='w-full' placeholder='50' value={coffeeCost} onChange={(event) => {
                setCoffeeCost(event.target.value)
            }} />
            <h4>Time since consumption</h4>

            <div className='time-entry'>
                <div className='hours'>
                    <h6>Hours</h6>
                    <select id="hours-select" onChange={(event) => {
                        setHours(event.target.value)
                    }}>
                        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map
                        ((hours,hoursIndex) =>{
                            return(
                                <option value={hours} key={hoursIndex}>
                                    {hours}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className='minutes'>
                    <h6>Minutes</h6>
                    <select id="mins-select" onChange={(event) => {
                        setMinutes(event.target.value)
                    }}>
                        {[0,5,10,15,20,25,30,40,45,50,55].map
                        ((minutes,minutesIndex) =>{
                            return(
                                <option value={minutes} key={minutesIndex}>
                                    {minutes}
                                </option>
                            )
                        })}
                    </select>
                </div> 
            </div>
            <button className='submit-form-button' onClick={handleSubmitForm}>
                <p>Add entry</p>
            </button>
        </>
    )
}