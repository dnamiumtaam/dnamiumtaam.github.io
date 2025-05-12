function Login({ handleLogin }) {
    const [username, setUsername] = React.useState("");

    React.useEffect(() => {
        gsap.from(".login-content", {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });
    }, []);

    const handleSubmit = () => {
        if (username.trim()) {
            localStorage.setItem("username", username);
            handleLogin();
        } else {
            alert("Vui lòng nhập tên người dùng!");
        }
    };

    return (
        <div className="text-center text-white login-content">
            <h1 className="text-4xl font-bold mb-4 text-shadow">Đăng Nhập</h1>
            <input
                type="text"
                className="login-input text-black"
                placeholder="Nhập tên người dùng"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <div>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 hover:scale-110 transition-transform"
                >
                    Đăng Nhập
                </button>
            </div>
        </div>
    );
}