function Final({ message }) {
    const shareMessage = () => {
        const encodedMessage = encodeURIComponent(message);
        const shareUrl = `${window.location.origin}?message=${encodedMessage}`;
        navigator.clipboard.writeText(shareUrl);
        alert("Link chia sẻ đã được sao chép vào clipboard!");
    };

    React.useEffect(() => {
        initThreeScene("final-canvas", message);
        playBirthdaySound();
        gsap.from(".final-content", {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: "bounce.out"
        });
        return () => cleanupThreeScene();
    }, [message]);

    return (
        <div className="text-center text-white final-content">
            <canvas id="final-canvas" className="absolute inset-0 z-0"></canvas>
            <div className="relative z-10">
                <h1 className="text-5xl font-bold mb-4 text-shadow">Chúc Mừng Sinh Nhật!</h1>
                <p className="text-2xl mb-6">{message}</p>
                <button
                    onClick={shareMessage}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:scale-110 transition-transform"
                >
                    Chia Sẻ Lời Chúc
                </button>
            </div>
        </div>
    );
}