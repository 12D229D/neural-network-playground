# Bitácora y Plan de Ruta — Estudio Interactivo de Redes Neuronales

> **Directorio:** `neural-network-playground`  
> **Categoría:** 🪐 Simuladores / 🛠️ Herramientas / 📚 Manuales  
> **Estado:** ✅ Completado  

---

## 📌 Resumen del Subproyecto
`neural-network-playground` es un entorno educativo e interactivo en el navegador para construir, entrenar y visualizar redes neuronales artificiales (Perceptrón Multicapa / MLP) en tiempo real. Permite modificar interactivamente la topología de la red (capas ocultas de 1 a 4, neuronas por capa de 1 a 8), elegir funciones de activación (ReLU, LeakyReLU, Sigmoide, Tanh, Linear), ajustar la tasa de aprendizaje ($\alpha$), el optimizador (Adam, Momentum, SGD), la regularización (L1/L2) y visualizar en Canvas las fronteras de decisión 2D, los pesos sinápticos y las curvas de pérdida (Loss) y precisión (Accuracy) durante el entrenamiento.

---

## 🎯 Objetivos Principales
- [x] **Visualizador dinámico de topología:** Diagrama interactivo de capas, conexiones (pesos $w_{ij}$) y sesgos ($b_j$) con grosor y color según su magnitud y signo en Canvas.
- [x] **Entrenamiento en tiempo real:** Motor JS de Forward propagation y Backpropagation con cálculo analítico de gradientes y optimizadores (Adam, Momentum, SGD).
- [x] **Plano 2D de Frontera de Decisión:** Renderizado Canvas 2D en tiempo real del plano cartesiano clasificando datos no lineales (Círculos concéntricos, Espirales dobles, XOR, Dos Lunas, Clusters).
- [x] **Curva de Pérdida en Vivo:** Gráfica continua de Loss y Accuracy de Train vs Test en Canvas.
- [x] **Catálogo de Experimentos:** Presets para resolver XOR, clasificar espirales, círculos con ReLU/Tanh y demostración de sobreajuste.

---

## 🏗️ Arquitectura

- **Patrón Arquitectónico**: Single Page Application (SPA) con arquitectura modular orientada a objetos (POO), desacoplamiento entre el motor de deep learning y los módulos de renderizado Canvas 2D a 60 FPS.

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

- **Flujo de datos**:
  1. `datasets.js` genera los puntos de datos 2D $(x_1, x_2)$ con etiquetas $\{0, 1\}$.
  2. `neural-network.js` ejecuta `trainStep` calculando la pasada hacia adelante (*Forward Pass*) y la retropropagación del error (*Backpropagation* con derivadas analíticas) actualizando pesos mediante Adam/SGD.
  3. `decision-boundary.js` evalúa una malla de $50 \times 50$ celdas para pintar el mapa de calor de probabilidades.
  4. `nn-renderer.js` actualiza las líneas sinápticas con grosor y color según los pesos $w_{ij}$.
  5. `loss-chart.js` acumula y grafica la pérdida de entrenamiento y prueba a lo largo de las épocas.

---

## 🧠 Paradigma de Programación

- **Híbrido: Orientado a Objetos (POO) + Funcional + Event-Driven**:
  - **POO**: Clases `Matrix`, `DenseLayer`, `NeuralNetwork`, `NetworkRenderer`, `DecisionBoundaryRenderer` y `LossChartRenderer` con encapsulamiento de estado.
  - **Funcional**: Operaciones inmutables sobre matrices, mapeo de funciones de activación y derivadas analíticas puras.
  - **Event-Driven**: Bucle continuo de animación con `requestAnimationFrame` y controladores de eventos reactivos para hiperparámetros.

---

## 🌐 Propósito de Visibilidad y Destino Remoto

- **Visibilidad**: `Público (Open Source / Portafolio)`.
- **Plataforma Remota Asignada**: `GitHub`.
- **Plataforma de Despliegue CI/CD**: `GitHub Pages` / `Cloudflare Pages`.
- **Justificación**: Entorno interactivo y visual para experimentación con redes neuronales sin credenciales privadas ni backend de pago, óptimo para divulgación abierta y despliegue estático de alto rendimiento.

---

---

## 📋 Tareas Realizadas

### Fase 1: Lienzo de Datos y Controles
- [x] Creación de `index.html` con panel de control de hiperparámetros, lienzo de la red, lienzo de frontera 2D y gráfico de pérdida.
- [x] Creación de `css/style.css` con diseño oscuro tipo laboratorio, controles estilizados y tarjetas glassmorphic.
- [x] Implementación de generadores de datasets 2D (`js/datasets.js`: Círculos, Espirales, XOR, Dos Lunas, Clusters).

### Fase 2: Motor de Aprendizaje Profundo
- [x] Implementación de `js/matrix.js` (álgebra lineal 2D: producto punto, trasposición, broadcasting de bias, init He/Xavier).
- [x] Implementación de `js/activations.js` (ReLU, LeakyReLU, Tanh, Sigmoid, Linear y sus derivadas).
- [x] Implementación de `js/neural-network.js` (clases `DenseLayer`, `NeuralNetwork`, Forward, Backprop, optimizadores Adam/Momentum/SGD y regularización L1/L2).

### Fase 3: Visualización en Tiempo Real
- [x] Implementación de `js/nn-renderer.js` (diagrama de la red con sinapsis coloreadas por peso positivo/negativo y sesgos).
- [x] Implementación de `js/decision-boundary.js` (renderizado de mapa de calor 2D con malla $50 \times 50$).
- [x] Gráfico en vivo de Loss vs. Epochs con `js/loss-chart.js`.

### Fase 4: Experimentos y Optimización
- [x] Catálogo de experimentos preconfigurados (`js/presets.js`).
- [x] Controles de entrenamiento: Iniciar/Pausar, Paso a Paso (Step), Reinicio de pesos y ajuste dinámico de capas/neuronas.
- [x] Verificación de fluidez a 60 FPS, diseño responsive y creación de `README.md`.

## Estado actual

🟢 **Completado** — 17 tareas completadas, 0 pendientes (sincronizado en auditoría 2026-10-03).
