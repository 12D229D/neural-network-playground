/**
 * 2D DECISION BOUNDARY HEATMAP & DATA POINTS RENDERER
 * Canvas 2D spatial grid prediction and point visualization.
 */

class DecisionBoundaryRenderer {
    constructor(canvasId, neuralNetwork) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nn = neuralNetwork;
        this.points = [];
        this.testPoints = [];
        this.range = 6.0; // Coordinate space [-6, +6]
        this.gridResolution = 50; // 50x50 evaluation grid
    }

    setNetwork(nn) {
        this.nn = nn;
    }

    setData(trainPoints, testPoints = []) {
        this.points = trainPoints;
        this.testPoints = testPoints;
    }

    toScreen(x, y) {
        const sx = ((x + this.range) / (2 * this.range)) * this.canvas.width;
        const sy = ((-y + this.range) / (2 * this.range)) * this.canvas.height;
        return { x: sx, y: sy };
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        // 1. Render Decision Boundary Heatmap (Grid Evaluation)
        const cellW = w / this.gridResolution;
        const cellH = h / this.gridResolution;

        for (let gx = 0; gx < this.gridResolution; gx++) {
            for (let gy = 0; gy < this.gridResolution; gy++) {
                // Map grid cell center to math coordinates
                const mathX = -this.range + ((gx + 0.5) / this.gridResolution) * (2 * this.range);
                const mathY = this.range - ((gy + 0.5) / this.gridResolution) * (2 * this.range);

                const prob = this.nn.predictPoint(mathX, mathY); // [0, 1]

                // Class 1 (prob > 0.5) = Cyan, Class 0 (prob < 0.5) = Orange
                let r, g, b, alpha;
                if (prob >= 0.5) {
                    const t = (prob - 0.5) * 2; // 0 to 1
                    r = Math.round(10 + t * 0);
                    g = Math.round(30 + t * 210);
                    b = Math.round(60 + t * 195);
                    alpha = 0.35 + t * 0.45;
                } else {
                    const t = (0.5 - prob) * 2; // 0 to 1
                    r = Math.round(50 + t * 205);
                    g = Math.round(30 + t * 75);
                    b = Math.round(20 + t * 0);
                    alpha = 0.35 + t * 0.45;
                }

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fillRect(gx * cellW, gy * cellH, cellW + 0.5, cellH + 0.5);
            }
        }

        // 2. Coordinate Grid Lines
        ctx.strokeStyle = 'hsla(220, 20%, 30%, 0.4)';
        ctx.lineWidth = 1;
        const center = this.toScreen(0, 0);

        ctx.beginPath();
        ctx.moveTo(0, center.y);
        ctx.lineTo(w, center.y);
        ctx.moveTo(center.x, 0);
        ctx.lineTo(center.x, h);
        ctx.stroke();

        // 3. Render Data Points
        // Training Points
        this.points.forEach(p => {
            const pos = this.toScreen(p.x, p.y);
            const isClass1 = p.label === 1;

            ctx.save();
            ctx.shadowColor = isClass1 ? '#00f0ff' : '#ff7700';
            ctx.shadowBlur = 6;
            ctx.fillStyle = isClass1 ? '#00f0ff' : '#ff7700';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });

        // Test Points (Dashed outline)
        this.testPoints.forEach(p => {
            const pos = this.toScreen(p.x, p.y);
            const isClass1 = p.label === 1;

            ctx.save();
            ctx.fillStyle = isClass1 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 119, 0, 0.4)';
            ctx.strokeStyle = isClass1 ? '#00f0ff' : '#ff7700';
            ctx.lineWidth = 1.2;

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });
    }
}

window.DecisionBoundaryRenderer = DecisionBoundaryRenderer;
