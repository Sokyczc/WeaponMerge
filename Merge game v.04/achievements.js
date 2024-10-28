class Achievements {
    constructor(inventory, shop) {
        this.inventory = inventory;
        this.shop = shop;
        this.achievements = [
            { id: 'firstLegendary', name: 'První Legendární', description: 'Získejte první legendární předmět', completed: false, reward: 100 },
            { id: 'collector', name: 'Sběratel', description: 'Vlastněte 20 předmětů najednou', completed: false, reward: 50 },
            { id: 'masterCrafter', name: 'Mistr Řemeslník', description: 'Zkombinujte 50 předmětů', completed: false, reward: 200 },
            { id: 'bossSlayer', name: 'Zabiják Bossů', description: 'Porazte 5 bossů', completed: false, reward: 300 },
            { id: 'richMerchant', name: 'Bohatý Obchodník', description: 'Získejte 1000 antimatter', completed: false, reward: 500 },
            { 
                id: 'dedicated', 
                name: 'Věrný Hráč', 
                description: 'Hrajte hru po dobu 1 hodiny', 
                completed: false, 
                reward: 150 
            }
        ];
        
        this.stats = {
            legendaryFound: 0,
            itemsCombined: 0,  // Toto je důležité pro žebříček
            bossesDefeated: 0,
            rebirths: 0
        };

        this.createAchievementsUI();
        this.setupEventListeners();
        this.loadAchievements();

        // Přidáme kontrolu herního času
        setInterval(() => {
            if (playTime && playTime.getPlayTimeInSeconds() >= 3600 && // 1 hodina
                !this.achievements.find(a => a.id === 'dedicated').completed) {
                this.completeAchievement(this.achievements.find(a => a.id === 'dedicated'));
            }
        }, 60000); // Kontrola každou minutu

        // Přidáme event listener pro kombinování předmětů
        document.addEventListener('itemCombined', () => {
            this.stats.itemsCombined++;
            console.log('Items combined:', this.stats.itemsCombined);
        });
    }

    createAchievementsUI() {
        const aside = document.querySelector('aside');
        if (!aside) return;

        const achievementsSection = document.createElement('section');
        achievementsSection.id = 'achievements';
        achievementsSection.innerHTML = `
            <h2>Úspěchy</h2>
            <div class="achievements-list"></div>
        `;
        
        aside.appendChild(achievementsSection);
        this.updateAchievementsUI();
    }

    setupEventListeners() {
        // Sledování kombinování předmětů
        document.addEventListener('itemCombined', (e) => {
            console.log('Items combined event triggered');
            this.stats.itemsCombined++;
            this.checkAchievements();
        });

        // Sledování poražení bossů
        document.addEventListener('bossDefeated', (e) => {
            console.log('Boss defeated event triggered');
            this.stats.bossesDefeated++;
            this.checkAchievements();
        });

        // Sledování legendárních předmětů
        document.addEventListener('legendaryFound', (e) => {
            console.log('Legendary item found event triggered');
            this.stats.legendaryFound++;
            this.checkAchievements();
        });

        // Sledování počtu předmětů v inventáři
        const observer = new MutationObserver(() => {
            this.checkAchievements();
        });
        observer.observe(this.inventory.element, { childList: true, subtree: true });

        // Sledování množství antimatter
        const originalUpdateAntimatterDisplay = this.shop.updateAntimatterDisplay;
        this.shop.updateAntimatterDisplay = () => {
            originalUpdateAntimatterDisplay.call(this.shop);
            this.checkAchievements();
        };
    }

    checkAchievements() {
        console.log('Checking achievements...');
        console.log('Current stats:', {
            inventorySize: this.inventory.items.length,
            itemsCombined: this.stats.itemsCombined,
            bossesDefeated: this.stats.bossesDefeated,
            antimatter: this.shop.antimatter,
            legendaryFound: this.stats.legendaryFound
        });

        this.achievements.forEach(achievement => {
            if (!achievement.completed) {
                switch (achievement.id) {
                    case 'firstLegendary':
                        if (this.stats.legendaryFound > 0) {
                            console.log('Completing firstLegendary achievement');
                            this.completeAchievement(achievement);
                        }
                        break;
                    case 'collector':
                        if (this.inventory.items.length >= 20) {
                            console.log('Completing collector achievement');
                            this.completeAchievement(achievement);
                        }
                        break;
                    case 'masterCrafter':
                        if (this.stats.itemsCombined >= 50) {
                            console.log('Completing masterCrafter achievement');
                            this.completeAchievement(achievement);
                        }
                        break;
                    case 'bossSlayer':
                        if (this.stats.bossesDefeated >= 5) {
                            console.log('Completing bossSlayer achievement');
                            this.completeAchievement(achievement);
                        }
                        break;
                    case 'richMerchant':
                        if (this.shop.antimatter >= 1000) {
                            console.log('Completing richMerchant achievement');
                            this.completeAchievement(achievement);
                        }
                        break;
                }
            }
        });
    }

    completeAchievement(achievement) {
        if (!achievement.completed) {
            console.log(`Completing achievement: ${achievement.name}`);
            achievement.completed = true;
            this.shop.antimatter += achievement.reward;
            this.shop.updateAntimatterDisplay();
            this.showAchievementNotification(achievement);
            this.updateAchievementsUI();
            
            // Uložení stavu achievementu
            this.saveAchievements();
        }
    }

    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify({
            achievements: this.achievements,
            stats: this.stats
        }));
    }

    loadAchievements() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            const data = JSON.parse(saved);
            this.achievements = data.achievements;
            this.stats = data.stats;
            this.stats.rebirths = data.stats.rebirths || 0; // Přidat počet rebirthů
            this.updateAchievementsUI();
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <h3>Úspěch odemčen!</h3>
            <p>${achievement.name}</p>
            <span>+${achievement.reward} AM</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateAchievementsUI() {
        const achievementsList = document.querySelector('.achievements-list');
        if (achievementsList) {
            achievementsList.innerHTML = this.achievements.map(achievement => `
                <div class="achievement ${achievement.completed ? 'completed' : ''}">
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                    <span class="reward">Odměna: ${achievement.reward} AM</span>
                </div>
            `).join('');
        }
    }
}
