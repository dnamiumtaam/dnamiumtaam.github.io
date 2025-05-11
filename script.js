function navigateTo(page) {
    gsap.to(".container", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => {
            window.location.href = page;
        }
    });
}

function saveMessage() {
    const message = document.getElementById("birthdayMessage").value || "Chúc bạn một ngày sinh nhật thật vui vẻ và hạnh phúc!";
    localStorage.setItem("birthdayMessage", message);
    navigateTo("final.html");
}

window.onload = function() {
    gsap.fromTo(".container", 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    if (document.getElementById("customMessage")) {
        const message = localStorage.getItem("birthdayMessage") || "Chúc bạn một ngày sinh nhật thật vui vẻ và hạnh phúc!";
        document.getElementById("customMessage").textContent = message;

        function createConfetti() {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.background = ["#ffeb3b", "#ff4757", "#1e90ff"][Math.floor(Math.random() * 3)];
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
        setInterval(createConfetti, 100);
    }
};