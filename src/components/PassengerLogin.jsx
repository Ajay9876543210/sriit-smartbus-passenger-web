import "./PassengerLogin.css";

function PassengerLogin({
    userId,
    password,
    setUserId,
    setPassword,
    loginError,
    loginLoading,
    onLogin,
    showForgotPassword,
    setShowForgotPassword,
    forgotPasswordData,
    setForgotPasswordData,
    forgotPasswordError,
    forgotPasswordSuccess,
    forgotPasswordLoading,
    onForgotPassword
}) {
    const resetForgotPasswordForm = () => {
        setForgotPasswordData({
            user_id: "",
            name: "",
            date_of_birth: "",
            new_password: ""
        });
    };

    return (
        <div className="passenger-login-page">

            {/* Brand Header */}
            <header className="passenger-login-header">
                <div className="passenger-login-brand">
                    <div className="passenger-login-logo">
                        🚌
                    </div>

                    <div>
                        <h1>SRIIT SmartBus</h1>
                        <p>Your journey, our responsibility.</p>
                    </div>
                </div>
            </header>


            {/* Main */}
            <main className="passenger-login-main">

                <section className="passenger-login-card">

                    {/* Top Icon */}
                    <div className="passenger-login-card-icon">
                        {showForgotPassword ? "🔐" : "👋"}
                    </div>


                    {!showForgotPassword ? (
                        <>
                            <div className="passenger-login-heading">
                                <h2>Welcome back!</h2>

                                <p>
                                    Sign in to track your bus
                                    and stay updated with your journey.
                                </p>
                            </div>


                            <div className="passenger-login-features">
                                <span>📍 Live Tracking</span>
                                <span>⚡ Real-Time Updates</span>
                                <span>🚌 Easy to Use</span>
                            </div>


                            {loginError && (
                                <div className="passenger-login-alert error">
                                    <span>⚠️</span>
                                    <p>{loginError}</p>
                                </div>
                            )}


                            <form
                                className="passenger-login-form"
                                onSubmit={onLogin}
                            >

                                <div className="passenger-login-field">

                                    <label htmlFor="passenger-user-id">
                                        Passenger ID
                                    </label>

                                    <input
                                        id="passenger-user-id"
                                        type="text"
                                        placeholder="Enter your Passenger ID"
                                        value={userId}
                                        onChange={(e) =>
                                            setUserId(e.target.value)
                                        }
                                        autoComplete="username"
                                        required
                                    />

                                </div>


                                <div className="passenger-login-field">

                                    <label htmlFor="passenger-password">
                                        Password
                                    </label>

                                    <input
                                        id="passenger-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="current-password"
                                        required
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="passenger-login-primary-button"
                                    disabled={loginLoading}
                                >
                                    {loginLoading ? (
                                        <>
                                            <span className="login-spinner"></span>
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            Login
                                            <span>→</span>
                                        </>
                                    )}
                                </button>

                            </form>


                            <button
                                type="button"
                                className="passenger-login-forgot-button"
                                onClick={() => {
                                    setShowForgotPassword(true);
                                    resetForgotPasswordForm();
                                }}
                            >
                                Forgot Password?
                            </button>


                            <div className="passenger-login-footer">
                                <span>🔒</span>
                                <p>
                                    Your account is securely managed by Ajay & Devanshu Team.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="passenger-login-heading">
                                <h2>Reset Password</h2>

                                <p>
                                    Verify your account details and create
                                    a new password.
                                </p>
                            </div>


                            <div className="passenger-reset-info">
                                <span>🔐</span>

                                <p>
                                    Enter the same details provided
                                    during account creation.
                                </p>
                            </div>


                            {forgotPasswordError && (
                                <div className="passenger-login-alert error">
                                    <span>⚠️</span>
                                    <p>{forgotPasswordError}</p>
                                </div>
                            )}


                            {forgotPasswordSuccess && (
                                <div className="passenger-login-alert success">
                                    <span>✓</span>
                                    <p>{forgotPasswordSuccess}</p>
                                </div>
                            )}


                            {!forgotPasswordSuccess && (
                                <form
                                    className="passenger-login-form"
                                    onSubmit={onForgotPassword}
                                >

                                    <div className="passenger-login-field">

                                        <label htmlFor="reset-user-id">
                                            Passenger ID
                                        </label>

                                        <input
                                            id="reset-user-id"
                                            type="text"
                                            placeholder="Enter your Passenger ID"
                                            value={
                                                forgotPasswordData.user_id
                                            }
                                            onChange={(e) =>
                                                setForgotPasswordData({
                                                    ...forgotPasswordData,
                                                    user_id: e.target.value
                                                })
                                            }
                                            autoComplete="username"
                                            required
                                        />

                                    </div>


                                    <div className="passenger-login-field">

                                        <label htmlFor="reset-name">
                                            Full Name
                                        </label>

                                        <input
                                            id="reset-name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={
                                                forgotPasswordData.name
                                            }
                                            onChange={(e) =>
                                                setForgotPasswordData({
                                                    ...forgotPasswordData,
                                                    name: e.target.value
                                                })
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="passenger-login-field">

                                        <label htmlFor="reset-dob">
                                            Date of Birth
                                        </label>

                                        <input
                                            id="reset-dob"
                                            type="date"
                                            value={
                                                forgotPasswordData.date_of_birth
                                            }
                                            onChange={(e) =>
                                                setForgotPasswordData({
                                                    ...forgotPasswordData,
                                                    date_of_birth: e.target.value
                                                })
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="passenger-login-field">

                                        <label htmlFor="reset-password">
                                            New Password
                                        </label>

                                        <input
                                            id="reset-password"
                                            type="password"
                                            placeholder="Minimum 8 characters"
                                            value={
                                                forgotPasswordData.new_password
                                            }
                                            onChange={(e) =>
                                                setForgotPasswordData({
                                                    ...forgotPasswordData,
                                                    new_password: e.target.value
                                                })
                                            }
                                            autoComplete="new-password"
                                            minLength={8}
                                            required
                                        />

                                    </div>


                                    <button
                                        type="submit"
                                        className="passenger-login-primary-button"
                                        disabled={forgotPasswordLoading}
                                    >
                                        {forgotPasswordLoading ? (
                                            <>
                                                <span className="login-spinner"></span>
                                                Resetting...
                                            </>
                                        ) : (
                                            <>
                                                Reset Password
                                                <span>→</span>
                                            </>
                                        )}
                                    </button>

                                </form>
                            )}


                            <button
                                type="button"
                                className="passenger-login-back-button"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    resetForgotPasswordForm();
                                }}
                            >
                                ← Back to Login
                            </button>


                            <div className="passenger-login-footer">
                                <span>🛡️</span>
                                <p>
                                    Resetting your password will end any
                                    previous active session.
                                </p>
                            </div>
                        </>
                    )}

                </section>


                {/* Bottom text */}
                <div className="passenger-login-bottom">
                    <span>🚌</span>
                    <p>SRIIT SmartBus • Safe journeys, smarter tracking</p>
                </div>

            </main>

        </div>
    );
}

export default PassengerLogin;