import "./ActiveBuses.css";

function ActiveBuses({
    trips,
    loading,
    error,
    onTrackBus
}) {
    return (
        <section className="active-buses">

            {/* Loading */}
            {loading && (
                <div className="active-buses-state">
                    <div className="active-buses-spinner"></div>

                    <h3>Finding your buses...</h3>

                    <p>
                        Please wait while we check
                        the latest active trips.
                    </p>
                </div>
            )}


            {/* Error */}
            {!loading && error && (
                <div className="active-buses-state active-buses-error">

                    <div className="active-buses-state-icon">
                        ⚠️
                    </div>

                    <h3>Unable to load buses</h3>

                    <p>{error}</p>
                </div>
            )}


            {/* Empty */}
            {!loading &&
                !error &&
                trips.length === 0 && (
                    <div className="active-buses-state">

                        <div className="active-buses-state-icon">
                            🚌
                        </div>

                        <h3>No active buses right now</h3>

                        <p>
                            Don't worry! Active buses will
                            appear here when a trip starts.
                        </p>
                    </div>
                )}


            {/* Bus List */}
            {!loading &&
                !error &&
                trips.length > 0 && (

                    <div className="active-buses-grid">

                        {trips.map((trip) => (

                            <article
                                className="active-bus-card"
                                key={trip.id}
                            >

                                {/* Card Top */}
                                <div className="active-bus-card-top">

                                    <div className="active-bus-icon">
                                        🚌
                                    </div>

                                    <div className="active-bus-title">

                                        <h3>
                                            {trip.bus_number ||
                                                `Bus ${trip.bus_id}`}
                                        </h3>

                                        <span>
                                            Trip #{trip.id}
                                        </span>

                                    </div>

                                    <div className="active-bus-live">
                                        <span>●</span>
                                        LIVE
                                    </div>

                                </div>


                                {/* Route */}
                                <div className="active-bus-route">

                                    <span className="active-bus-route-icon">
                                        🛣️
                                    </span>

                                    <div>
                                        <small>ROUTE</small>

                                        <strong>
                                            {trip.route_name ||
                                                `Route ${trip.route_id}`}
                                        </strong>
                                    </div>

                                </div>


                                {/* Status */}
                                <div className="active-bus-status">

                                    <span className="active-bus-status-dot">
                                        ●
                                    </span>

                                    <span>
                                        Bus is currently active
                                    </span>

                                </div>


                                {/* Button */}
                                <button
                                    type="button"
                                    className="active-bus-track-button"
                                    onClick={() =>
                                        onTrackBus(trip)
                                    }
                                >
                                    <span>
                                        Track Live Bus
                                    </span>

                                    <span className="active-bus-arrow">
                                        →
                                    </span>
                                </button>

                            </article>

                        ))}

                    </div>
                )}

        </section>
    );
}

export default ActiveBuses;