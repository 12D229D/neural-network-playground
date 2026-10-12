/**
 * 2D NON-LINEAR CLASSIFICATION DATASETS GENERATOR
 * Circles, Spirals, XOR, Two Moons, and Gaussian Clusters.
 */

class DatasetGenerator {
    static gaussianNoise(sigma = 0.1) {
        const u1 = Math.random() || 1e-7;
        const u2 = Math.random() || 1e-7;
        return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2) * sigma;
    }

    static generateCircles(numSamples = 200, noise = 0.1) {
        const points = [];
        const nPerClass = Math.floor(numSamples / 2);

        // Class 0: Outer ring (radius ~ 3.5 to 4.5)
        for (let i = 0; i < nPerClass; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 3.6 + Math.random() * 0.8 + this.gaussianNoise(noise);
            points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle), label: 0 });
        }

        // Class 1: Inner core (radius ~ 0 to 1.8)
        for (let i = 0; i < nPerClass; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 1.8 + this.gaussianNoise(noise);
            points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle), label: 1 });
        }

        return points;
    }

    static generateSpirals(numSamples = 200, noise = 0.1) {
        const points = [];
        const nPerClass = Math.floor(numSamples / 2);

        for (let i = 0; i < nPerClass; i++) {
            // Spiral 1 (Class 0)
            const r1 = (i / nPerClass) * 4.5;
            const angle1 = (i / nPerClass) * 1.75 * Math.PI * 2;
            points.push({
                x: r1 * Math.sin(angle1) + this.gaussianNoise(noise),
                y: r1 * Math.cos(angle1) + this.gaussianNoise(noise),
                label: 0
            });

            // Spiral 2 (Class 1) - offset by 180 degrees
            const r2 = (i / nPerClass) * 4.5;
            const angle2 = (i / nPerClass) * 1.75 * Math.PI * 2 + Math.PI;
            points.push({
                x: r2 * Math.sin(angle2) + this.gaussianNoise(noise),
                y: r2 * Math.cos(angle2) + this.gaussianNoise(noise),
                label: 1
            });
        }

        return points;
    }

    static generateXOR(numSamples = 200, noise = 0.1) {
        const points = [];
        for (let i = 0; i < numSamples; i++) {
            const x = (Math.random() - 0.5) * 8.0;
            const y = (Math.random() - 0.5) * 8.0;
            // Pad points away from axes slightly for cleaner margin
            const paddedX = x + (x >= 0 ? 0.3 : -0.3);
            const paddedY = y + (y >= 0 ? 0.3 : -0.3);

            const label = (paddedX * paddedY > 0) ? 0 : 1;
            points.push({
                x: paddedX + this.gaussianNoise(noise),
                y: paddedY + this.gaussianNoise(noise),
                label
            });
        }
        return points;
    }

    static generateTwoMoons(numSamples = 200, noise = 0.1) {
        const points = [];
        const nPerClass = Math.floor(numSamples / 2);

        // Moon 1 (Upper)
        for (let i = 0; i < nPerClass; i++) {
            const angle = Math.PI * (i / nPerClass);
            const r = 2.4;
            points.push({
                x: r * Math.cos(angle) - 1.2 + this.gaussianNoise(noise),
                y: r * Math.sin(angle) - 0.5 + this.gaussianNoise(noise),
                label: 0
            });
        }

        // Moon 2 (Lower reversed)
        for (let i = 0; i < nPerClass; i++) {
            const angle = Math.PI * (i / nPerClass);
            const r = 2.4;
            points.push({
                x: 1.2 - r * Math.cos(angle) + this.gaussianNoise(noise),
                y: 0.5 - r * Math.sin(angle) + this.gaussianNoise(noise),
                label: 1
            });
        }

        return points;
    }

    static generateClusters(numSamples = 200, noise = 0.1) {
        const points = [];
        const nPerClass = Math.floor(numSamples / 2);

        // Cluster 0 (Top-left)
        for (let i = 0; i < nPerClass; i++) {
            points.push({
                x: -2.0 + this.gaussianNoise(0.7 + noise),
                y: 2.0 + this.gaussianNoise(0.7 + noise),
                label: 0
            });
        }

        // Cluster 1 (Bottom-right)
        for (let i = 0; i < nPerClass; i++) {
            points.push({
                x: 2.0 + this.gaussianNoise(0.7 + noise),
                y: -2.0 + this.gaussianNoise(0.7 + noise),
                label: 1
            });
        }

        return points;
    }

    // Split points into Train and Test sets
    static splitTrainTest(points, trainRatio = 0.8) {
        // Shuffle
        const shuffled = [...points].sort(() => Math.random() - 0.5);
        const splitIdx = Math.floor(shuffled.length * trainRatio);
        return {
            train: shuffled.slice(0, splitIdx),
            test: shuffled.slice(splitIdx)
        };
    }
}

window.DatasetGenerator = DatasetGenerator;
