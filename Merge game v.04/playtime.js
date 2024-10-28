class PlayTime {
    constructor() {
        this.startTime = this.loadStartTime();
        this.timeElement = document.getElementById('time-count');
        this.updateInterval = setInterval(() => this.updatePlayTime(), 1000);
    }

    loadStartTime() {
        const savedTime = localStorage.getItem('gameStartTime');
        if (!savedTime) {
            const currentTime = new Date().getTime();
            localStorage.setItem('gameStartTime', currentTime);
            return currentTime;
        }
        return parseInt(savedTime);
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    updatePlayTime() {
        const currentTime = new Date().getTime();
        const playTime = currentTime - this.startTime;
        if (this.timeElement) {
            this.timeElement.textContent = this.formatTime(playTime);
        }
    }

    getPlayTimeInSeconds() {
        return Math.floor((new Date().getTime() - this.startTime) / 1000);
    }
}
