document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-item');
    const cooldownElement = generateButton.querySelector('.cooldown');
    let isGenerating = false;

    generateButton.addEventListener('click', () => {
        if (!isGenerating) {
            isGenerating = true;
            generateButton.disabled = true;
            let progress = 0;
            const interval = setInterval(() => {
                progress += 1;
                cooldownElement.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(interval);
                    isGenerating = false;
                    generateButton.disabled = false;
                    cooldownElement.style.width = '0%';
                    // Zde zavolejte funkci pro generování předmětu
                    // generateItem();
                }
            }, 100); // 10 sekund celkem, aktualizace každých 100ms
        }
    });
});
