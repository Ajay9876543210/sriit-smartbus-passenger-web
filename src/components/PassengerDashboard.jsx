import PassengerHeader from "./PassengerHeader";
import ActiveBuses from "./ActiveBuses";
import BusMap from "./BusMap";

import "./PassengerDashboard.css";

function PassengerDashboard({
    passenger,
    onLogout,
    trips,
    selectedTrip,
    setSelectedTrip,
    loading,
    error
}) {
    return (
        <div className="passenger-dashboard">

            {/* =====================================
                HEADER
            ===================================== */}

            <PassengerHeader
                passenger={passenger}
                onLogout={onLogout}
            />


            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <main className="passenger-dashboard-main">

                {/* =====================================
                    HOME / ACTIVE BUSES
                ===================================== */}

                {!selectedTrip && (
                    <div className="dashboard-home">

                        {/* Welcome Card */}

                        <section className="dashboard-welcome-card">

                            <div className="dashboard-welcome-content">

                                <div className="dashboard-welcome-icon">
                                    🚌
                                </div>

                                <div className="dashboard-welcome-text">

                                    <h2>
                                        Ready for your journey?
                                    </h2>

                                    <p>
                                        Apni bus ki live location dekhein
                                        aur apni journey ko simple,
                                        convenient aur stress-free banayein.
                                    </p>

                                </div>

                            </div>

                            <div className="dashboard-positive-message">
                                ✨ Relax, track your bus and enjoy the journey!
                            </div>

                        </section>


                        {/* Active Buses */}

                        <section className="dashboard-buses-section">

                            <div className="dashboard-section-heading">

                                <div className="dashboard-section-title">

                                    <h2>
                                        🚌 Active Buses
                                    </h2>

                                    <p>
                                        Apni bus select karke live tracking
                                        start karein.
                                    </p>

                                </div>

                                <span className="dashboard-bus-count">
                                    {trips.length} Active
                                </span>

                            </div>


                            <ActiveBuses
                                trips={trips}
                                loading={loading}
                                error={error}
                                onTrackBus={setSelectedTrip}
                            />

                        </section>

                    </div>
                )}


                {/* =====================================
                    LIVE MAP
                ===================================== */}

                {selectedTrip && (
                    <section className="dashboard-map-section">

                        <div className="dashboard-map-topbar">

                            <button
                                type="button"
                                className="dashboard-back-button"
                                onClick={() =>
                                    setSelectedTrip(null)
                                }
                            >
                                <span className="dashboard-back-arrow">
                                    ←
                                </span>

                                <span>
                                    Back to Buses
                                </span>
                            </button>

                        </div>


                        <div className="dashboard-map-wrapper">

                            <BusMap
                                tripId={selectedTrip.id}
                                routeId={selectedTrip.route_id}
                            />

                        </div>

                    </section>
                )}

            </main>

        </div>
    );
}

export default PassengerDashboard;