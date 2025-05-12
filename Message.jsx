function Message({ saveMessage }) {
    const [input, setInput] = React.useState("");

    React.useEffect(() => {
        gsap.from(".message-content", {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });
    }, []);

    const handleSubmit = () => {
        saveMessage(input || "Chúc bạn một ngày sinh nhật thật vui vẻ và hạnh phúc!");
    };

    return (
        <div className="text-center text-white message-content">
            <h1 className="text-4xl font-bold mb-4 text-shadow">Viết Lời Chúc</h1>
            <textarea
                className="w-80 h-32 p-4 rounded-lg text-black"
                placeholder="Nhập lời chúc của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <div>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 hover:scale-110 transition-transform"
                >
                    Gửi Lời Chúc
                </button>
            </div>
        </div>
    );
}