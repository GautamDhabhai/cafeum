export default function Hero(){
    return(
        <>
            <h1>Coffee Tracking for the Coffee <abbr title="An enthusiast or devotee">Connoisseur</abbr>!</h1>
            <div className="benefits-list">
                <h3 className="font-bolder">Try <span className="text-gradient">Cafeum</span> and start...</h3>
                <p>✅ Tracking your every coffee</p>
                <p>✅ Measuring your blood caffeine levels</p>
                <p>✅ Costing and quantifying your addiction</p>
            </div>

            <div className="card info-card">
                <div>
                <i className="fa-solid fa-circle-info"></i>
                    <h3>Did you know. . .</h3>
                </div>
                    <h5>That caffeine&apos;s half-life is 5 hours on an average?</h5>
                    <p>This means after 5 hours, half the caffeine you consume is still in your system keeping you alert longer! so if you drink a cup of coffee with 200mg of caffeine, 5 hours, later you&apos;ll still have about 100mg of caffeine in your system</p>
            </div>
        </>
    )
}