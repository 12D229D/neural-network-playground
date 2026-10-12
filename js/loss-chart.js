/**
 * REAL-TIME LOSS & ACCURACY CONVERGENCE CHART
 * Canvas 2D live line graph showing Training vs Test Loss and Accuracy over Epochs.
 */

class LossChartRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.history = []; // Array of { epoch, trainLoss, testLoss, trainAcc, testAcc }
        this.maxDataPoints = 120;
    }

    addPoint(point) {
        this.history.push(point);
        if (this.history.length > this.maxDataPoints) {
            this.history.shift();
        }
        this.render();
    }

    clear() {
        this.history = [];
        this.render();
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        const padLeft = 38;
        const padRight = 15;
        const padTop = 20;
        const padBottom = 25;
        const chartW = w - padLeft - padRight;
        const chartH = h - padTop - padBottom;

        // Background
        ctx.fillStyle = 'hsla(235, 30%, 8%, 0.8)';
        ctx.fillRect(padLeft, padTop, chartW, chartH);

        // Grid lines
        ctx.strokeStyle = 'hsla(220, 20%, 22%, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padTop + (i / 4) * chartH;
            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(padLeft + chartW, y);
            ctx.stroke();
        }

        if (this.history.length < 2) {
            ctx.font = '11px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#6b6b8a';
            ctx.textAlign = 'center';
            ctx.fillText('Inicia el entrenamiento para ver la curva de pérdida...', w / 2, h / 2);
            return;
        }

        // Find max loss for dynamic vertical scaling
        let maxLoss = 1.2;
        this.history.forEach(pt => {
            if (pt.trainLoss > maxLoss) maxLoss = pt.trainLoss;
            if (pt.testLoss > maxLoss) maxLoss = pt.testLoss;
        });
        maxLoss = Math.ceil(maxLoss * 1.1 * 10) / 10;

        // Draw Y-Axis Labels
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#6b6b8a';
        ctx.textAlign = 'right';
        ctx.fillText(`${maxLoss.toFixed(1)}`, padLeft - 6, padTop + 4);
        ctx.fillText('0.0', padLeft - 6, padTop + chartH + 3);

        const getCoord = (idx, lossVal) => {
            const x = padLeft + (idx / (this.history.length - 1)) * chartW;
            const clamped = Math.max(0, Math.min(maxLoss, lossVal));
            const y = padTop + chartH - (clamped / maxLoss) * chartH;
            return { x, y };
        };

        // Draw Test Loss (Orange Line)
        ctx.strokeStyle = '#ff7700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        this.history.forEach((pt, i) => {
            const c = getCoord(i, pt.testLoss);
            if (i === 0) ctx.moveTo(c.x, c.y);
            else ctx.lineTo(c.x, c.y);
        });
        ctx.stroke();

        // Draw Train Loss (Cyan Line)
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        this.history.forEach((pt, i) => {
            const c = getCoord(i, pt.trainLoss);
            if (i === 0) ctx.moveTo(c.x, c.y);
            else ctx.lineTo(c.x, c.y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Current Metrics Legend
        const last = this.history[this.history.length - 1];
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';

        ctx.fillStyle = '#00f0ff';
        ctx.fillText(`Train Loss: ${last.trainLoss.toFixed(4)} (${last.trainAcc.toFixed(1)}%)`, padLeft + 8, padTop + 14);

        ctx.fillStyle = '#ff7700';
        ctx.fillText(`Test Loss: ${last.testLoss.toFixed(4)} (${last.testAcc.toFixed(1)}%)`, padLeft + 8, padTop + 28);
    }
}

window.LossChartRenderer = LossChartRenderer;
