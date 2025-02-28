let isDragging = false;
let offsetX, offsetY;
let draggable = document.getElementsByClassName("chess-piece")[0];

draggable.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = draggable.offsetLeft + (e.clientX - draggable.offsetLeft);
    offsetY = draggable.offsetTop + (e.clientY - draggable.offsetTop);

    console.log("clientX: " + e.clientX, "offsetLeft: " + draggable.offsetLeft, " offsetX: " + offsetX);
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        draggable.style.left = `${e.clientX - offsetX}px`;
        draggable.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    draggable.style.cursor = 'grab';
});