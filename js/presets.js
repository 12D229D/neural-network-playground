/**
 * PRESET EXPERIMENTS CATALOG FOR NEURAL NETWORK PLAYGROUND
 */

const NnPresets = {
    xorProblem: {
        id: 'xor_problem',
        name: 'Problema XOR (Mínima Red No Lineal)',
        description: 'Aprende la compuerta XOR no lineal separable usando 1 capa oculta de 4 neuronas.',
        dataset: 'xor',
        noise: 0.05,
        samples: 200,
        topology: [2, 4, 1],
        activation: 'tanh',
        learningRate: 0.08,
        optimizer: 'adam',
        regType: 'none',
        regLambda: 0
    },

    concentricCircles: {
        id: 'concentric_circles',
        name: 'Círculos Concéntricos con ReLU',
        description: 'Separa un anillo exterior de un núcleo interior usando 2 capas ocultas con ReLU.',
        dataset: 'circles',
        noise: 0.08,
        samples: 240,
        topology: [2, 6, 4, 1],
        activation: 'relu',
        learningRate: 0.03,
        optimizer: 'adam',
        regType: 'none',
        regLambda: 0
    },

    intertwinedSpirals: {
        id: 'intertwined_spirals',
        name: 'Espirales Entrelazadas (Alta Complejidad)',
        description: 'Frontera de decisión espiral altamente no lineal con 3 capas ocultas profundas [8, 8, 6].',
        dataset: 'spirals',
        noise: 0.05,
        samples: 300,
        topology: [2, 8, 8, 6, 1],
        activation: 'relu',
        learningRate: 0.04,
        optimizer: 'adam',
        regType: 'l2',
        regLambda: 0.0005
    },

    twoMoons: {
        id: 'two_moons',
        name: 'Dos Lunas (Two Moons)',
        description: 'Clasificación de dos semilunas entrelazadas mediante Leaky ReLU y Momentum.',
        dataset: 'two_moons',
        noise: 0.12,
        samples: 220,
        topology: [2, 6, 6, 1],
        activation: 'leaky_relu',
        learningRate: 0.04,
        optimizer: 'momentum',
        regType: 'none',
        regLambda: 0
    },

    overfittingVsL2: {
        id: 'overfitting_vs_l2',
        name: 'Sobreajuste (Overfitting) vs Regularización L2',
        description: 'Red de alta capacidad con regularización L2 (Weight Decay) para evitar memorización de ruido.',
        dataset: 'circles',
        noise: 0.25,
        samples: 120,
        topology: [2, 8, 8, 1],
        activation: 'tanh',
        learningRate: 0.03,
        optimizer: 'adam',
        regType: 'l2',
        regLambda: 0.01
    }
};

window.NnPresets = NnPresets;
