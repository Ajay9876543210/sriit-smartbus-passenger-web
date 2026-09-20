import { useEffect, useState } from "react";
import axios from "axios";

import PassengerLogin from "./components/PassengerLogin";
import PassengerDashboard from "./components/PassengerDashboard";

import "./App.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

const SELECTED_TRIP_KEY = "selectedPassengerTrip";

function App() {

    // =====================================
    // AUTH STATE
    // =====================================

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [passenger, setPassenger] = useState(() => {

        const savedPassenger =
            localStorage.getItem("passenger");

        try {

            return savedPassenger
                ? JSON.parse(savedPassenger)
                : null;

        } catch {

            localStorage.removeItem("passenger");

            return null;
        }
    });

    // =====================================
    // LOGIN STATE
    // =====================================

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const [loginError, setLoginError] =
        useState("");

    const [loginLoading, setLoginLoading] =
        useState(false);

    // =====================================
    // FORGOT PASSWORD STATE
    // =====================================

    const [showForgotPassword, setShowForgotPassword] =
        useState(false);

    const [forgotPasswordData, setForgotPasswordData] =
        useState({
            user_id: "",
            name: "",
            date_of_birth: "",
            new_password: ""
        });

    const [forgotPasswordError, setForgotPasswordError] =
        useState("");

    const [forgotPasswordSuccess, setForgotPasswordSuccess] =
        useState("");

    const [forgotPasswordLoading, setForgotPasswordLoading] =
        useState(false);

    // =====================================
    // TRIP STATE
    // =====================================

    const [trips, setTrips] = useState([]);

    const [selectedTrip, setSelectedTrip] = useState(() => {

        const savedTrip =
            localStorage.getItem(
                SELECTED_TRIP_KEY
            );

        if (!savedTrip) {
            return null;
        }

        try {

            const parsedTrip =
                JSON.parse(savedTrip);

            if (
                parsedTrip &&
                parsedTrip.id
            ) {
                return parsedTrip;
            }

            localStorage.removeItem(
                SELECTED_TRIP_KEY
            );

            return null;

        } catch {

            localStorage.removeItem(
                SELECTED_TRIP_KEY
            );

            return null;
        }
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================
    // SELECT TRIP
    // =====================================

    const handleSelectTrip = (trip) => {

        setSelectedTrip(trip);

        if (trip) {

            localStorage.setItem(
                SELECTED_TRIP_KEY,
                JSON.stringify(trip)
            );

        } else {

            localStorage.removeItem(
                SELECTED_TRIP_KEY
            );
        }
    };

    // =====================================
    // LOGIN
    // =====================================

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoginLoading(true);
            setLoginError("");

            const response = await axios.post(
                `${API_URL}/api/auth/passenger/login`,
                {
                    user_id: userId.trim(),
                    password
                }
            );

            const newToken =
                response.data.data?.token ||
                response.data.token;

            const newPassenger =
                response.data.data?.user ||
                response.data.user ||
                {
                    id:
                        response.data.data?.id,

                    user_id:
                        response.data.data?.user_id ||
                        userId.trim(),

                    name:
                        response.data.data?.name ||
                        "Passenger",

                    role: "passenger"
                };

            if (!newToken) {

                throw new Error(
                    "Login successful but token was not received"
                );
            }

            localStorage.setItem(
                "token",
                newToken
            );

            localStorage.setItem(
                "passenger",
                JSON.stringify(newPassenger)
            );

            // Old selected trip clear on fresh login
            localStorage.removeItem(
                SELECTED_TRIP_KEY
            );

            setToken(newToken);
            setPassenger(newPassenger);

            setUserId("");
            setPassword("");

            setTrips([]);
            setSelectedTrip(null);
            setError("");

        } catch (err) {

            console.error(
                "Passenger login error:",
                err
            );

            setLoginError(
                err.response?.data?.message ||
                err.message ||
                "Login failed"
            );

        } finally {

            setLoginLoading(false);
        }
    };

    // =====================================
    // FORGOT PASSWORD
    // =====================================

    const handleForgotPassword = async (e) => {

        e.preventDefault();

        try {

            setForgotPasswordLoading(true);
            setForgotPasswordError("");
            setForgotPasswordSuccess("");

            const response = await axios.post(
                `${API_URL}/api/auth/passenger/forgot-password`,
                {
                    user_id:
                        forgotPasswordData.user_id.trim(),

                    name:
                        forgotPasswordData.name.trim(),

                    date_of_birth:
                        forgotPasswordData.date_of_birth,

                    new_password:
                        forgotPasswordData.new_password
                }
            );

            setForgotPasswordSuccess(
                response.data.message ||
                "Password reset successful. You can now login with your new password."
            );

            setForgotPasswordData({
                user_id: "",
                name: "",
                date_of_birth: "",
                new_password: ""
            });

        } catch (err) {

            console.error(
                "Passenger forgot password error:",
                err
            );

            setForgotPasswordError(
                err.response?.data?.message ||
                err.message ||
                "Password reset failed"
            );

        } finally {

            setForgotPasswordLoading(false);
        }
    };

    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = async () => {

        const currentToken =
            localStorage.getItem("token");

        try {

            if (currentToken) {

                await axios.post(
                    `${API_URL}/api/auth/passenger/logout`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${currentToken}`
                        }
                    }
                );
            }

        } catch (err) {

            console.error(
                "Passenger logout error:",
                err
            );

        } finally {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "passenger"
            );

            localStorage.removeItem(
                SELECTED_TRIP_KEY
            );

            setToken(null);
            setPassenger(null);
            setTrips([]);
            setSelectedTrip(null);
            setError("");
        }
    };

    // =====================================
    // FETCH ACTIVE TRIPS
    // =====================================

    useEffect(() => {

        if (!token) {
            return;
        }

        const fetchActiveTrips = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await axios.get(
                        `${API_URL}/api/trips/active`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const activeTrips =
                    response.data.data || [];

                setTrips(activeTrips);

                // =====================================
                // RESTORE SELECTED TRIP
                // =====================================

                const savedTrip =
                    localStorage.getItem(
                        SELECTED_TRIP_KEY
                    );

                if (savedTrip) {

                    try {

                        const parsedTrip =
                            JSON.parse(savedTrip);

                        const activeTrip =
                            activeTrips.find(
                                (trip) =>
                                    String(trip.id) ===
                                    String(parsedTrip.id)
                            );

                        if (activeTrip) {

                            setSelectedTrip(
                                activeTrip
                            );

                            localStorage.setItem(
                                SELECTED_TRIP_KEY,
                                JSON.stringify(
                                    activeTrip
                                )
                            );

                        } else {

                            // Trip no longer active
                            localStorage.removeItem(
                                SELECTED_TRIP_KEY
                            );

                            setSelectedTrip(null);
                        }

                    } catch {

                        localStorage.removeItem(
                            SELECTED_TRIP_KEY
                        );

                        setSelectedTrip(null);
                    }
                }

            } catch (err) {

                console.error(
                    "Active trips error:",
                    err
                );

                if (
                    err.response?.status === 401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "passenger"
                    );

                    localStorage.removeItem(
                        SELECTED_TRIP_KEY
                    );

                    setToken(null);
                    setPassenger(null);
                    setTrips([]);
                    setSelectedTrip(null);

                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Unable to load active buses"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchActiveTrips();

    }, [token]);

    // =====================================
    // LOGIN SCREEN
    // =====================================

    if (!token) {

        return (
            <PassengerLogin
                userId={userId}
                password={password}
                setUserId={setUserId}
                setPassword={setPassword}
                loginError={loginError}
                loginLoading={loginLoading}
                onLogin={handleLogin}

                showForgotPassword={
                    showForgotPassword
                }

                setShowForgotPassword={
                    setShowForgotPassword
                }

                forgotPasswordData={
                    forgotPasswordData
                }

                setForgotPasswordData={
                    setForgotPasswordData
                }

                forgotPasswordError={
                    forgotPasswordError
                }

                forgotPasswordSuccess={
                    forgotPasswordSuccess
                }

                forgotPasswordLoading={
                    forgotPasswordLoading
                }

                onForgotPassword={
                    handleForgotPassword
                }
            />
        );
    }

    // =====================================
    // PASSENGER DASHBOARD
    // =====================================

    return (
        <PassengerDashboard
            passenger={passenger}
            onLogout={handleLogout}
            trips={trips}
            selectedTrip={selectedTrip}
            setSelectedTrip={handleSelectTrip}
            loading={loading}
            error={error}
        />
    );
}

export default App;