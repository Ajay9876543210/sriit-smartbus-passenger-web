import "./PassengerHeader.css";

function PassengerHeader({ passenger, onLogout }) {

    return (
        <header className="passenger-header">

            <div className="passenger-header-content">

                {/* BRAND */}
                <div className="passenger-brand-block">

                    <h1 className="passenger-brand">
                        SRIIT SmartBus 🚌
                    </h1>

                    <p className="passenger-tagline">
                        Your journey, our responsibility.
                    </p>

                </div>

                {/* USER AREA */}
                <div className="passenger-user-area">

                    <div className="passenger-welcome">

                        <span>
                            Welcome back,
                        </span>

                        <strong>
                            {passenger?.name || "Passenger"}
                        </strong>

                        <span>
                            ! 👋
                        </span>

                    </div>

                    <button
                        className="passenger-logout-button"
                        onClick={onLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </header>
    );
}

export default PassengerHeader;