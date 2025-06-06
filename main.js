document.addEventListener('DOMContentLoaded', () => {
    const digitWheels = document.querySelectorAll('.digit-wheel');
    // const currentCount = [0, 0, 0, 0, 0, 0]; // Array to keep track of current digits - Not used in the provided JS, globalCount is used.

    // Funzione per aggiornare una singola ruota con animazione 3D
    function updateDigitWheel(wheelElement, newValue) {
        // Calcola l'angolo di rotazione necessario
        // Ogni cifra rappresenta una rotazione di 36 gradi (360 gradi / 10 cifre)
        const rotationAngle = newValue * 36;
        wheelElement.style.transform = `rotateX(-${rotationAngle}deg)`; // Ruota sull'asse X

        // Add and remove 'rolling' class for potential animation styling
        wheelElement.classList.add('rolling');
        setTimeout(() => {
            wheelElement.classList.remove('rolling');
        }, 600); // Should match CSS transition duration
    }

    // Funzione principale per aggiornare tutte le cifre del contatore
    function updateCounterDisplay(newCount) {
        const countString = String(newCount).padStart(6, '0'); // Assicura 6 cifre

        for (let i = 0; i < digitWheels.length; i++) {
            const digit = parseInt(countString[i]);
            updateDigitWheel(digitWheels[i], digit);
        }
    }

    // Inizializza il contagiri a 000000
    updateCounterDisplay(0);

    let globalCount = 0; // Contatore globale

    // Imposta l'intervallo per incrementare il contatore
    setInterval(() => {
        globalCount++;
        if (globalCount > 999999) {
            globalCount = 0; // Reset after 999999
        }
        updateCounterDisplay(globalCount);
    }, 1000); // 1000ms = 1 secondo. Cambia a 60000ms per "ogni minuto"
});
