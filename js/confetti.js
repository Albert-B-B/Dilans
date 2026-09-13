// Lightweight canvas confetti engine (zero external dependencies)
(function() {
    let canvas = null;
    let ctx = null;
    let particles = [];
    let animationId = null;

    function initCanvas() {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'confetti-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '9999';
            document.body.appendChild(canvas);
            ctx = canvas.getContext('2d');
            resize();
            window.addEventListener('resize', resize);
        }
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 8 + 6;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 12 + 6;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 4;
            this.gravity = 0.25;
            this.drag = 0.96;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.012;
        }

        update() {
            this.vx *= this.drag;
            this.vy *= this.drag;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotSpeed;
            this.opacity -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            ctx.restore();
        }
    }

    function triggerConfetti() {
        initCanvas();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2 - 40;

        for (let i = 0; i < 90; i++) {
            particles.push(new Particle(centerX, centerY));
        }

        if (!animationId) {
            loop();
        }
    }

    function loop() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            if (p.opacity <= 0 || p.y > window.innerHeight + 50) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            animationId = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(animationId);
            animationId = null;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    }

    window.DilanConfetti = {
        triggerConfetti
    };
})();
