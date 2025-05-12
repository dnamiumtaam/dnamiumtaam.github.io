const birthdaySound = new Howl({
    src: ["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"],
    loop: true,
    volume: 0.5
});

function playBirthdaySound() {
    birthdaySound.play();
}