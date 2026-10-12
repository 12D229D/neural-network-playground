/**
 * 2D MATRIX MATH LIBRARY FOR NEURAL NETWORKS
 * Vectorized array operations, matrix multiplication, broadcasting, and random initialization.
 */

class Matrix {
    constructor(rows, cols, data = null) {
        this.rows = rows;
        this.cols = cols;
        if (data) {
            this.data = data;
        } else {
            this.data = [];
            for (let r = 0; r < rows; r++) {
                this.data.push(new Float64Array(cols));
            }
        }
    }

    static from2DArray(arr) {
        const rows = arr.length;
        const cols = arr[0].length;
        const mat = new Matrix(rows, cols);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                mat.data[r][c] = arr[r][c];
            }
        }
        return mat;
    }

    static zeros(rows, cols) {
        return new Matrix(rows, cols);
    }

    // He / Xavier normal initialization
    static random(rows, cols, scale = 1.0) {
        const mat = new Matrix(rows, cols);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Box-Muller transform for normal distribution N(0, 1)
                const u1 = Math.random() || 1e-7;
                const u2 = Math.random() || 1e-7;
                const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
                mat.data[r][c] = randStdNormal * scale;
            }
        }
        return mat;
    }

    copy() {
        const mat = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; r++) {
            mat.data[r].set(this.data[r]);
        }
        return mat;
    }

    // Dot product: C = A * B
    dot(other) {
        if (this.cols !== other.rows) {
            throw new Error(`Matrix dot mismatch: (${this.rows}x${this.cols}) * (${other.rows}x${other.cols})`);
        }
        const result = new Matrix(this.rows, other.cols);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < other.cols; c++) {
                let sum = 0;
                for (let k = 0; k < this.cols; k++) {
                    sum += this.data[r][k] * other.data[k][c];
                }
                result.data[r][c] = sum;
            }
        }
        return result;
    }

    transpose() {
        const result = new Matrix(this.cols, this.rows);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                result.data[c][r] = this.data[r][c];
            }
        }
        return result;
    }

    // Element-wise addition with broadcasting for 1xCols bias vector
    add(other) {
        const result = new Matrix(this.rows, this.cols);
        const isBroadcast = (other.rows === 1 && other.cols === this.cols);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const otherVal = isBroadcast ? other.data[0][c] : other.data[r][c];
                result.data[r][c] = this.data[r][c] + otherVal;
            }
        }
        return result;
    }

    // Element-wise subtraction
    sub(other) {
        const result = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                result.data[r][c] = this.data[r][c] - other.data[r][c];
            }
        }
        return result;
    }

    // Element-wise multiplication (Hadamard product)
    multElementwise(other) {
        const result = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                result.data[r][c] = this.data[r][c] * other.data[r][c];
            }
        }
        return result;
    }

    // Scalar multiplication
    scale(scalar) {
        const result = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                result.data[r][c] = this.data[r][c] * scalar;
            }
        }
        return result;
    }

    // Map a function f(val) to every element
    map(fn) {
        const result = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                result.data[r][c] = fn(this.data[r][c], r, c);
            }
        }
        return result;
    }

    // Sum columns down to a 1xCols row vector (used for bias gradient accumulation)
    sumCols() {
        const result = new Matrix(1, this.cols);
        for (let c = 0; c < this.cols; c++) {
            let sum = 0;
            for (let r = 0; r < this.rows; r++) {
                sum += this.data[r][c];
            }
            result.data[0][c] = sum;
        }
        return result;
    }
}

window.Matrix = Matrix;
