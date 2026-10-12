# 🧠 NEURAL NETWORK PLAYGROUND

Un estudio visual, interactivo y educativo de **Aprendizaje Profundo (Deep Learning)** para construir, entrenar y explorar redes neuronales artificiales (**Perceptrón Multicapa / MLP**) en tiempo real en el navegador, 100% en Vanilla JavaScript y acelerado por Canvas 2D.

---

## 🌟 Características Principales

1. **Motor de Deep Learning en Vanilla JS (`js/matrix.js`, `js/neural-network.js`)**:
   - Álgebra matricial optimizada con producto punto ($C = A \cdot B$), trasposición y broadcasting para bias.
   - Pasada hacia adelante (*Forward Pass*) y retropropagación del error (*Backpropagation*) con derivadas analíticas exactas.
   - Optimizadores soportados: **Adam** (con estimación adaptativa de momentos $m_t, v_t$), **SGD con Momentum** ($\beta = 0.9$) y **SGD clásico**.
   - Regularización: **L2 (Ridge / Weight Decay)** y **L1 (Lasso)** para combatir el sobreajuste (*Overfitting*).

2. **Visualizador de Fronteras de Decisión 2D (`js/decision-boundary.js`)**:
   - Evaluación en tiempo real de una cuadrícula espacial de $50 \times 50$ puntos sobre el plano $[-6, 6] \times [-6, 6]$.
   - Mapa de calor de gradiente continuo que separa las regiones predichas para la **Clase 0 (Naranja)** y la **Clase 1 (Cian)**.
   - Superposición de datos de entrenamiento y datos de validación (*Test*).

3. **Editor Dinámico de Arquitectura & Pesos Sinápticos (`js/nn-renderer.js`)**:
   - Permite añadir o quitar capas ocultas (1 a 4 capas) y modificar neuronas por capa (1 a 8) en caliente.
   - Sinapsis con grosor y color según el signo y magnitud del peso $w_{ij}$ (Cian = positivo, Naranja = negativo).
   - Anillos de nodos que reflejan el sesgo (*bias*) y la activación de las neuronas.

4. **Generador de Datasets No Lineales 2D (`js/datasets.js`)**:
   - **Círculos Concéntricos**: Separación de anillo exterior y núcleo interior.
   - **Espirales Dobles Entrelazadas**: Problema de alta no linealidad.
   - **Problema XOR**: La prueba fundacional de no linealidad de Minsky & Papert.
   - **Dos Lunas (Two Moons)**: Semicírculos intercalados.
   - **Clusters Gaussianos**: Agrupaciones separables para pruebas rápidas.
   - Control de ruido gaussiano ($\sigma$) y división Train/Test.

5. **Gráfico de Convergencia en Vivo (`js/loss-chart.js`)**:
   - Registro en tiempo real de la función de pérdida (*Binary Cross-Entropy*) y porcentaje de precisión (*Accuracy*) a lo largo de las épocas.

6. **Catálogo de Experimentos Preconfigurados (`js/presets.js`)**:
   - Solución mínima al problema XOR con 1 capa oculta.
   - Espirales complejas con 3 capas ocultas ReLU.
   - Círculos concéntricos con activación Tanh.
   - Demostración de sobreajuste (*Overfitting*) vs Regularización L2.

---

## 🏗️ Estructura de Archivos

```text
neural-network-playground/
├── index.html                      # Layout semántico, controles y 3 lienzos Canvas
├── css/
│   └── style.css                   # Sistema de diseño Deep Lab Dark Glassmorphism
├── js/
│   ├── matrix.js                   # Álgebra de matrices 2D y operaciones vectorizadas
│   ├── activations.js              # Funciones de activación (ReLU, Tanh, Sigmoid, LeakyReLU, Linear)
│   ├── datasets.js                 # Generadores de datos 2D (Círculos, Espirales, XOR, Lunas, Clusters)
│   ├── neural-network.js           # Motor MLP: DenseLayer, Forward, Backpropagation, Adam/SGD
│   ├── nn-renderer.js              # Renderizador Canvas de la topología de la red y sinapsis
│   ├── decision-boundary.js        # Renderizador Canvas 2D del mapa de calor de fronteras de decisión
│   ├── loss-chart.js               # Renderizador Canvas de curvas de Loss y Accuracy
│   ├── presets.js                  # Experimentos preconfigurados
│   └── app.js                      # Orquestador de UI y bucle de entrenamiento a 60 FPS
├── README.md                       # Documentación técnica completa
└── plan.md                         # Bitácora de desarrollo y estado del proyecto
```

---

## 🚀 Cómo Ejecutar

Abre el archivo `index.html` en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari). No requiere servidores locales ni dependencias de npm.
