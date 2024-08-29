document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const toolProperties = {
        brushColor: '#000000',
        brushSize: 5,
        brushOpacity: 100,
        eraserSize: 5,
        eraserOpacity: 100,
        shapeType: 'circle',
        shapeSize: 10,
        shapeColor: '#000000',
        textProperties: {
            typeface: 'Arial',
            size: 16,
            style: 'normal'
        },
        cloneSource: null
    };
    let currentTool = null;
    let isDrawing = false;
    let startX, startY;

    canvas.width = 1280;
    canvas.height = 600;

    function setTool(tool) {
        currentTool = tool;
        document.querySelectorAll('.tool-properties').forEach(el => el.style.display = 'none');
        if (tool) {
            document.getElementById(`${tool}-properties`).style.display = 'block';
        }
    }

    document.getElementById('brush-tool').addEventListener('click', () => setTool('brush'));
    document.getElementById('eraser-tool').addEventListener('click', () => setTool('eraser'));
    document.getElementById('move-tool').addEventListener('click', () => setTool('move'));
    document.getElementById('shape-tool').addEventListener('click', () => setTool('shape'));
    document.getElementById('color-picker-tool').addEventListener('click', () => setTool('color-picker'));
    document.getElementById('paint-bucket-tool').addEventListener('click', () => setTool('paint-bucket'));
    document.getElementById('text-tool').addEventListener('click', () => setTool('text'));
    document.getElementById('clone-stamp-tool').addEventListener('click', () => setTool('clone-stamp'));

    // Brush Tool Functions
    function drawBrush(x, y) {
        if (!isDrawing || currentTool !== 'brush') return;
        ctx.beginPath();
        ctx.arc(x, y, toolProperties.brushSize, 0, Math.PI * 2);
        ctx.fillStyle = toolProperties.brushColor;
        ctx.globalAlpha = toolProperties.brushOpacity / 100;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset opacity
    }

    // Eraser Tool Functions
    function erase(x, y) {
        if (!isDrawing || currentTool !== 'eraser') return;
        ctx.clearRect(x - toolProperties.eraserSize, y - toolProperties.eraserSize, toolProperties.eraserSize * 2, toolProperties.eraserSize * 2);
    }

    // Move Tool Functions
    function moveContent(x, y) {
        // Implement move functionality by modifying the content's position
        // This is typically more complex and might involve dragging and repositioning elements or layers
    }

    // Shape Tool Functions
    function drawShape(x, y) {
        if (currentTool !== 'shape') return;
        ctx.beginPath();
        ctx.fillStyle = toolProperties.shapeColor;
        switch (toolProperties.shapeType) {
            case 'circle':
                ctx.arc(x, y, toolProperties.shapeSize, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(x - toolProperties.shapeSize / 2, y - toolProperties.shapeSize / 2, toolProperties.shapeSize, toolProperties.shapeSize);
                break;
            case 'rectangle':
                ctx.fillRect(x - toolProperties.shapeSize / 2, y - toolProperties.shapeSize / 2, toolProperties.shapeSize * 2, toolProperties.shapeSize);
                break;
            case 'line':
                // Draw a line from the start point to the current point
                ctx.moveTo(startX, startY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = toolProperties.shapeColor;
                ctx.lineWidth = toolProperties.shapeSize;
                ctx.stroke();
                break;
        }
    }

    // Color Picker Tool Functions
    function pickColor(x, y) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        toolProperties.brushColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        document.getElementById('brush-color').value = toolProperties.brushColor;
    }

    // Paint Bucket Tool Functions
    function fillArea(x, y) {
        // Implement paint bucket fill functionality using flood fill algorithm
        const targetColor = ctx.getImageData(x, y, 1, 1).data;
        const fillColor = toolProperties.brushColor;
        if (targetColor[0] === parseInt(fillColor.slice(1, 3), 16) &&
            targetColor[1] === parseInt(fillColor.slice(3, 5), 16) &&
            targetColor[2] === parseInt(fillColor.slice(5, 7), 16)) return;
        const stack = [[x, y]];
        while (stack.length) {
            const [cx, cy] = stack.pop();
            const pixel = ctx.getImageData(cx, cy, 1, 1).data;
            if (pixel[0] === targetColor[0] && pixel[1] === targetColor[1] && pixel[2] === targetColor[2]) {
                ctx.fillStyle = fillColor;
                ctx.fillRect(cx, cy, 1, 1);
                stack.push([cx + 1, cy]);
                stack.push([cx - 1, cy]);
                stack.push([cx, cy + 1]);
                stack.push([cx, cy - 1]);
            }
        }
    }

    // Text Tool Functions
    function addText(x, y, text) {
        if (currentTool !== 'text') return;
        ctx.font = `${toolProperties.textProperties.style} ${toolProperties.textProperties.size}px ${toolProperties.textProperties.typeface}`;
        ctx.fillStyle = toolProperties.brushColor;
        ctx.fillText(text, x, y);
    }

    // Clone Stamp Tool Functions
    function cloneStamp(x, y) {
        if (toolProperties.cloneSource) {
            ctx.putImageData(toolProperties.cloneSource, x, y);
        }
    }

    // Handle Mouse Events
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const { offsetX: x, offsetY: y } = e;
        startX = x;
        startY = y;
        if (currentTool === 'clone-stamp') {
            toolProperties.cloneSource = ctx.getImageData(startX - 25, startY - 25, 50, 50);
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const { offsetX: x, offsetY: y } = e;
        if (currentTool === 'brush') {
            drawBrush(x, y);
        } else if (currentTool === 'eraser') {
            erase(x, y);
        } else if (currentTool === 'shape') {
            drawShape(x, y);
        } else if (currentTool === 'color-picker') {
            pickColor(x, y);
        } else if (currentTool === 'paint-bucket') {
            fillArea(x, y);
        } else if (currentTool === 'text') {
            // Handle text placement
        } else if (currentTool === 'clone-stamp') {
            cloneStamp(x, y);
        }
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);

    // Handle Properties Changes
    document.getElementById('brush-size').addEventListener('input', (e) => {
        toolProperties.brushSize = e.target.value;
        document.getElementById('brush-size-value').textContent = toolProperties.brushSize;
    });

    document.getElementById('brush-color').addEventListener('input', (e) => {
        toolProperties.brushColor = e.target.value;
    });

    document.getElementById('brush-opacity').addEventListener('input', (e) => {
        toolProperties.brushOpacity = e.target.value;
        document.getElementById('brush-opacity-value').textContent = toolProperties.brushOpacity;
    });

    document.getElementById('eraser-size').addEventListener('input', (e) => {
        toolProperties.eraserSize = e.target.value;
        document.getElementById('eraser-size-value').textContent = toolProperties.eraserSize;
    });

    document.getElementById('eraser-opacity').addEventListener('input', (e) => {
        toolProperties.eraserOpacity = e.target.value;
        document.getElementById('eraser-opacity-value').textContent = toolProperties.eraserOpacity;
    });

    document.getElementById('move-rotate').addEventListener('input', (e) => {
        // Implement rotation functionality
    });

    document.getElementById('move-flip-horizontal').addEventListener('change', (e) => {
        // Implement flip horizontal functionality
    });

    document.getElementById('move-flip-vertical').addEventListener('change', (e) => {
        // Implement flip vertical functionality
    });

    document.getElementById('shape-type').addEventListener('change', (e) => {
        toolProperties.shapeType = e.target.value;
    });

    document.getElementById('shape-size').addEventListener('input', (e) => {
        toolProperties.shapeSize = e.target.value;
        document.getElementById('shape-size-value').textContent = toolProperties.shapeSize;
    });

    document.getElementById('shape-color').addEventListener('input', (e) => {
        toolProperties.shapeColor = e.target.value;
    });

    document.getElementById('text-typeface').addEventListener('change', (e) => {
        toolProperties.textProperties.typeface = e.target.value;
    });

    document.getElementById('text-size').addEventListener('input', (e) => {
        toolProperties.textProperties.size = e.target.value;
        document.getElementById('text-size-value').textContent = toolProperties.textProperties.size;
    });

    document.getElementById('text-style').addEventListener('change', (e) => {
        toolProperties.textProperties.style = e.target.value;
    });

    document.getElementById('paint-bucket-color').addEventListener('input', (e) => {
        // Update paint bucket fill color
    });

    document.getElementById('undo-button').addEventListener('click', () => {
        // Implement undo functionality
    });

    document.getElementById('redo-button').addEventListener('click', () => {
        // Implement redo functionality
    });

    document.getElementById('zoom-in-button').addEventListener('click', () => {
        // Implement zoom in functionality
    });

    document.getElementById('zoom-out-button').addEventListener('click', () => {
        // Implement zoom out functionality
    });
});
