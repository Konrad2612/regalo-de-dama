/* ==========================================================================
   F1 Racetrack & Cars Canvas Animation Engine (Green Landscape & F1 Track)
   ========================================================================== */

class F1TrackEngine {
  constructor() {
    this.canvas = document.getElementById('trackCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.cars = [];
    this.petals = [];
    this.trackPoints = [];
    
    if (this.canvas && this.ctx) {
      this.resize();
      this.initTrack();
      this.initCars();
      this.initPetals();
      this.bindEvents();
      this.animate();
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.initTrack();
  }

  initTrack() {
    const w = this.width;
    const h = this.height;

    // Smooth winding F1 circuit path points
    this.trackPath = [
      { x: w * 0.08, y: h * 0.3 },
      { x: w * 0.35, y: h * 0.12 },
      { x: w * 0.62, y: h * 0.32 },
      { x: w * 0.88, y: h * 0.18 },
      { x: w * 0.92, y: h * 0.62 },
      { x: w * 0.68, y: h * 0.86 },
      { x: w * 0.32, y: h * 0.78 },
      { x: w * 0.08, y: h * 0.52 }
    ];

    this.trackPoints = [];
    for (let i = 0; i < this.trackPath.length; i++) {
      const p1 = this.trackPath[i];
      const p2 = this.trackPath[(i + 1) % this.trackPath.length];
      const p0 = this.trackPath[(i - 1 + this.trackPath.length) % this.trackPath.length];
      const p3 = this.trackPath[(i + 2) % this.trackPath.length];

      const steps = 60;
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t * t + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t * t * t);
        const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t * t + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t * t * t);
        this.trackPoints.push({ x, y });
      }
    }
  }

  initCars() {
    this.cars = [
      {
        pointIndex: 0,
        speed: 2.3,
        color: '#002b66', // Red Bull Navy
        accentColor: '#ff003c', // Red Bull Red
        yellowColor: '#ffd700', // Yellow Nose
        carNumber: "1",
        size: 30,
        trail: []
      },
      {
        pointIndex: Math.floor(this.trackPoints.length * 0.38),
        speed: 2.1,
        color: '#0a192f',
        accentColor: '#ffd700',
        yellowColor: '#ffea00',
        carNumber: "11",
        size: 28,
        trail: []
      },
      {
        pointIndex: Math.floor(this.trackPoints.length * 0.72),
        speed: 2.6,
        color: '#001a40',
        accentColor: '#ff003c',
        yellowColor: '#ffd700',
        carNumber: "33",
        size: 29,
        trail: []
      }
    ];
  }

  initPetals() {
    this.petals = [];
    for (let i = 0; i < 35; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
  }

  drawGreenBackground() {
    // Rich Green Grass Landscape with F1 Grass Lawn Stripes
    const gradient = this.ctx.createRadialGradient(
      this.width * 0.5, this.height * 0.5, 50,
      this.width * 0.5, this.height * 0.5, Math.max(this.width, this.height) * 0.8
    );
    gradient.addColorStop(0, '#16a34a'); // Vibrant green grass
    gradient.addColorStop(0.6, '#15803d'); // Deep circuit grass green
    gradient.addColorStop(1, '#14532d'); // Outer forest green

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Grass Mower Stripe Lines
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    const stripeWidth = 80;
    for (let x = 0; x < this.width; x += stripeWidth * 2) {
      this.ctx.fillRect(x, 0, stripeWidth, this.height);
    }
  }

  drawTrack() {
    if (this.trackPoints.length < 2) return;

    // Outer Runoff Gravel / Runoff Border
    this.ctx.beginPath();
    this.ctx.moveTo(this.trackPoints[0].x, this.trackPoints[0].y);
    for (let i = 1; i < this.trackPoints.length; i++) {
      this.ctx.lineTo(this.trackPoints[i].x, this.trackPoints[i].y);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = '#ca8a04'; // Gravel yellow-brown edge
    this.ctx.lineWidth = 72;
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();

    // Red & White F1 Curbs (Kerbs)
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 64;
    this.ctx.stroke();

    this.ctx.strokeStyle = '#dc2626'; // Red Kerb
    this.ctx.lineWidth = 64;
    this.ctx.setLineDash([22, 22]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Asphalt Main Racetrack
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 52;
    this.ctx.stroke();

    // Center Dashed White Racing Line
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 3.5;
    this.ctx.setLineDash([16, 16]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  drawCar(car) {
    const idx = Math.floor(car.pointIndex) % this.trackPoints.length;
    const nextIdx = (idx + 2) % this.trackPoints.length;

    const curr = this.trackPoints[idx];
    const next = this.trackPoints[nextIdx];

    if (!curr || !next) return;

    const angle = Math.atan2(next.y - curr.y, next.x - curr.x);

    // Save car trail
    car.trail.push({ x: curr.x, y: curr.y, alpha: 1 });
    if (car.trail.length > 15) car.trail.shift();

    // Draw Speed Trail
    for (let i = 0; i < car.trail.length; i++) {
      const t = car.trail[i];
      t.alpha -= 0.06;
      if (t.alpha > 0) {
        this.ctx.save();
        this.ctx.globalAlpha = t.alpha * 0.45;
        this.ctx.fillStyle = car.accentColor;
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y, (i + 1) * 0.85, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // Draw F1 Car Body
    this.ctx.save();
    this.ctx.translate(curr.x, curr.y);
    this.ctx.rotate(angle);

    // F1 Front Wing
    this.ctx.fillStyle = car.accentColor;
    this.ctx.fillRect(car.size * 0.45, -car.size * 0.4, 4.5, car.size * 0.8);

    // Main Chassis
    this.ctx.fillStyle = car.color;
    this.ctx.beginPath();
    this.ctx.moveTo(car.size * 0.55, 0);
    this.ctx.lineTo(-car.size * 0.45, -car.size * 0.28);
    this.ctx.lineTo(-car.size * 0.55, car.size * 0.28);
    this.ctx.closePath();
    this.ctx.fill();

    // Red Bull Yellow Nose Accent
    this.ctx.fillStyle = car.yellowColor;
    this.ctx.beginPath();
    this.ctx.arc(car.size * 0.38, 0, 4.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Rear Wing
    this.ctx.fillStyle = car.accentColor;
    this.ctx.fillRect(-car.size * 0.55, -car.size * 0.38, 5.5, car.size * 0.76);

    // Wheels (4 Tyres)
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(car.size * 0.1, -car.size * 0.48, 9, 4.5);
    this.ctx.fillRect(car.size * 0.1, car.size * 0.38, 9, 4.5);
    this.ctx.fillRect(-car.size * 0.38, -car.size * 0.48, 10, 5.5);
    this.ctx.fillRect(-car.size * 0.38, car.size * 0.38, 10, 5.5);

    // Car Number Badge
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 9px Orbitron, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(car.carNumber, -2, 0);

    this.ctx.restore();
  }

  drawPetals() {
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.6 + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.opacity;

      this.ctx.beginPath();
      this.ctx.fillStyle = '#ffd700';
      this.ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Green Circuit Landscape
    this.drawGreenBackground();

    // Draw Racetrack
    this.drawTrack();

    // Move & Draw F1 Cars
    for (let i = 0; i < this.cars.length; i++) {
      const car = this.cars[i];
      car.pointIndex = (car.pointIndex + car.speed) % this.trackPoints.length;
      this.drawCar(car);
    }

    // Draw Yellow Petals
    this.drawPetals();

    requestAnimationFrame(() => this.animate());
  }
}

// Global handle
window.trackEngine = null;
document.addEventListener('DOMContentLoaded', () => {
  window.trackEngine = new F1TrackEngine();
});
