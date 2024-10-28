class GameStats {
    constructor() {
        // Nastavíme instanci jako globální proměnnou
        window.gameStats = this;
        
        this.stats = this.loadStats();
        this.updateStatsDisplay();
        console.log('GameStats initialized with:', this.stats);
    }

    loadStats() {
        const savedStats = localStorage.getItem('gameStats');
        const stats = savedStats ? JSON.parse(savedStats) : {
            totalItemsCombined: 0
        };
        console.log('Loaded stats:', stats);
        return stats;
    }

    saveStats() {
        localStorage.setItem('gameStats', JSON.stringify(this.stats));
        console.log('Saved stats:', this.stats);
    }

    incrementCombinedItems() {
        console.log('Incrementing combined items'); // Debug log
        this.stats.totalItemsCombined++;
        this.saveStats();
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const statsElement = document.getElementById('stats-counter');
        if (statsElement) {
            statsElement.textContent = this.stats.totalItemsCombined;
            console.log('Updated display:', this.stats.totalItemsCombined);
        } else {
            console.warn('Stats counter element not found');
        }
    }

    getTotalItemsCombined() {
        return this.stats.totalItemsCombined;
    }

    // Metoda pro ruční reset statistik (pro testování)
    resetStats() {
        this.stats = {
            totalItemsCombined: 0
        };
        this.saveStats();
        this.updateStatsDisplay();
        console.log('Stats reset');
    }
}
