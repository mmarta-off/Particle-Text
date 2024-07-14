document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const input = document.getElementById('textEntry');
    let particles = [];
    let targetStructures = [];

    canvas.width = 800;
    canvas.height = 600;

    function createParticles() {
        for (let i = 0; i < 1000; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                state: 'floating'
            });
        }
    }

    function getTextStructure(text) {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "100px Arial";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.restore();

        let structures = [];
        for (let x = 0; x < imageData.width; x += 10) {
            for (let y = 0; y < imageData.height; y += 10) {
                const index = (x + y * imageData.width) * 4;
                if (imageData.data[index + 3] > 128) {  // Only consider pixels that are sufficiently opaque.
                    structures.push({x, y});
                }
            }
        }
        return structures;
    }

    input.addEventListener('change', function() {
        targetStructures = getTextStructure(input.value);
        particles.forEach((particle, index) => {
            if (targetStructures[index]) {
                particle.tx = targetStructures[index].x;
                particle.ty = targetStructures[index].y;
                particle.state = 'forming';
            }
        });
    });

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            if (particle.state === 'forming' && particle.tx !== undefined) {
                const dx = particle.tx - particle.x;
                const dy = particle.ty - particle.y;
                particle.vx = dx * 0.02; // Approach target slowly
                particle.vy = dy * 0.02;
            }

            particle.x += particle.vx;
            particle.y += particle.vy;

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
});
