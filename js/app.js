/**
 * NEURAL NETWORK PLAYGROUND - MAIN CONTROLLER
 * Hyperparameter coordination, topology builder, training loop, and UI events.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State & Hyperparameters
    let currentDatasetKey = 'circles';
    let noiseLevel = 0.08;
    let sampleCount = 240;
    let trainRatio = 0.8;

    let learningRate = 0.03;
    let activationName = 'tanh';
    let optimizerType = 'adam';
    let regType = 'none';
    let regLambda = 0.001;

    let topology = [2, 4, 4, 1]; // Input: 2, Output: 1

    let isTraining = false;
    let animationFrameId = null;

    // 2. Instantiate Models and Renderers
    let nn = new NeuralNetwork(topology, activationName);
    let trainData = [];
    let testData = [];

    const boundaryRenderer = new DecisionBoundaryRenderer('boundaryCanvas', nn);
    const netRenderer = new NetworkRenderer('networkCanvas', nn);
    const lossChart = new LossChartRenderer('lossCanvas');

    // DOM Elements
    const datasetSelectEl = document.getElementById('datasetSelect');
    const noiseSliderEl = document.getElementById('noiseSlider');
    const noiseLabelEl = document.getElementById('noiseLabel');
    const lrSelectEl = document.getElementById('lrSelect');
    const actSelectEl = document.getElementById('actSelect');
    const optSelectEl = document.getElementById('optSelect');
    const regSelectEl = document.getElementById('regSelect');
    const presetSelectEl = document.getElementById('presetSelect');

    const btnPlayEl = document.getElementById('btnPlay');
    const btnStepEl = document.getElementById('btnStep');
    const btnResetEl = document.getElementById('btnReset');
    const epochCountEl = document.getElementById('epochCount');
    const trainLossValEl = document.getElementById('trainLossVal');
    const testLossValEl = document.getElementById('testLossVal');

    const topologyControlsContainerEl = document.getElementById('topologyControlsContainer');
    const btnAddLayerEl = document.getElementById('btnAddLayer');
    const btnRemoveLayerEl = document.getElementById('btnRemoveLayer');

    // 3. Dataset Generation
    function reloadDataset() {
        let rawPoints = [];
        if (currentDatasetKey === 'circles') rawPoints = DatasetGenerator.generateCircles(sampleCount, noiseLevel);
        else if (currentDatasetKey === 'spirals') rawPoints = DatasetGenerator.generateSpirals(sampleCount, noiseLevel);
        else if (currentDatasetKey === 'xor') rawPoints = DatasetGenerator.generateXOR(sampleCount, noiseLevel);
        else if (currentDatasetKey === 'two_moons') rawPoints = DatasetGenerator.generateTwoMoons(sampleCount, noiseLevel);
        else if (currentDatasetKey === 'clusters') rawPoints = DatasetGenerator.generateClusters(sampleCount, noiseLevel);

        const split = DatasetGenerator.splitTrainTest(rawPoints, trainRatio);
        trainData = split.train;
        testData = split.test;

        boundaryRenderer.setData(trainData, testData);
        lossChart.clear();
        updateEvaluations();
        renderAll();
    }

    // 4. Dynamic Topology Editor UI
    function renderTopologyControls() {
        topologyControlsContainerEl.innerHTML = '';

        // Render hidden layers (index 1 to topology.length - 2)
        for (let l = 1; l < topology.length - 1; l++) {
            const layerBox = document.createElement('div');
            layerBox.className = 'layer-control-chip';
            layerBox.innerHTML = `
                <span class="layer-title">Capa ${l}</span>
                <div class="neuron-stepper">
                    <button class="btn-micro btn-sub-neuron" data-layer="${l}">-</button>
                    <span class="neuron-num">${topology[l]}</span>
                    <button class="btn-micro btn-add-neuron" data-layer="${l}">+</button>
                </div>
            `;

            layerBox.querySelector('.btn-sub-neuron').addEventListener('click', () => {
                if (topology[l] > 1) {
                    topology[l] -= 1;
                    rebuildNetwork();
                }
            });

            layerBox.querySelector('.btn-add-neuron').addEventListener('click', () => {
                if (topology[l] < 8) {
                    topology[l] += 1;
                    rebuildNetwork();
                }
            });

            topologyControlsContainerEl.appendChild(layerBox);
        }
    }

    function rebuildNetwork() {
        pauseTraining();
        nn.setTopology([...topology]);
        nn.setActivation(activationName);
        netRenderer.setNetwork(nn);
        boundaryRenderer.setNetwork(nn);
        lossChart.clear();
        renderTopologyControls();
        updateEvaluations();
        renderAll();
    }

    btnAddLayerEl.addEventListener('click', () => {
        // Max 4 hidden layers
        if (topology.length - 2 < 4) {
            topology.splice(topology.length - 1, 0, 4); // Add layer with 4 neurons
            rebuildNetwork();
        }
    });

    btnRemoveLayerEl.addEventListener('click', () => {
        // Min 1 hidden layer
        if (topology.length - 2 > 1) {
            topology.splice(topology.length - 2, 1);
            rebuildNetwork();
        }
    });

    // 5. Training Step & Loop
    function executeTrainingStep() {
        if (trainData.length === 0) return;

        // Convert points to Matrix
        const X = new Matrix(trainData.length, 2);
        const yTrue = new Matrix(trainData.length, 1);
        for (let i = 0; i < trainData.length; i++) {
            X.data[i][0] = trainData[i].x;
            X.data[i][1] = trainData[i].y;
            yTrue.data[i][0] = trainData[i].label;
        }

        // Multiple mini-steps per frame for snappy convergence (5 steps per tick)
        for (let step = 0; step < 5; step++) {
            nn.trainStep(X, yTrue, learningRate, optimizerType, regType, regLambda);
        }

        updateEvaluations();
        renderAll();
    }

    function updateEvaluations() {
        const trainEval = nn.evaluate(trainData);
        const testEval = nn.evaluate(testData);

        epochCountEl.textContent = nn.epoch.toLocaleString();
        trainLossValEl.textContent = `${trainEval.loss.toFixed(4)} (${trainEval.accuracy.toFixed(1)}%)`;
        testLossValEl.textContent = `${testEval.loss.toFixed(4)} (${testEval.accuracy.toFixed(1)}%)`;

        lossChart.addPoint({
            epoch: nn.epoch,
            trainLoss: trainEval.loss,
            testLoss: testEval.loss,
            trainAcc: trainEval.accuracy,
            testAcc: testEval.accuracy
        });
    }

    function renderAll() {
        boundaryRenderer.render();
        netRenderer.render();
    }

    function startTraining() {
        if (isTraining) return;
        isTraining = true;
        btnPlayEl.innerHTML = '⏸ Pausar';
        btnPlayEl.classList.remove('btn-primary');
        btnPlayEl.classList.add('btn-secondary');

        function loop() {
            if (!isTraining) return;
            executeTrainingStep();
            animationFrameId = requestAnimationFrame(loop);
        }
        animationFrameId = requestAnimationFrame(loop);
    }

    function pauseTraining() {
        isTraining = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        btnPlayEl.innerHTML = '▶ Entrenar';
        btnPlayEl.classList.add('btn-primary');
        btnPlayEl.classList.remove('btn-secondary');
    }

    // 6. Event Listeners
    btnPlayEl.addEventListener('click', () => {
        if (isTraining) pauseTraining();
        else startTraining();
    });

    btnStepEl.addEventListener('click', () => {
        pauseTraining();
        executeTrainingStep();
    });

    btnResetEl.addEventListener('click', () => {
        rebuildNetwork();
    });

    datasetSelectEl.addEventListener('change', (e) => {
        currentDatasetKey = e.target.value;
        reloadDataset();
    });

    noiseSliderEl.addEventListener('input', (e) => {
        noiseLevel = parseFloat(e.target.value);
        noiseLabelEl.textContent = `Ruido: ${Math.round(noiseLevel * 100)}%`;
        reloadDataset();
    });

    lrSelectEl.addEventListener('change', (e) => {
        learningRate = parseFloat(e.target.value);
    });

    actSelectEl.addEventListener('change', (e) => {
        activationName = e.target.value;
        nn.setActivation(activationName);
    });

    optSelectEl.addEventListener('change', (e) => {
        optimizerType = e.target.value;
    });

    regSelectEl.addEventListener('change', (e) => {
        regType = e.target.value;
    });

    // 7. Preset Selector
    presetSelectEl.addEventListener('change', (e) => {
        const presetKey = e.target.value;
        if (!presetKey || !NnPresets[presetKey]) return;

        const p = NnPresets[presetKey];
        pauseTraining();

        currentDatasetKey = p.dataset;
        datasetSelectEl.value = p.dataset;

        noiseLevel = p.noise;
        noiseSliderEl.value = p.noise;
        noiseLabelEl.textContent = `Ruido: ${Math.round(p.noise * 100)}%`;

        sampleCount = p.samples;
        topology = [...p.topology];
        activationName = p.activation;
        actSelectEl.value = p.activation;

        learningRate = p.learningRate;
        lrSelectEl.value = p.learningRate.toString();

        optimizerType = p.optimizer;
        optSelectEl.value = p.optimizer;

        regType = p.regType;
        regSelectEl.value = p.regType;
        regLambda = p.regLambda;

        rebuildNetwork();
        reloadDataset();
        presetSelectEl.value = '';
    });

    // 8. Initial Setup
    renderTopologyControls();
    reloadDataset();
});
