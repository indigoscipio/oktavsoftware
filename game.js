const canvas = document.getElementById('game-of-life');
const ctx = canvas.getContext('2d');

const CELL = 14;
const GAP = 1;
const SIZE = CELL - GAP;
const DENSITY = 0.18;
const FRAME_SKIP = 4;

let cols, rows, grid;
let frame = 0;
let running = false;
let id = null;

function resize() {
    const rect = document.getElementById('hero');
    canvas.width = rect.offsetWidth;
    canvas.height = rect.offsetHeight;
    cols = Math.floor(canvas.width / CELL);
    rows = Math.floor(canvas.height / CELL);
    grid = createGrid();
}

function createGrid() {
    const g = [];
    for (let i = 0; i < cols; i++) {
        g[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            g[i][j] = Math.random() < DENSITY ? 1 : 0;
        }
    }
    return g;
}

function nextGen() {
    const next = [];
    for (let i = 0; i < cols; i++) {
        next[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            let n = 0;
            for (let di = -1; di <= 1; di++) {
                const ni = i + di;
                if (ni < 0 || ni >= cols) continue;
                for (let dj = -1; dj <= 1; dj++) {
                    if (di === 0 && dj === 0) continue;
                    const nj = j + dj;
                    if (nj < 0 || nj >= rows) continue;
                    n += grid[ni][nj];
                }
            }
            if (grid[i][j] === 1) {
                next[i][j] = (n === 2 || n === 3) ? 1 : 0;
            } else {
                next[i][j] = (n === 3) ? 1 : 0;
            }
        }
    }
    grid = next;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j]) {
                ctx.fillStyle = 'rgba(43, 147, 72, 0.2)';
                ctx.fillRect(i * CELL + 1, j * CELL + 1, SIZE, SIZE);
            }
        }
    }
}

function tick() {
    if (!running) return;
    frame++;
    if (frame % FRAME_SKIP === 0) {
        nextGen();
        draw();
    }
    id = requestAnimationFrame(tick);
}

const obs = new IntersectionObserver((entries) => {
    for (const e of entries) {
        if (e.isIntersecting) {
            running = true;
            id = requestAnimationFrame(tick);
        } else {
            running = false;
            if (id) cancelAnimationFrame(id);
        }
    }
}, { threshold: 0 });

obs.observe(canvas);

window.addEventListener('resize', resize);

resize();
running = true;
tick();
