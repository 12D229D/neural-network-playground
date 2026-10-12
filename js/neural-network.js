/**
 * MULTI-LAYER PERCEPTRON (MLP) & DEEP LEARNING ENGINE
 * Forward propagation, backpropagation with analytical gradients, Adam/SGD optimizers, and L1/L2 regularization.
 */

class DenseLayer {
    constructor(inFeatures, outFeatures, activationName = 'tanh') {
        this.inFeatures = inFeatures;
        this.outFeatures = outFeatures;
        this.activation = Activations[activationName] || Activations.tanh;

        // He / Xavier normal weight initialization
        const scale = Math.sqrt(2.0 / inFeatures);
        this.weights = Matrix.random(inFeatures, outFeatures, scale);
        this.biases = Matrix.zeros(1, outFeatures);

        // Cached forward values
        this.lastInput = null;
        this.lastZ = null;
        this.lastA = null;

        // Optimizer state (Momentum & Adam)
        this.vW = Matrix.zeros(inFeatures, outFeatures);
        this.vb = Matrix.zeros(1, outFeatures);
        this.mW = Matrix.zeros(inFeatures, outFeatures);
        this.mb = Matrix.zeros(1, outFeatures);
        this.sW = Matrix.zeros(inFeatures, outFeatures);
        this.sb = Matrix.zeros(1, outFeatures);
        this.t = 0; // Adam time step
    }

    forward(inputMatrix) {
        this.lastInput = inputMatrix;
        // Z = X * W + b
        this.lastZ = inputMatrix.dot(this.weights).add(this.biases);
        // A = f(Z)
        this.lastA = this.lastZ.map(this.activation.fn);
        return this.lastA;
    }

    backward(dA, learningRate = 0.03, optimizer = 'adam', regType = 'none', regLambda = 0.001) {
        const batchSize = this.lastInput.rows;

        // dZ = dA ⊙ f'(Z, A)
        const dZ = new Matrix(this.lastZ.rows, this.lastZ.cols);
        for (let r = 0; r < dZ.rows; r++) {
            for (let c = 0; c < dZ.cols; c++) {
                const zVal = this.lastZ.data[r][c];
                const aVal = this.lastA.data[r][c];
                dZ.data[r][c] = dA.data[r][c] * this.activation.dfn(zVal, aVal);
            }
        }

        // dW = (1/N) * X^T * dZ
        let dW = this.lastInput.transpose().dot(dZ).scale(1 / batchSize);
        // db = (1/N) * sum_rows(dZ)
        let db = dZ.sumCols().scale(1 / batchSize);

        // Regularization on weights
        if (regType === 'l2') {
            // L2 Ridge: dW += (lambda / N) * W
            dW = dW.add(this.weights.scale(regLambda));
        } else if (regType === 'l1') {
            // L1 Lasso: dW += (lambda / N) * sign(W)
            const signW = this.weights.map(w => (w > 0 ? 1 : w < 0 ? -1 : 0));
            dW = dW.add(signW.scale(regLambda));
        }

        // dX_prev = dZ * W^T
        const dXPrev = dZ.dot(this.weights.transpose());

        // Update Weights & Biases via Optimizer
        this.updateParameters(dW, db, learningRate, optimizer);

        return dXPrev;
    }

    updateParameters(dW, db, lr, optimizer) {
        this.t += 1;

        if (optimizer === 'adam') {
            const beta1 = 0.9;
            const beta2 = 0.999;
            const eps = 1e-8;

            for (let r = 0; r < this.weights.rows; r++) {
                for (let c = 0; c < this.weights.cols; c++) {
                    const g = dW.data[r][c];
                    this.mW.data[r][c] = beta1 * this.mW.data[r][c] + (1 - beta1) * g;
                    this.sW.data[r][c] = beta2 * this.sW.data[r][c] + (1 - beta2) * g * g;

                    const mHat = this.mW.data[r][c] / (1 - Math.pow(beta1, this.t));
                    const sHat = this.sW.data[r][c] / (1 - Math.pow(beta2, this.t));

                    this.weights.data[r][c] -= (lr * mHat) / (Math.sqrt(sHat) + eps);
                }
            }

            for (let c = 0; c < this.biases.cols; c++) {
                const gb = db.data[0][c];
                this.mb.data[0][c] = beta1 * this.mb.data[0][c] + (1 - beta1) * gb;
                this.sb.data[0][c] = beta2 * this.sb.data[0][c] + (1 - beta2) * gb * gb;

                const mHat = this.mb.data[0][c] / (1 - Math.pow(beta1, this.t));
                const sHat = this.sb.data[0][c] / (1 - Math.pow(beta2, this.t));

                this.biases.data[0][c] -= (lr * mHat) / (Math.sqrt(sHat) + eps);
            }
        } else if (optimizer === 'momentum') {
            const beta = 0.9;
            for (let r = 0; r < this.weights.rows; r++) {
                for (let c = 0; c < this.weights.cols; c++) {
                    this.vW.data[r][c] = beta * this.vW.data[r][c] + lr * dW.data[r][c];
                    this.weights.data[r][c] -= this.vW.data[r][c];
                }
            }
            for (let c = 0; c < this.biases.cols; c++) {
                this.vb.data[0][c] = beta * this.vb.data[0][c] + lr * db.data[0][c];
                this.biases.data[0][c] -= this.vb.data[0][c];
            }
        } else {
            // Standard SGD
            for (let r = 0; r < this.weights.rows; r++) {
                for (let c = 0; c < this.weights.cols; c++) {
                    this.weights.data[r][c] -= lr * dW.data[r][c];
                }
            }
            for (let c = 0; c < this.biases.cols; c++) {
                this.biases.data[0][c] -= lr * db.data[0][c];
            }
        }
    }
}

class NeuralNetwork {
    constructor(topology = [2, 4, 4, 1], activationName = 'tanh') {
        this.topology = topology;
        this.activationName = activationName;
        this.layers = [];
        this.epoch = 0;
        this.initLayers();
    }

    initLayers() {
        this.layers = [];
        for (let i = 0; i < this.topology.length - 1; i++) {
            const inDim = this.topology[i];
            const outDim = this.topology[i + 1];
            // Output layer uses Sigmoid for binary probability output [0, 1]
            const act = (i === this.topology.length - 2) ? 'sigmoid' : this.activationName;
            this.layers.push(new DenseLayer(inDim, outDim, act));
        }
        this.epoch = 0;
    }

    setActivation(activationName) {
        this.activationName = activationName;
        for (let i = 0; i < this.layers.length - 1; i++) {
            this.layers[i].activation = Activations[activationName] || Activations.tanh;
        }
    }

    setTopology(newTopology) {
        this.topology = newTopology;
        this.initLayers();
    }

    forward(inputMatrix) {
        let current = inputMatrix;
        for (const layer of this.layers) {
            current = layer.forward(current);
        }
        return current;
    }

    trainStep(X, yTrue, learningRate = 0.03, optimizer = 'adam', regType = 'none', regLambda = 0.001) {
        // 1. Forward Pass
        const yPred = this.forward(X);

        // 2. Binary Cross-Entropy Loss Derivative: dL/dY_pred = (yPred - yTrue) / (yPred * (1 - yPred) + eps)
        // Combined with sigmoid output derivative σ'(z) = σ(z)(1 - σ(z)), the initial dZ = (yPred - yTrue)
        const dA = new Matrix(yPred.rows, yPred.cols);
        for (let r = 0; r < yPred.rows; r++) {
            const y = yTrue.data[r][0];
            const p = Math.max(1e-7, Math.min(1 - 1e-7, yPred.data[r][0]));
            dA.data[r][0] = (p - y) / (p * (1 - p));
        }

        // 3. Backpropagation through layers in reverse
        let grad = dA;
        for (let i = this.layers.length - 1; i >= 0; i--) {
            grad = this.layers[i].backward(grad, learningRate, optimizer, regType, regLambda);
        }

        this.epoch += 1;
    }

    // Evaluate Metrics: Binary Cross-Entropy Loss & Accuracy (%)
    evaluate(points) {
        if (!points || points.length === 0) return { loss: 0, accuracy: 0 };

        const X = new Matrix(points.length, 2);
        const yTrue = new Matrix(points.length, 1);
        for (let i = 0; i < points.length; i++) {
            X.data[i][0] = points[i].x;
            X.data[i][1] = points[i].y;
            yTrue.data[i][0] = points[i].label;
        }

        const yPred = this.forward(X);
        let totalLoss = 0;
        let correct = 0;

        for (let i = 0; i < points.length; i++) {
            const y = yTrue.data[i][0];
            const p = Math.max(1e-7, Math.min(1 - 1e-7, yPred.data[i][0]));
            // Cross Entropy: -[y*log(p) + (1-y)*log(1-p)]
            totalLoss += -(y * Math.log(p) + (1 - y) * Math.log(1 - p));

            const predictedClass = p >= 0.5 ? 1 : 0;
            if (predictedClass === y) correct += 1;
        }

        return {
            loss: totalLoss / points.length,
            accuracy: (correct / points.length) * 100
        };
    }

    // Fast single-point forward prediction for decision boundary visualization
    predictPoint(x1, x2) {
        const inputMat = new Matrix(1, 2);
        inputMat.data[0][0] = x1;
        inputMat.data[0][1] = x2;
        const out = this.forward(inputMat);
        return out.data[0][0]; // Probability [0, 1]
    }
}

window.DenseLayer = DenseLayer;
window.NeuralNetwork = NeuralNetwork;
