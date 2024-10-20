let selectedShape = ''; // Default is no shape selected
let selectedColor = '#ff0000'; // Default color
let isDrawing = false;
let isDragging = false;
let draggingShape = null;
let shapes = []; // Array to store all drawn shapes
let startX, startY;


// Shape and color selection
document.querySelectorAll('.shape').forEach(button => {
    button.addEventListener('click', function() {
        // Снимаем класс active со всех кнопок
        document.querySelectorAll('.shape').forEach(btn => btn.classList.remove('active'));

        // Если кнопка уже была активна, снимем выделение
        if (selectedShape === this.getAttribute('data-shape')) {
            selectedShape = ''; // Деактивируем, если была выбрана
        } else {
            // Активируем текущую кнопку
            selectedShape = this.getAttribute('data-shape');
            this.classList.add('active');
        }
    });
});

document.querySelectorAll('.color').forEach(button => {
    button.addEventListener('click', function() {
        selectedColor = this.getAttribute('data-color');
        document.querySelectorAll('.color').forEach(btn => btn.style.borderColor = '#fff');
        this.style.borderColor = '#333';
    });
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Canvas mouse events for drawing and dragging shapes
canvas.addEventListener('mousedown', function(e) {
    const [x, y] = [e.offsetX, e.offsetY];

    // Check if a shape is clicked for dragging
    const clickedShape = getShapeAtPosition(x, y);
    if (clickedShape) {
        isDragging = true;
        draggingShape = clickedShape;

        if (draggingShape.type === 'circle') {
            // Центр круга для корректного захвата
            startX = x - draggingShape.x;
            startY = y - draggingShape.y;
        } else {
            startX = x - draggingShape.x;
            startY = y - draggingShape.y;
        }

        redrawCanvas(true); // Highlight the shape being dragged
    } else if (selectedShape) {
        // Start drawing a new shape if a shape is selected
        isDrawing = true;
        startX = x;
        startY = y;
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging && draggingShape) {
        const [x, y] = [e.offsetX, e.offsetY];

        if (draggingShape.type === 'circle') {
            // Перемещение круга с учетом радиуса
            draggingShape.x = x - startX;
            draggingShape.y = y - startY;
        } else {
            draggingShape.x = x - startX;
            draggingShape.y = y - startY;
        }

        redrawCanvas(true); // Highlight the shape being dragged
    }
});


canvas.addEventListener('mouseup', function(e) {
    if (isDrawing) {
        const endX = e.offsetX;
        const endY = e.offsetY;
        const shape = drawShape(startX, startY, endX, endY);
        if (shape) {
            shapes.push(shape); // Store the shape in the array
        }
        isDrawing = false;
    } else if (isDragging) {
        isDragging = false;
        draggingShape = null;
        redrawCanvas(); // Remove highlighting after dragging
    }
});

// Draw the selected shape and return it as an object
function drawShape(x1, y1, x2, y2) {
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    const radius = Math.min(width, height) / 2; // Радиус круга

    // Проверка минимального размера
    if (width < 5 || height < 5) {
        return null; // Не рисуем фигуру, если она слишком мала
    }

    const side = Math.min(width, height); // Ромб должен иметь равные стороны
    let shape = { type: selectedShape, x: x1, y: y1, width: side, height: side, color: selectedColor };

    ctx.fillStyle = selectedColor;

    switch (selectedShape) {
        case 'square':
            ctx.fillRect(x1, y1, side, side); // draw square
            break;
        case 'circle':
            const radius = side / 2; // Радиус круга
            shape = { type: selectedShape, x: x1 + radius, y: y1 + radius, radius, color: selectedColor }; // Центр круга
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, radius, 0, Math.PI * 2); // Рисуем круг
            ctx.fill();
            break;
        case 'diamond':
            ctx.save();
            ctx.translate(x1 + side / 2, y1 + side / 2); // Центр ромба
            ctx.rotate((45 * Math.PI) / 180); // Поворот на 45 градусов
            ctx.fillRect(-side / 2, -side / 2, side, side); // Рисуем ромб как квадрат, повернутый на 45 градусов
            ctx.restore();
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(x1 + side / 2, y1); // Верхняя вершина
            ctx.lineTo(x1, y1 + side); // Левая нижняя вершина
            ctx.lineTo(x1 + side, y1 + side); // Правая нижняя вершина
            ctx.closePath();
            ctx.fill();
            break;
    }

    return shape;
}



// Get the shape at a given (x, y) position
function getShapeAtPosition(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (isInsideShape(x, y, shape)) {
            return shape;
        }
    }
    return null;
}

// Check if (x, y) is inside a shape
function isInsideShape(x, y, shape) {
    if (!shape || !shape.type) return false; // Проверка на существование фигуры и её типа
    
    switch (shape.type) {
        case 'square':
            // Проверка попадания в квадрат
            return x > shape.x && x < shape.x + shape.width && y > shape.y && y < shape.y + shape.width;

        case 'diamond':
            // Для ромба нужно рассчитать, находится ли точка внутри повёрнутого квадрата
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;
            const dx = Math.abs(x - centerX);
            const dy = Math.abs(y - centerY);
            // Проверяем попадание в ромб, который является квадратом, повернутым на 45 градусов
            return (dx + dy) <= (shape.width / 2); // Простая проверка для ромба

        case 'circle':
            const distanceX = x - shape.x; // Центр круга по X
            const distanceY = y - shape.y; // Центр круга по Y
            const distanceFromCenter = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            return distanceFromCenter <= shape.radius; // Проверка попадания в круг
        case 'triangle':
            // Оставляем как есть, так как треугольник уже работает идеально
            return isPointInTriangle(x, y, shape);

        default:
            return false;
    }
}


// Triangle collision detection using Barycentric coordinates
function isPointInTriangle(px, py, triangle) {
    const x1 = triangle.x + triangle.width / 2;
    const y1 = triangle.y;
    const x2 = triangle.x;
    const y2 = triangle.y + triangle.height;
    const x3 = triangle.x + triangle.width;
    const y3 = triangle.y + triangle.height;

    const area = Math.abs((x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2)) / 2.0);

    const a = Math.abs((px*(y2 - y3) + x2*(y3 - py) + x3*(py - y2)) / 2.0);
    const b = Math.abs((x1*(py - y3) + px*(y3 - y1) + x3*(y1 - py)) / 2.0);
    const c = Math.abs((x1*(y2 - py) + x2*(py - y1) + px*(y1 - y2)) / 2.0);

    return (a + b + c) === area;
}

// Redraw all shapes in the shapes array, with optional highlighting for dragged shape
function getExtremePoints(shape) {
    let minX, maxX, minY, maxY;
    switch (shape.type) {
        case 'diamond':
            // Положение ромба относительно центра
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;

            // Вычисляем диагональ квадрата
            const diagonal = Math.sqrt(2) * shape.width; // Полная диагональ ромба

            // Границы ромба с учетом его центра
            minX = centerX - diagonal / 2;
            maxX = centerX + diagonal / 2;
            minY = centerY - diagonal / 2;
            maxY = centerY + diagonal / 2;
            break;
        case 'square':
            minX = shape.x;
            maxX = shape.x + shape.width;
            minY = shape.y;
            maxY = shape.y + shape.width;
            break;
        case 'circle':
            minX = shape.x - shape.radius;
            maxX = shape.x + shape.radius;
            minY = shape.y - shape.radius;
            maxY = shape.y + shape.radius;
            break;
        case 'triangle':
            minX = Math.min(shape.x + shape.width / 2, shape.x, shape.x + shape.width);
            maxX = Math.max(shape.x + shape.width / 2, shape.x, shape.x + shape.width);
            minY = shape.y;
            maxY = shape.y + shape.height;
            break;
    }
    return { minX, maxX, minY, maxY };
}


function redrawCanvas(highlightDragged = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

    shapes.forEach(shape => {
        if (!shape || !shape.color) {
            return; // Пропускаем, если shape или его color отсутствуют
        }

        ctx.fillStyle = shape.color;
        if (highlightDragged && shape === draggingShape) {
            const padding = 4; // Отступ для рамки

            const { minX, maxX, minY, maxY } = getExtremePoints(shape);

            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 2;

            // Рисуем bounding box
            ctx.strokeRect(minX - padding, minY - padding, (maxX - minX) + padding * 2, (maxY - minY) + padding * 2);
        }

        switch (shape.type) {
            case 'square':
                ctx.fillRect(shape.x, shape.y, shape.width, shape.width);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'diamond':
                ctx.save();
                ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
                ctx.rotate((45 * Math.PI) / 180); // Ромб повернут на 45 градусов
                ctx.fillRect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
                ctx.restore();
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(shape.x + shape.width / 2, shape.y);
                ctx.lineTo(shape.x, shape.y + shape.height);
                ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
                ctx.closePath();
                ctx.fill();
                break;
        }
    });
}

///11

function getExtremePoints(shape) {
    let minX, maxX, minY, maxY;
    switch (shape.type) {
        case 'diamond':
            
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;

            const diagonal = Math.sqrt(2) * shape.width;

            minX = centerX - diagonal / 2;
            maxX = centerX + diagonal / 2;
            minY = centerY - diagonal / 2;
            maxY = centerY + diagonal / 2;
            break;
        case 'square':
            minX = shape.x;
            maxX = shape.x + shape.width;
            minY = shape.y;
            maxY = shape.y + shape.width;
            break;
        case 'circle':
            minX = shape.x - shape.radius;
            maxX = shape.x + shape.radius;
            minY = shape.y - shape.radius;
            maxY = shape.y + shape.radius;
            break;
        case 'triangle':
            minX = Math.min(shape.x + shape.width / 2, shape.x, shape.x + shape.width);
            maxX = Math.max(shape.x + shape.width / 2, shape.x, shape.x + shape.width);
            minY = shape.y;
            maxY = shape.y + shape.height;
            break;
    }
    return { minX, maxX, minY, maxY };
}


document.getElementById('clearCanvas').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
});