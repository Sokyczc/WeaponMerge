class Leaderboard {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const leaderboardButton = document.getElementById('leaderboard-button');
        if (leaderboardButton) {
            leaderboardButton.addEventListener('click', () => this.openLeaderboard());
        }
    }

    getPlayerStats() {
        return JSON.parse(localStorage.getItem('playerStats') || '{}');
    }

    generateLeaderboardHTML() {
        const playerStats = this.getPlayerStats();
        const entries = Object.entries(playerStats)
            .map(([name, stats]) => ({
                name,
                rebirths: stats.rebirths || 0
            }))
            .sort((a, b) => b.rebirths - a.rebirths);

        if (entries.length === 0) {
            return '<div class="leaderboard-entry">Zatím žádné záznamy</div>';
        }

        return entries.map((entry, index) => `
            <div class="leaderboard-entry" style="background-color: ${index % 2 === 0 ? '#f0f0f0' : '#e0e0e0'}; padding: 10px; border-radius: 5px; margin-bottom: 5px;">
                <div class="rank" style="font-weight: bold; color: #4A90E2;">#${index}</div>
                <div class="name" style="color: #333;">${this.escapeHtml(entry.name)}</div>
                <div class="rebirth-count" style="color: #FF5722;">Rebirths: ${entry.rebirths}</div>
            </div>
        `).join('');
    }

    openLeaderboard() {
        const width = 800;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const leaderboardWindow = window.open('', 'Žebříček', 
            `width=${width},height=${height},left=${left},top=${top}`);

        leaderboardWindow.document.write(`
            <!DOCTYPE html>
            <html lang="cs">
            <head>
                <meta charset="UTF-8">
                <title>Žebříček Rebirthů</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #1a1a1a;
                        color: white;
                        margin: 0;
                        padding: 20px;
                    }
                    .leaderboard-container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: #2a2a2a;
                        border-radius: 10px;
                        padding: 20px;
                    }
                    .leaderboard-entry {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        border-bottom: 1px solid #444;
                    }
                    .rank {
                        font-weight: bold;
                        color: #ffd700;
                    }
                    .name {
                        color: #4CAF50;
                    }
                    .rebirth-count {
                        color: #FF5722;
                    }
                </style>
            </head>
            <body>
                <div class="leaderboard-container">
                    <h1 style="text-align: center; color: #ffd700;">🏆 Žebříček Rebirthů</h1>
                    ${this.generateLeaderboardHTML()}
                </div>
            </body>
            </html>
        `);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
