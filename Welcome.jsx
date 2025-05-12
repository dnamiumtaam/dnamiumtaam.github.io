function Welcome({ navigateTo }) {
    React.useEffect(() => {
        initThreeScene("welcome-canvas", "");
        gsap.from(".welcome-content", {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out"
        });
        return () => cleanupThreeScene();
    }, []);

    return (
        <div className="text-center text-white welcome-content">
            <canvas id="welcome-canvas" className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10">
                <h1 className="text-5xl font-bold mb-4 text-shadow">Chào Mừng!</h1>
                <p className="text-2xl mb-6">Sẵn sàng tạo lời chúc sinh nhật đặc biệt?</p>
                <button
                    onClick={() => navigateTo("message")}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:scale-110 transition-transform"
                >
                    Bắt Đầu
                </button>
            </div>
        </div>
    );
}