/**
 * NEURAL NETWORK ARCHITECTURE CANVAS RENDERER
 * Visualizes layers, nodes, synaptic weights (cyan=positive, orange=negative), and biases.
 */

class NetworkRenderer {
    constructor(canvasId, neuralNetwork) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nn = neuralNetwork;
        this.selectedNeuron = null; // { layerIdx, neuronIdx }
    }

    setNetwork(nn) {
        this.nn = nn;
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const layers = this.nn.topology;
        const numLayers = layers.length;
        const paddingX = 45;
        const paddingY = 35;
        const usableW = this.canvas.width - paddingX * 2;
        const layerSpacing = usableW / (numLayers - 1);

        // Precompute neuron positions
        const nodePositions = [];
        for (let l = 0; l < numLayers; l++) {
            const count = layers[l];
            const layerNodes = [];
            const usableH = this.canvas.height - paddingY * 2;
            const nodeSpacing = count > 1 ? usableH / (count - 1) : 0;
            const startY = count > 1 ? paddingY : this.canvas.height / 2;

            for (let n = 0; n < count; n++) {
                const x = paddingX + l * layerSpacing;
                const y = count > 1 ? paddingY + n * nodeSpacing : startY;
                layerNodes.push({ x, y });
            }
            nodePositions.push(layerNodes);
        }

        // 1. Draw Synaptic Connections (Weights)
        for (let l = 0; l < numLayers - 1; l++) {
            const denseLayer = this.nn.layers[l];
            const fromNodes = nodePositions[l];
            const toNodes = nodePositions[l + 1];

            for (let i = 0; i < fromNodes.length; i++) {
                for (let j = 0; j < toNodes.length; j++) {
                    const weight = denseLayer ? denseLayer.weights.data[i][j] : 0;
                    const isPos = weight >= 0;
                    const absW = Math.abs(weight);

                    // Clamp line width and opacity
                    const lineWidth = Math.max(0.6, Math.min(6.0, absW * 2.2));
                    const alpha = Math.max(0.15, Math.min(0.9, absW * 0.5 + 0.15));

                    ctx.strokeStyle = isPos ? `hsla(185, 100%, 50%, ${alpha})` : `hsla(25, 100%, 55%, ${alpha})`;
                    ctx.lineWidth = lineWidth;

                    ctx.beginPath();
                    ctx.moveTo(fromNodes[i].x, fromNodes[i].y);
                    ctx.lineTo(toNodes[j].x, toNodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // 2. Draw Neurons (Nodes)
        const nodeRadius = 14;

        for (let l = 0; l < numLayers; l++) {
            const count = layers[l];
            const isInput = (l === 0);
            const isOutput = (l === numLayers - 1);

            for (let n = 0; n < count; n++) {
                const pos = nodePositions[l][n];

                // Bias value if hidden or output
                let biasVal = 0;
                if (!isInput && this.nn.layers[l - 1]) {
                    biasVal = this.nn.layers[l - 1].biases.data[0][n];
                }

                // Outer Bias Glow Ring
                ctx.save();
                if (!isInput) {
                    const biasColor = biasVal >= 0 ? '#00f0ff' : '#ff7700';
                    ctx.strokeStyle = biasColor;
                    ctx.lineWidth = 2.5;
                    ctx.shadowColor = biasColor;
                    ctx.shadowBlur = 8;
                } else {
                    ctx.strokeStyle = '#a0a0c0';
                    ctx.lineWidth = 1.5;
                }

                // Node Body Fill
                ctx.fillStyle = 'hsla(235, 30%, 12%, 0.95)';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();

                // Text Label inside node
                ctx.font = 'bold 9px "JetBrains Mono", monospace';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                if (isInput) {
                    ctx.fillText(`x${n + 1}`, pos.x, pos.y);
                } else if (isOutput) {
                    ctx.fillText('ŷ', pos.x, pos.y);
                } else {
                    ctx.fillText(`${n + 1}`, pos.x, pos.y);
                }
            }
        }

        // 3. Layer Headers
        ctx.font = '10px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#6b6b8a';
        ctx.textAlign = 'center';

        for (let l = 0; l < numLayers; l++) {
            const x = paddingX + l * layerSpacing;
            let label = `Oculta ${l}`;
            if (l === 0) label = 'Entrada (2)';
            else if (l === numLayers - 1) label = 'Salida (1)';
            ctx.fillText(label, x, 18);
        }
    }
}

window.NetworkRenderer = NetworkRenderer;
