function analyzeMessage(message) {
    const length = message.length;
    const happyKeywords = ["vui", "hạnh phúc", "tuyệt vời", "yêu"];
    const keywordCount = happyKeywords.reduce((count, keyword) => 
        count + (message.toLowerCase().includes(keyword) ? 1 : 0), 0);

    return {
        balloonCount: Math.min(10 + length / 5, 30), // Max 30 balloons
        fireworkIntensity: 1 + keywordCount * 0.7, // More fireworks
        balloonSpeed: 0.02 + (keywordCount * 0.01), // Faster for happy words
        lightColor: keywordCount > 0 ? 0xff9999 : 0xaaaaaa, // Bright or dim light
        starCount: 50 + length * 2 // More stars for longer messages
    };
}

let scene, camera, renderer, controls;

function initThreeScene(canvasId, message = "") {
    const { balloonCount, fireworkIntensity, balloonSpeed, lightColor, starCount } = analyzeMessage(message);

    // Initialize Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById(canvasId), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add OrbitControls for mouse interaction
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Sky Gradient Background
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x0077ff) },
            bottomColor: { value: new THREE.Color(0xff77aa) },
            offset: { value: 0 },
            exponent: { value: 0.6 }
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `,
        side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(skyGeometry, skyMaterial));

    // Add Stars
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 100;
        starPositions[i + 1] = (Math.random() - 0.5) * 100;
        starPositions[i + 2] = (Math.random() - 0.5) * 100;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
    scene.add(new THREE.Points(starGeometry, starMaterial));

    // Add Balloons with Strings
    const balloons = [];
    for (let i = 0; i < balloonCount; i++) {
        const balloonGroup = new THREE.Group();
        const balloonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const balloonMaterial = new THREE.MeshPhongMaterial({ 
            color: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"][Math.floor(Math.random() * 4)],
            shininess: 100
        });
        const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
        balloonGroup.add(balloon);

        // Add String
        const stringGeometry = new THREE.BufferGeometry();
        const stringPositions = new Float32Array([0, 0, 0, 0, -1, 0]);
        stringGeometry.setAttribute("position", new THREE.BufferAttribute(stringPositions, 3));
        const stringMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const string = new THREE.Line(stringGeometry, stringMaterial);
        balloonGroup.add(string);

        balloonGroup.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        scene.add(balloonGroup);
        balloons.push({ group: balloonGroup, angle: Math.random() * Math.PI * 2 });
    }

    // Add Lighting
    const pointLight = new THREE.PointLight(lightColor, 1, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0x404040));

    // Firework Particle System
    const fireworkGroups = [];
    function createFirework() {
        const particleCount = 50;
        const fireworkGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = 0;
            positions[i + 1] = 0;
            positions[i + 2] = 0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 0.1 + Math.random() * 0.1;
            velocities.push({
                x: Math.sin(phi) * Math.cos(theta) * speed,
                y: Math.sin(phi) * Math.sin(theta) * speed,
                z: Math.cos(phi) * speed
            });
        }
        fireworkGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const fireworkMaterial = new THREE.PointsMaterial({
            color: ["#ffeb3b", "#ff4757", "#1e90ff"][Math.floor(Math.random() * 3)],
            size: 0.2,
            transparent: true,
            opacity: 1
        });
        const firework = new THREE.Points(fireworkGeometry, fireworkMaterial);
        firework.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        scene.add(firework);
        fireworkGroups.push({ firework, velocities, life: 1 });
    }
    setInterval(createFirework, 1000 / fireworkIntensity);

    camera.position.z = 15;

    function animate() {
        requestAnimationFrame(animate);
        balloons.forEach(balloon => {
            balloon.group.position.y += balloonSpeed;
            balloon.angle += 0.01;
            balloon.group.rotation.z = Math.sin(balloon.angle) * 0.2;
            if (balloon.group.position.y > 10) balloon.group.position.y = -10;
        });

        fireworkGroups.forEach((group, index) => {
            const positions = group.firework.geometry.attributes.position.array;
            group.life -= 0.016;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += group.velocities[i / 3].x;
                positions[i + 1] += group.velocities[i / 3].y;
                positions[i + 2] += group.velocities[i / 3].z;
                group.velocities[i / 3].y -= 0.002; // Gravity
            }
            group.firework.geometry.attributes.position.needsUpdate = true;
            group.firework.material.opacity = group.life;
            if (group.life <= 0) {
                scene.remove(group.firework);
                fireworkGroups.splice(index, 1);
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function cleanupThreeScene() {
    if (renderer) {
        renderer.dispose();
        renderer = null;
        scene = null;
        camera = null;
        controls = null;
    }
}