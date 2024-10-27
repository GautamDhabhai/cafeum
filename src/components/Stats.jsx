//when you want to reuse a component you can either use the map method over a array like we did in previous projects like the pokedeckz and to-do list or if you're only going to use the component within the same file ie. Stat.jsx the you can create another functional component

import { useAuth } from "../Context/AuthContext"
import { calculateCoffeeStats, calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getTopThreeCoffees, statusLevels } from "../utils"

function StatCard(props) {
    const { lg, children, title} = props
    return(
        <div className={"card stat-card " + (lg ? 'col-span-2' : '')}>
            <h4>{title}</h4>
            {children}
        </div>
    )
}

export default function Stats() {
    const { globalData } = useAuth()
    const stats = calculateCoffeeStats(globalData)
    console.log(stats)

    const CaffeineLevel = calculateCurrentCaffeineLevel(globalData)

    const warningLevel = CaffeineLevel < statusLevels['low'].maxLevel ? 'low' :
        CaffeineLevel < statusLevels['moderate'].maxLevel ? 'moderate' :
        'high'
    return(
        <>
            <div className="section-header">
                <i className="fa-solid fa-chart-simple"></i>
                <h2>Stats</h2>
            </div>  
            <div className="stats-grid">

                <StatCard lg title="Active Caffeine Levels">
                    <div className="status">
                        <p><span className="stat-text">{CaffeineLevel}</span>mg</p>
                        <h5 style={{color: statusLevels[warningLevel].color, background: statusLevels[warningLevel].background}}>{warningLevel}</h5>
                    </div>
                    <p>{statusLevels[warningLevel].description}</p>
                </StatCard>

                <StatCard title="Daily Caffeine Intake">
                    <p><span className="stat-text">{stats.daily_caffeine}</span>mg</p>
                </StatCard>

                <StatCard title="Avg # of Coffee">
                    <p><span className="stat-text">{stats.average_coffees}</span></p>
                </StatCard>

                <StatCard title="Daily Cost &nbsp; (&#8377;)">
                    <p>&#8377; <span className="stat-text">{stats.daily_cost}</span></p>
                </StatCard>

                <StatCard title="Total Cost &nbsp; (&#8377;)">
                    <p>&#8377; <span className="stat-text">{stats.total_cost}</span></p>
                </StatCard>

                <table className="stat-table">
                    <thead>
                        <tr>
                            <th>Coffee Name</th>
                            <th>Number of Purchases</th>
                            <th>Percentage of total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getTopThreeCoffees(globalData).map((coffee, coffeeIndex) => {
                            return(
                                <tr key={coffeeIndex}>
                                    <td>{coffee.coffeeName}</td>
                                    <td>{coffee.count}</td>
                                    <td>{coffee.percentage}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}