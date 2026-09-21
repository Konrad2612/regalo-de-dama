/* ==========================================================================
   Flores Amarillas & Partículas Engine (Canvas 2D)
   ========================================================================== */

class YellowFlowerEngine {
  constructor() {
    this.canvas = document.getElementById('flowerCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.sparkles = [];
    this.maxPetals = 45;
    this.flowerCount = 0;
    this.isMoonwalkActive = false;

    this.resizeCanvas();
    this.initPetals();
    this.bindEvents();
    this.animate();
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initPetals() {
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: Math.random() * 12 + 8,
      speedY: Math.random() * 1.5 + 0.8,
      speedX: Math.random() * 1 - 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.6 + 0.4,
      hue: 45 + Math.random() * 15, // Golden yellow hue
      isRosePetal: Math.random() > 0.5
    };
  }

  addSparkle(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.sparkles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        life: 1,
        decay: Math.random() * 0.03 + 0.015,
        color: this.isMoonwalkActive ? '#8b5cf6' : '#ffd700'
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    window.addEventListener('mousemove', (e) => {
      if (Math.random() < 0.3) {
        this.addSparkle(e.clientX, e.clientY, 2);
      }
    });

    window.addEventListener('click', (e) => {
      this.addSparkle(e.clientX, e.clientY, 15);
    });
  }

  drawPetal(petal) {
    this.ctx.save();
    this.ctx.translate(petal.x, petal.y);
    this.ctx.rotate(petal.rotation);
    this.ctx.globalAlpha = petal.opacity;

    // Draw yellow flower petal shape
    this.ctx.beginPath();
    this.ctx.fillStyle = `hsl(${petal.hue}, 100%, 55%)`;
    
    if (petal.isRosePetal) {
      // Rose petal curved shape
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(-petal.size, -petal.size * 1.2, -petal.size * 1.5, petal.size * 0.8, 0, petal.size * 1.5);
      this.ctx.bezierCurveTo(petal.size * 1.5, petal.size * 0.8, petal.size, -petal.size * 1.2, 0, 0);
    } else {
      // Sunflower petal oval shape
      this.ctx.ellipse(0, 0, petal.size * 0.5, petal.size, 0, 0, Math.PI * 2);
    }
    this.ctx.fill();

    // Petal inner highlight
    this.ctx.beginPath();
    this.ctx.fillStyle = `hsl(${petal.hue + 10}, 100%, 75%)`;
    this.ctx.ellipse(0, -petal.size * 0.2, petal.size * 0.25, petal.size * 0.5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawSparkle(sparkle) {
    this.ctx.save();
    this.ctx.globalAlpha = sparkle.life;
    this.ctx.fillStyle = sparkle.color;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = sparkle.color;
    this.ctx.beginPath();
    this.ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw petals
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.8 + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > this.height + 20 || p.x < -20 || p.x > this.width + 20) {
        this.petals[i] = this.createPetal(false);
      }

      this.drawPetal(p);
    }

    // Update and draw sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparkles.splice(i, 1);
      } else {
        this.drawSparkle(s);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Global instance handle
window.flowerEngine = null;
document.addEventListener('DOMContentLoaded', () => {
  window.flowerEngine = new YellowFlowerEngine();
});
