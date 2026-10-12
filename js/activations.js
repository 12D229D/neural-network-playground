/**
 * NEURAL NETWORK ACTIVATION FUNCTIONS & DERIVATIVES
 */

const Activations = {
    relu: {
        id: 'relu',
        name: 'ReLU (Rectified Linear Unit)',
        fn: (x) => Math.max(0, x),
        dfn: (x, output) => (output > 0 ? 1 : 0) // derivative given output f(x)
    },

    leaky_relu: {
        id: 'leaky_relu',
        name: 'Leaky ReLU (α=0.05)',
        fn: (x) => (x >= 0 ? x : 0.05 * x),
        dfn: (x, output) => (output >= 0 ? 1 : 0.05)
    },

    tanh: {
        id: 'tanh',
        name: 'Tanh (Tangente Hiperbólica)',
        fn: (x) => Math.tanh(x),
        dfn: (x, output) => 1 - output * output // d/dx tanh(x) = 1 - tanh^2(x)
    },

    sigmoid: {
        id: 'sigmoid',
        name: 'Sigmoide',
        fn: (x) => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, x)))),
        dfn: (x, output) => output * (1 - output) // d/dx σ(x) = σ(x)(1 - σ(x))
    },

    linear: {
        id: 'linear',
        name: 'Lineal (Identidad)',
        fn: (x) => x,
        dfn: (x, output) => 1
    }
};

window.Activations = Activations;
