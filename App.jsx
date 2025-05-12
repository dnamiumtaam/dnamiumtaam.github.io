const { useState, useEffect } = React;

function App() {
    const [page, setPage] = useState(localStorage.getItem("isLoggedIn") ? "welcome" : "login");
    const [message, setMessage] = useState(localStorage.getItem("birthdayMessage") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("isLoggedIn"));

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedMessage = urlParams.get("message");
        if (sharedMessage) {
            const decodedMessage = decodeURIComponent(sharedMessage);
            setMessage(decodedMessage);
            localStorage.setItem("birthdayMessage", decodedMessage);
            setPage("final");
        }
    }, []);

    const navigateTo = (newPage) => {
        gsap.to("#root", {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            onComplete: () => {
                setPage(newPage);
                gsap.to("#root", { opacity: 1, scale: 1, duration: 0.5 });
            }
        });
    };

    const saveMessage = (msg) => {
        setMessage(msg);
        localStorage.setItem("birthdayMessage", msg);
        navigateTo("final");
    };

    const handleLogin = () => {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        navigateTo("welcome");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-400 to-yellow-300 flex items-center justify-center">
            {page === "login" && <Login handleLogin={handleLogin} />}
            {page === "welcome" && isLoggedIn && <Welcome navigateTo={navigateTo} />}
            {page === "message" && isLoggedIn && <Message saveMessage={saveMessage} />}
            {page === "final" && isLoggedIn && <Final message={message} />}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));