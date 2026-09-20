import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from "react-leaflet";

import L from "leaflet";
import { io } from "socket.io-client";
import axios from "axios";

import "leaflet/dist/leaflet.css";
import "./BusMap.css";


// =========================================
// CONFIG
// =========================================

const API_URL =
    "https://bus-tracking-backend-n00g.onrender.com";

const SOCKET_URL =
    "https://bus-tracking-backend-n00g.onrender.com";


// =========================================
// POSITIVE MESSAGES
// =========================================

const positiveMessages = [

    "🚌 Bus aa rahi hai… attendance bachane ki umeed zinda rakho! 😂",

    "😎 Relax! Bus track ho rahi hai, ab bas tumhara time management track hona baaki hai.",

    "📍 Bus ka location mil gaya, ab excuse nahi chalega! 😜",

    "🎒 Bag ready? Mood ready? Chalo campus ki taraf! 🚌",

    "☕ Chai ho gayi? Bus bhi aa rahi hai… life sorted! 😄",

    "🚀 Next stop: Campus. Mission: Time par pahunchna!",

    "🌟 Har journey ek nayi beginning hai. Keep moving forward!",

    "😄 Bus ka wait kam, campus ka excitement zyada!",

    "🛣️ Safar enjoy karo… destination apni jagah aa hi jayega!",

    "💪 Aaj ka goal: Safe journey + Good vibes + On time! ✨",

    "😴 Late hone ka plan tha? SRIIT SmartBus ne plan change kar diya! 😂",

    "❤️ Aapki journey important hai. Safe travels and keep smiling! 😊"

];


// =========================================
// BUS ICON
// =========================================

const busIcon = L.divIcon({
    className: "bus-marker",
    html: "🚌",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -21]
});


// =========================================
// STOP ICON
// =========================================

const stopIcon = L.divIcon({
    className: "stop-marker",
    html: "📍",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});


// =========================================
// MAP RECENTER
// =========================================

function MapRecenter({ location }) {

    const map = useMap();

    useEffect(() => {

        if (!location) {
            return;
        }

        map.panTo(
            [
                location.latitude,
                location.longitude
            ],
            {
                animate: true,
                duration: 0.8
            }
        );

    }, [location, map]);

    return null;
}


// =========================================
// LIVE BUS MARKER
// =========================================

function LiveBusMarker({
    location,
    tripId
}) {

    const markerRef = useRef(null);

    useEffect(() => {

        if (
            markerRef.current &&
            location
        ) {

            markerRef.current.setLatLng(
                [
                    location.latitude,
                    location.longitude
                ]
            );
        }

    }, [location]);

    if (!location) {
        return null;
    }

    return (
        <Marker
            ref={markerRef}
            position={[
                location.latitude,
                location.longitude
            ]}
            icon={busIcon}
        >

            <Popup>

                <strong>
                    🚌 Live Bus
                </strong>

                <br />

                Trip ID: {tripId}

                <br />

                Speed:{" "}
                {location.speed ?? 0} km/h

                <br />

                Latitude:{" "}
                {location.latitude}

                <br />

                Longitude:{" "}
                {location.longitude}

                <br />

                {location.timestamp && (
                    <>
                        Time:{" "}
                        {new Date(
                            location.timestamp
                        ).toLocaleTimeString()}
                    </>
                )}

            </Popup>

        </Marker>
    );
}


// =========================================
// LOCATION NORMALIZER
// =========================================

function normalizeLocation(data) {

    const raw =
        data?.data?.location ||
        data?.data?.latest_location ||
        data?.data ||
        data?.location ||
        data?.latest_location ||
        data;

    if (!raw) {
        return null;
    }

    const latitude =
        Number(raw.latitude);

    const longitude =
        Number(raw.longitude);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        return null;
    }

    if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return null;
    }

    return {
        latitude,
        longitude,

        speed:
            Number.isFinite(
                Number(raw.speed)
            )
                ? Number(raw.speed)
                : 0,

        timestamp:
            raw.timestamp ||
            raw.created_at ||
            new Date().toISOString()
    };
}


// =========================================
// MAIN BUS MAP
// =========================================

function BusMap({
    tripId,
    routeId
}) {

    // =====================================
    // LOCATION STATE
    // =====================================

    const [location, setLocation] =
        useState(null);


    // =====================================
    // SOCKET STATE
    // =====================================

    const [socketStatus, setSocketStatus] =
        useState("Connecting");


    // =====================================
    // TRIP STATE
    // =====================================

    const [tripEnded, setTripEnded] =
        useState(false);

    const tripEndedRef =
        useRef(false);


    useEffect(() => {

        tripEndedRef.current =
            tripEnded;

    }, [tripEnded]);


    // =====================================
    // ROUTE STATE
    // =====================================

    const [route, setRoute] =
        useState(null);

    const [stops, setStops] =
        useState([]);

    const [routeLoading, setRouteLoading] =
        useState(true);

    const [routeError, setRouteError] =
        useState("");


    // =====================================
    // POSITIVE MESSAGE STATE
    // =====================================

    const [messageIndex, setMessageIndex] =
        useState(0);


    // =====================================
    // MESSAGE ROTATION
    // =====================================

    useEffect(() => {

        if (tripEnded) {
            return;
        }

        const interval =
            setInterval(() => {

                setMessageIndex(
                    (previousIndex) =>
                        (
                            previousIndex + 1
                        ) %
                        positiveMessages.length
                );

            }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, [tripEnded]);


    // =====================================
    // FETCH ROUTE + STOPS
    // =====================================

    useEffect(() => {

        const fetchRouteData =
            async () => {

                try {

                    setRouteLoading(true);
                    setRouteError("");

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const response =
                        await axios.get(
                            `${API_URL}/api/route-stops/route/${routeId}`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );

                    const data =
                        response.data.data ||
                        [];

                    if (data.route) {

                        setRoute(
                            data.route
                        );

                        setStops(
                            data.stops || []
                        );

                    } else {

                        setRoute(null);

                        setStops(
                            Array.isArray(data)
                                ? data
                                : []
                        );
                    }

                } catch (err) {

                    console.error(
                        "Route data error:",
                        err
                    );

                    setRouteError(
                        err.response?.data?.message ||
                        "Unable to load route information"
                    );

                } finally {

                    setRouteLoading(false);
                }
            };

        if (routeId) {
            fetchRouteData();
        }

    }, [routeId]);


    // =====================================
    // FETCH LATEST LOCATION
    // =====================================

    useEffect(() => {

        const fetchLatestLocation =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const response =
                        await axios.get(
                            `${API_URL}/api/locations/trip/${tripId}/latest`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );

                    const latest =
                        normalizeLocation(
                            response.data
                        );

                    if (latest) {
                        setLocation(latest);
                    }

                } catch (err) {

                    console.error(
                        "Latest location error:",
                        err
                    );
                }
            };

        if (tripId) {
            fetchLatestLocation();
        }

    }, [tripId]);


    // =====================================
    // SOCKET.IO LIVE TRACKING
    // =====================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (
            !token ||
            !tripId
        ) {
            return;
        }

        const socket =
            io(
                SOCKET_URL,
                {
                    auth: {
                        token
                    },

                    autoConnect: false,

                    transports: [
                        "websocket"
                    ],

                    reconnection: true,

                    reconnectionAttempts: 20,

                    reconnectionDelay: 300,

                    reconnectionDelayMax: 2000,

                    timeout: 5000
                }
            );


        // =================================
        // CONNECT
        // =================================

        const handleConnect = () => {

            console.log(
                "Passenger socket connected:",
                socket.id
            );

            setSocketStatus(
                "Connected"
            );

            socket.emit(
                "passenger:join",
                {
                    trip_id:
                        Number(tripId)
                }
            );
        };


        // =================================
        // CONNECT ERROR
        // =================================

        const handleConnectError =
            (error) => {

                console.error(
                    "Passenger socket error:",
                    error.message
                );

                setSocketStatus(
                    "Connection Error"
                );
            };


        // =================================
        // RECONNECT
        // =================================

        const handleReconnect = () => {

            setSocketStatus(
                "Connected"
            );

            socket.emit(
                "passenger:join",
                {
                    trip_id:
                        Number(tripId)
                }
            );
        };


        // =================================
        // PASSENGER JOINED
        // =================================

        const handlePassengerJoined =
            (data) => {

                console.log(
                    "Passenger joined:",
                    data
                );

                setSocketStatus(
                    "Tracking"
                );
            };


        // =================================
        // BUS LOCATION
        // =================================

        const handleBusLocation =
            (data) => {

                console.log(
                    "Live bus location:",
                    data
                );

                const normalized =
                    normalizeLocation(
                        data
                    );

                if (normalized) {

                    setLocation(
                        normalized
                    );

                    setSocketStatus(
                        "Tracking"
                    );
                }
            };


        // =================================
        // TRIP END
        // =================================

        const handleTripEnd =
            (data) => {

                console.log(
                    "Trip ended:",
                    data
                );

                tripEndedRef.current =
                    true;

                setTripEnded(
                    true
                );

                setSocketStatus(
                    "Trip Ended"
                );
            };


        // =================================
        // PASSENGER ERROR
        // =================================

        const handlePassengerError =
            (data) => {

                console.error(
                    "Passenger Error:",
                    data
                );

                setSocketStatus(
                    "Error"
                );
            };


        // =================================
        // DISCONNECT
        // =================================

        const handleDisconnect =
            (reason) => {

                console.log(
                    "Passenger socket disconnected:",
                    reason
                );

                if (
                    !tripEndedRef.current
                ) {

                    setSocketStatus(
                        "Disconnected"
                    );
                }
            };


        // =================================
        // DEBUG ALL EVENTS
        // =================================

        const handleAnyEvent =
            (event, ...args) => {

                console.log(
                    "Passenger socket event:",
                    event,
                    args
                );
            };


        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "connect_error",
            handleConnectError
        );

        socket.on(
            "reconnect",
            handleReconnect
        );

        socket.on(
            "passenger:joined",
            handlePassengerJoined
        );

        socket.on(
            "bus:location",
            handleBusLocation
        );

        socket.on(
            "trip:end",
            handleTripEnd
        );

        socket.on(
            "passenger:error",
            handlePassengerError
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        socket.onAny(
            handleAnyEvent
        );


        socket.connect();


        // =================================
        // CLEANUP
        // =================================

        return () => {

            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "connect_error",
                handleConnectError
            );

            socket.off(
                "reconnect",
                handleReconnect
            );

            socket.off(
                "passenger:joined",
                handlePassengerJoined
            );

            socket.off(
                "bus:location",
                handleBusLocation
            );

            socket.off(
                "trip:end",
                handleTripEnd
            );

            socket.off(
                "passenger:error",
                handlePassengerError
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.offAny(
                handleAnyEvent
            );

            socket.disconnect();
        };

    }, [tripId]);


    // =====================================
    // MAP POSITION
    // =====================================

    const defaultPosition = [
        22.7196,
        75.8577
    ];

    const mapPosition =
        location
            ? [
                location.latitude,
                location.longitude
            ]
            : stops.length > 0
                ? [
                    Number(
                        stops[0].latitude
                    ),
                    Number(
                        stops[0].longitude
                    )
                ]
                : defaultPosition;


    // =====================================
    // RENDER
    // =====================================

    return (
        <div className="bus-map-section">

            {/* MAP HEADER */}

            <div className="bus-map-header">

                <div className="bus-map-title-area">

                    <h2>
                        🚌 Live Bus Location
                    </h2>

                    <p className="bus-map-trip">
                        Trip ID: {tripId}
                    </p>

                    {route && (
                        <p className="bus-map-route">

                            <strong>
                                Route:
                            </strong>{" "}

                            {route.name}

                        </p>
                    )}

                </div>


                <span
                    className={
                        socketStatus === "Tracking"
                            ? "bus-live-status online"
                            : "bus-live-status"
                    }
                >
                    ● {socketStatus}
                </span>

            </div>


            {/* LIVE TRACKING BADGE */}

            <div
                className={
                    socketStatus === "Tracking"
                        ? "live-badge tracking"
                        : "live-badge"
                }
            >

                <span className="live-badge-dot">
                    ●
                </span>

                {socketStatus === "Tracking"
                    ? "LIVE TRACKING ACTIVE"
                    : "LIVE TRACKING CONNECTING"}

            </div>


            {/* POSITIVE MESSAGE */}

            {!tripEnded && (
                <div
                    className="map-positive-message"
                    key={messageIndex}
                >
                    {positiveMessages[messageIndex]}
                </div>
            )}


            {/* TRIP ENDED */}

            {tripEnded && (
                <div className="bus-trip-ended">
                    🛑 This trip has ended.
                </div>
            )}


            {/* ROUTE ERROR */}

            {routeError && (
                <div className="error">
                    {routeError}
                </div>
            )}


            {/* ROUTE INFO */}

            {!routeLoading &&
                route && (

                    <div className="bus-route-info">

                        <strong>
                            🛣️ {route.name}
                        </strong>

                        <span>
                            {stops.length} stop(s)
                        </span>

                    </div>
                )}


            {/* MAP */}

            <MapContainer
                center={mapPosition}
                zoom={14}
                scrollWheelZoom={true}
                className="bus-map-container"
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <MapRecenter
                    location={location}
                />


                {/* STOPS */}

                {stops.map(
                    (stop, index) => {

                        const latitude =
                            Number(
                                stop.latitude
                            );

                        const longitude =
                            Number(
                                stop.longitude
                            );

                        if (
                            !Number.isFinite(
                                latitude
                            ) ||
                            !Number.isFinite(
                                longitude
                            )
                        ) {
                            return null;
                        }

                        return (
                            <Marker
                                key={
                                    stop.id ||
                                    `stop-${index}`
                                }
                                position={[
                                    latitude,
                                    longitude
                                ]}
                                icon={stopIcon}
                            >

                                <Popup>

                                    <strong>
                                        📍{" "}
                                        {stop.name ||
                                            `Stop ${index + 1}`}
                                    </strong>

                                    <br />

                                    Stop Order:{" "}
                                    {stop.stop_order ||
                                        index + 1}

                                </Popup>

                            </Marker>
                        );
                    }
                )}


                {/* LIVE BUS */}

                <LiveBusMarker
                    location={location}
                    tripId={tripId}
                />

            </MapContainer>


            {/* LOCATION INFORMATION */}

            {location && (

                <div className="bus-location-info">

                    <div>

                        <strong>
                            Speed
                        </strong>

                        <span>
                            {location.speed ?? 0} km/h
                        </span>

                    </div>


                    <div>

                        <strong>
                            Latitude
                        </strong>

                        <span>
                            {location.latitude}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Longitude
                        </strong>

                        <span>
                            {location.longitude}
                        </span>

                    </div>

                </div>
            )}


            {/* WAITING FOR LOCATION */}

            {!location &&
                !tripEnded && (

                    <div className="bus-waiting-location">

                        📡 Waiting for live bus location...

                    </div>
                )}

        </div>
    );
}

export default BusMap;