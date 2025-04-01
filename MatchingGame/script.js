document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".item");

    items.forEach(item => {
        item.style.position = "absolute";
        item.style.left = `${Math.random() * 80 + 10}%`;
        item.style.top = `${Math.random() * 80 + 10}%`;

        item.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/plain", event.target.id);
            event.target.style.opacity = "0.5";
        });

        item.addEventListener("dragend", event => {
            event.target.style.opacity = "1";
        });

        document.getElementById("game-area").addEventListener("dragover", event => {
            event.preventDefault();
        });

        document.getElementById("game-area").addEventListener("drop", event => {
            event.preventDefault();
            const draggedId = event.dataTransfer.getData("text/plain");
            const draggedElement = document.getElementById(draggedId);

            // Move the item to the new location
            const rect = event.currentTarget.getBoundingClientRect();
            draggedElement.style.left = `${event.clientX - rect.left - draggedElement.offsetWidth / 2}px`;
            draggedElement.style.top = `${event.clientY - rect.top - draggedElement.offsetHeight / 2}px`;

            // Check if dropped on a matching element
            const dropTarget = document.elementFromPoint(event.clientX, event.clientY);
            if (dropTarget && dropTarget.dataset.match === draggedElement.dataset.match && dropTarget !== draggedElement) {
                draggedElement.remove();
                dropTarget.remove();
            }
        });
    });
});
