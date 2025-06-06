document.addEventListener('DOMContentLoaded', () => {
    const digitElements = document.querySelectorAll('.digit');
    let currentSeconds = 0;

    function updateCounter() {
        currentSeconds++;
        const timeString = currentSeconds.toString().padStart(6, '0');

        digitElements.forEach((digitElement, index) => {
            const oldDigit = digitElement.textContent;
            const newDigit = timeString[index];

            if (oldDigit !== newDigit) {
                // Remove old digit span if it exists
                const oldSpan = digitElement.querySelector('span');
                if (oldSpan) {
                    oldSpan.remove();
                }

                // Create new digit span
                const newSpan = document.createElement('span');
                newSpan.textContent = newDigit;
                digitElement.textContent = ''; // Clear the direct text content
                digitElement.appendChild(newSpan);

                // Basic animation: slide down (can be improved)
                // For a true mechanical rotation, this would be more complex,
                // involving multiple number elements per digit slot and CSS animations.
                // This is a simplified version for now.
                newSpan.style.transform = 'translateY(100%)';
                requestAnimationFrame(() => { // Ensure the transform is applied before transitioning
                    newSpan.style.transform = 'translateY(0)';
                });
            }
        });
    }

    // Update the counter every second
    setInterval(updateCounter, 1000);

    // Initial setup
    digitElements.forEach(digitElement => {
        const span = document.createElement('span');
        span.textContent = '0';
        digitElement.textContent = ''; // Clear direct text
        digitElement.appendChild(span);
    });
});
