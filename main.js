document.addEventListener('DOMContentLoaded', () => {
    const counterContainer = document.querySelector('.counter-container');
    const numDigits = 6;
    const digitsPerDrum = 10; // 0-9
    const faceHeight = 90; // Must match CSS .digit-face height
    const rotationAngleIncrement = 360 / digitsPerDrum; // Angle for each number change
    // Calculate the translateZ distance for the faces to form a cylinder
    // R = faceHeight / (2 * tan(PI / digitsPerDrum))
    const translateZ = (faceHeight / 2) / Math.tan(Math.PI / digitsPerDrum);

    let currentSeconds = 0;
    let updateInterval = 1000; // Default update interval in ms
    let intervalId = null;

    // Initialize digit drums
    for (let i = 0; i < numDigits; i++) {
        const slot = document.createElement('div');
        slot.classList.add('digit-slot');

        const drum = document.createElement('div');
        drum.classList.add('digit-drum');
        drum.dataset.digitIndex = i; // Store index for later use

        for (let j = 0; j < digitsPerDrum; j++) {
            const face = document.createElement('div');
            face.classList.add('digit-face');
            face.textContent = j;
            // Position each face in a cylindrical arrangement
            const angle = rotationAngleIncrement * j;
            face.style.transform = `rotateX(${angle}deg) translateZ(${translateZ}px)`;
            drum.appendChild(face);
        }
        slot.appendChild(drum);
        counterContainer.appendChild(slot);
    }

    const digitDrums = document.querySelectorAll('.digit-drum');

    function updateCounter() {
        currentSeconds++;
        const timeString = currentSeconds.toString().padStart(numDigits, '0');

        digitDrums.forEach((drum, index) => {
            const targetDigit = parseInt(timeString[index], 10);
            // Calculate the rotation: each digit is 360/10 = 36 degrees.
            // We want to rotate to show the targetDigit on the 'front' (0 degrees rotation)
            // So, if targetDigit is 3, we rotate by -3 * 36 degrees.
            const currentRotation = drum.dataset.currentRotation || 0;
            // Important: The rotation is negative because we are rotating the drum 'upwards'
            // to bring the next number from below.
            const newRotation = -targetDigit * rotationAngleIncrement;

            // Add a check to prevent unnecessary re-renders/animations if the digit hasn't changed
            // This can be improved by storing the current digit shown by each drum.
            // For now, we'll always apply the rotation.

            drum.style.transform = `rotateX(${newRotation}deg)`;
            drum.dataset.currentRotation = newRotation;
        });
    }

    // --- Controls for rotation speed ---
    const speedInput = document.getElementById('speedInput');
    const setSpeedButton = document.getElementById('setSpeedButton');

    if (setSpeedButton) {
        setSpeedButton.addEventListener('click', () => {
            const newSpeed = parseInt(speedInput.value, 10);
            if (!isNaN(newSpeed) && newSpeed > 0) {
                updateInterval = newSpeed;
                if (intervalId) {
                    clearInterval(intervalId);
                }
                intervalId = setInterval(updateCounter, updateInterval);
                console.log(`Counter speed updated to ${updateInterval}ms`);
            } else {
                console.warn('Invalid speed input. Please enter a positive number.');
            }
        });
    } else {
        console.warn('Speed control button not found in HTML.');
    }

    // Initialize counter and start interval
    function startCounter() {
        // Set initial state of drums to '0'
        digitDrums.forEach(drum => {
            drum.style.transform = 'rotateX(0deg)'; // Show '0'
            drum.dataset.currentRotation = 0;
        });
        updateCounter(); // Initial call to set time immediately
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(updateCounter, updateInterval);
    }

    startCounter();
});
