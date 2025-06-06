document.addEventListener('DOMContentLoaded', () => {
    // --- Counter Logic Variables ---
    const digitWheels = document.querySelectorAll('.digit-wheel');
    let globalCount = 0;
    let updateInterval = 1000; // Default, will be controlled by slider
    let intervalId = null;

    function updateDigitWheel(wheelElement, newValue) {
        const rotationAngle = newValue * 36;
        wheelElement.style.transform = `rotateX(-${rotationAngle}deg)`;
        wheelElement.classList.add('rolling');
        setTimeout(() => {
            wheelElement.classList.remove('rolling');
        }, 600);
    }

    function updateCounterDisplay() { // Removed newCount param, uses globalCount
        globalCount++;
        if (globalCount > 999999) {
            globalCount = 0;
        }
        const countString = String(globalCount).padStart(6, '0');
        digitWheels.forEach((wheel, i) => {
            const digit = parseInt(countString[i]);
            updateDigitWheel(wheel, digit);
        });
    }

    function startCounterInterval() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        // Initial display update before interval starts
        // To handle the first number correctly without waiting for the first interval:
        // We need to set the initial state based on globalCount (which is 0)
        const initialCountString = String(globalCount).padStart(6, '0');
        digitWheels.forEach((wheel, i) => {
            const digit = parseInt(initialCountString[i]);
            updateDigitWheel(wheel, digit);
        });

        intervalId = setInterval(updateCounterDisplay, updateInterval);
    }

    // Call updateCounterDisplay once at the start to show 000000 without delay and without incrementing globalCount yet
    const initialDisplayString = String(globalCount).padStart(6, '0');
    digitWheels.forEach((wheel, i) => {
        const digit = parseInt(initialDisplayString[i]);
        updateDigitWheel(wheel, digit);
    });
    // Then start the interval which will handle increments
    startCounterInterval();


    // --- Zoom Controls Logic ---
    const counterWrapper = document.querySelector('.counter-wrapper');
    const zoomInButton = document.getElementById('zoomInButton');
    const zoomOutButton = document.getElementById('zoomOutButton');
    const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
    let currentZoomLevel = 1.0;
    const zoomStep = 0.1;

    function applyZoom() {
        if (counterWrapper) {
            counterWrapper.style.transform = `scale(${currentZoomLevel})`;
        }
        if (zoomLevelDisplay) {
            zoomLevelDisplay.textContent = `${Math.round(currentZoomLevel * 100)}%`;
        }
    }

    if (zoomInButton && zoomOutButton && zoomLevelDisplay) {
        zoomInButton.addEventListener('click', () => {
            currentZoomLevel += zoomStep;
            applyZoom();
        });
        zoomOutButton.addEventListener('click', () => {
            currentZoomLevel -= zoomStep;
            if (currentZoomLevel < zoomStep) currentZoomLevel = zoomStep;
            applyZoom();
        });
        applyZoom(); // Initial display
    } else {
        console.warn("Zoom control elements not all found.");
    }

    // --- Rotation Speed Control Logic ---
    const rotationSpeedSlider = document.getElementById('rotationSpeedSlider');
    const rotationSpeedValueDisplay = document.getElementById('rotationSpeedValueDisplay');

    if (rotationSpeedSlider && rotationSpeedValueDisplay) {
        rotationSpeedValueDisplay.textContent = rotationSpeedSlider.value; // Set initial display

        rotationSpeedSlider.addEventListener('input', () => {
            const newSpeed = parseInt(rotationSpeedSlider.value, 10);
            rotationSpeedValueDisplay.textContent = newSpeed;
            updateInterval = newSpeed; // Update the interval time
            startCounterInterval(); // Restart the counter with the new interval
            console.log(`Rotation speed updated to: ${updateInterval}ms`);
        });
    } else {
        console.warn("Rotation speed slider or display element not found.");
    }


    // --- Shadow Control Logic ---
    const shadowOpacitySlider = document.getElementById('shadowOpacitySlider');
    const shadowOffsetXSlider = document.getElementById('shadowOffsetXSlider');
    const shadowOffsetYSlider = document.getElementById('shadowOffsetYSlider');
    const shadowBlurSlider = document.getElementById('shadowBlurSlider');

    const shadowOpacityValueDisplay = document.getElementById('shadowOpacityValueDisplay');
    const shadowOffsetXValueDisplay = document.getElementById('shadowOffsetXValueDisplay');
    const shadowOffsetYValueDisplay = document.getElementById('shadowOffsetYValueDisplay');
    const shadowBlurValueDisplay = document.getElementById('shadowBlurValueDisplay');

    // Target element for the shadow, e.g., the main counter container
    const elementToShadow = document.querySelector('.counter-container');

    let currentShadowProps = {
        opacity: 0.1,
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        color: 'rgba(0,0,0,' // Base color, opacity will be appended
    };

    function applyBoxShadow() {
        if (elementToShadow) {
            const shadowColor = currentShadowProps.color + currentShadowProps.opacity + ')';
            elementToShadow.style.boxShadow = `${currentShadowProps.offsetX}px ${currentShadowProps.offsetY}px ${currentShadowProps.blur}px ${shadowColor}`;
        }
    }

    function updateShadowDisplayValues() {
        if (shadowOpacityValueDisplay) shadowOpacityValueDisplay.textContent = currentShadowProps.opacity.toFixed(2);
        if (shadowOffsetXValueDisplay) shadowOffsetXValueDisplay.textContent = currentShadowProps.offsetX;
        if (shadowOffsetYValueDisplay) shadowOffsetYValueDisplay.textContent = currentShadowProps.offsetY;
        if (shadowBlurValueDisplay) shadowBlurValueDisplay.textContent = currentShadowProps.blur;
    }

    // Initialize from slider defaults if they exist, otherwise use currentShadowProps defaults
    if (shadowOpacitySlider) currentShadowProps.opacity = parseFloat(shadowOpacitySlider.value);
    if (shadowOffsetXSlider) currentShadowProps.offsetX = parseInt(shadowOffsetXSlider.value);
    if (shadowOffsetYSlider) currentShadowProps.offsetY = parseInt(shadowOffsetYSlider.value);
    if (shadowBlurSlider) currentShadowProps.blur = parseInt(shadowBlurSlider.value);

    // Initial application
    updateShadowDisplayValues();
    applyBoxShadow();

    // Event Listeners
    if (shadowOpacitySlider) {
        shadowOpacitySlider.addEventListener('input', () => {
            currentShadowProps.opacity = parseFloat(shadowOpacitySlider.value);
            updateShadowDisplayValues();
            applyBoxShadow();
        });
    }
    if (shadowOffsetXSlider) {
        shadowOffsetXSlider.addEventListener('input', () => {
            currentShadowProps.offsetX = parseInt(shadowOffsetXSlider.value);
            updateShadowDisplayValues();
            applyBoxShadow();
        });
    }
    if (shadowOffsetYSlider) {
        shadowOffsetYSlider.addEventListener('input', () => {
            currentShadowProps.offsetY = parseInt(shadowOffsetYSlider.value);
            updateShadowDisplayValues();
            applyBoxShadow();
        });
    }
    if (shadowBlurSlider) {
        shadowBlurSlider.addEventListener('input', () => {
            currentShadowProps.blur = parseInt(shadowBlurSlider.value);
            updateShadowDisplayValues();
            applyBoxShadow();
        });
    }

    if (!shadowOpacitySlider || !shadowOffsetXSlider || !shadowOffsetYSlider || !shadowBlurSlider) {
        console.warn("One or more shadow control sliders not found.");
    }


    // --- Lighting Effects Logic ---
    const sceneBrightnessSlider = document.getElementById('sceneBrightnessSlider');
    const sceneBrightnessValueDisplay = document.getElementById('sceneBrightnessValueDisplay');
    const sceneBrightnessOverlay = document.getElementById('sceneBrightnessOverlay');

    const highlightOpacitySlider = document.getElementById('highlightOpacitySlider');
    const highlightOpacityValueDisplay = document.getElementById('highlightOpacityValueDisplay');

    const lightSourceAngleSlider = document.getElementById('lightSourceAngleSlider');
    const lightSourceAngleValueDisplay = document.getElementById('lightSourceAngleValueDisplay');
    const lightSourceDistanceSlider = document.getElementById('lightSourceDistanceSlider');
    const lightSourceDistanceValueDisplay = document.getElementById('lightSourceDistanceValueDisplay');

    let currentLightProps = {
        highlightOpacity: 0.5,
        sceneBrightness: 1.0, // 1.0 means no effect from overlay initially
        lightAngle: 45, // degrees
        lightDistance: 100 // abstract units
    };

    // Initialize from sliders
    if (sceneBrightnessSlider) currentLightProps.sceneBrightness = parseFloat(sceneBrightnessSlider.value);
    if (highlightOpacitySlider) currentLightProps.highlightOpacity = parseFloat(highlightOpacitySlider.value);
    if (lightSourceAngleSlider) currentLightProps.lightAngle = parseInt(lightSourceAngleSlider.value);
    if (lightSourceDistanceSlider) currentLightProps.lightDistance = parseInt(lightSourceDistanceSlider.value);


    function updateSceneBrightnessDisplay() {
        if (sceneBrightnessValueDisplay) sceneBrightnessValueDisplay.textContent = currentLightProps.sceneBrightness.toFixed(2);
    }
    function applySceneBrightness() {
        if (sceneBrightnessOverlay) {
            // If brightness > 1, overlay with white; if < 1, overlay with black
            let overlayOpacity = 0;
            let overlayColor = '0,0,0'; // Black
            if (currentLightProps.sceneBrightness < 1.0) {
                overlayOpacity = 1.0 - currentLightProps.sceneBrightness; // e.g., brightness 0.5 -> opacity 0.5 black
            } else if (currentLightProps.sceneBrightness > 1.0) {
                overlayColor = '255,255,255'; // White
                overlayOpacity = (currentLightProps.sceneBrightness - 1.0) / 1.0; // e.g., brightness 1.5 -> opacity 0.5 white (assuming max brightness is 2.0 for this scale)
                                                                            // Max slider is 1.5, so (1.5-1.0)/1.0 = 0.5
            }
            sceneBrightnessOverlay.style.backgroundColor = `rgba(${overlayColor}, ${overlayOpacity.toFixed(2)})`;
        }
        updateSceneBrightnessDisplay();
    }

    function updateHighlightDisplay() {
        if (highlightOpacityValueDisplay) highlightOpacityValueDisplay.textContent = currentLightProps.highlightOpacity.toFixed(2);
    }
    function applyHighlightAndLightSource() {
        // This function will also update shadows based on light source
        updateHighlightDisplay();
        if (lightSourceAngleValueDisplay) lightSourceAngleValueDisplay.textContent = currentLightProps.lightAngle;
        if (lightSourceDistanceValueDisplay) lightSourceDistanceValueDisplay.textContent = currentLightProps.lightDistance;

        // --- 1. Apply Highlight to Digit Faces ---
        const allDigitFaces = document.querySelectorAll('.digit-face');
        allDigitFaces.forEach(face => {
            // Simulate light direction for highlight. This is a very basic example.
            // For a more realistic effect, we'd need the face's normal vector in 3D space.
            // Here, we'll just create a generic gradient based on angle and opacity.
            const angleRad = currentLightProps.lightAngle * (Math.PI / 180);
            // Simple positional parameters for gradient based on angle (cos for x, sin for y)
            // These are percentages for gradient center
            const lightX = 50 + Math.cos(angleRad) * 30; // Vary from 20% to 80%
            const lightY = 50 + Math.sin(angleRad) * 30; // Vary from 20% to 80%

            face.style.backgroundImage = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,${currentLightProps.highlightOpacity}) 0%, rgba(255,255,255,0) 50%)`;
        });

        // --- 2. Update Shadow based on Light Source ---
        // Convert light angle and distance to an approximate shadow offset
        // This is a simplified model.
        const shadowAngleRad = currentLightProps.lightAngle * (Math.PI / 180) + Math.PI; // Shadow is opposite to light + 180 deg
        const baseShadowDistance = 10 + (currentLightProps.lightDistance / 20); // Scale distance effect

        currentShadowProps.offsetX = Math.round(Math.cos(shadowAngleRad) * baseShadowDistance);
        currentShadowProps.offsetY = Math.round(Math.sin(shadowAngleRad) * baseShadowDistance);
        // Opacity and Blur are still controlled by their own sliders, but could also be influenced by lightDistance if desired.

        // Re-apply the box shadow using the updated offsets
        applyBoxShadow(); // This function is from the shadow control logic
        updateShadowDisplayValues(); // Update display for shadow offsets
    }

    // Initial Applications
    applySceneBrightness();
    applyHighlightAndLightSource();


    // Event Listeners for Lighting
    if (sceneBrightnessSlider) {
        sceneBrightnessSlider.addEventListener('input', () => {
            currentLightProps.sceneBrightness = parseFloat(sceneBrightnessSlider.value);
            applySceneBrightness();
        });
    }
    if (highlightOpacitySlider) {
        highlightOpacitySlider.addEventListener('input', () => {
            currentLightProps.highlightOpacity = parseFloat(highlightOpacitySlider.value);
            applyHighlightAndLightSource(); // Re-apply to update highlight
        });
    }
    if (lightSourceAngleSlider) {
        lightSourceAngleSlider.addEventListener('input', () => {
            currentLightProps.lightAngle = parseInt(lightSourceAngleSlider.value);
            applyHighlightAndLightSource(); // Re-apply for both highlight and shadow
        });
    }
    if (lightSourceDistanceSlider) {
        lightSourceDistanceSlider.addEventListener('input', () => {
            currentLightProps.lightDistance = parseInt(lightSourceDistanceSlider.value);
            applyHighlightAndLightSource(); // Re-apply for both highlight and shadow
        });
    }

    if (!sceneBrightnessSlider || !highlightOpacitySlider || !lightSourceAngleSlider || !lightSourceDistanceSlider) {
        console.warn("One or more lighting control sliders not found.");
    }

});
