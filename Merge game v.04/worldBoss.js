class WorldBoss {
    constructor(inventory) {
        this.inventory = inventory;
        this.boss = null;
        this.setupEventListeners();
    }

    generateRandomBoss(isElite = false) {
        const names = isElite ? ['Zarok', 'Valthor', 'Kragor', 'Xenith', 'Thalor'] : ['Gorath', 'Zulrok', 'Morgath', 'Xylar', 'Thalor'];
        const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
        const colors = {
            'Common': '#a5a5a5',
            'Rare': '#5555ff',
            'Epic': '#aa00ff',
            'Legendary': '#ffaa00'
        };
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
        const randomColor = colors[randomRarity];

        // Získání počtu rebirthů z instance shopu
        const rebirthMultiplier = Math.pow(1.15, shop.rebirthCount); // Každý rebirth přidá 15% k HP

        const baseHealth = isElite ? Math.floor(Math.random() * 3000) + 2000 : Math.floor(Math.random() * 1500) + 1000;
        const health = Math.floor(baseHealth * rebirthMultiplier);
        const attack = isElite ? Math.floor(Math.random() * 150) + 75 : Math.floor(Math.random() * 75) + 50;

        return {
            name: randomName,
            health: health,
            maxHealth: health,
            attack: attack,
            color: randomColor,
            rarity: randomRarity,
            isElite: isElite
        };
    }

    setupEventListeners() {
        const fightNormalBossButton = document.getElementById('fight-normal-boss');
        const fightEliteBossButton = document.getElementById('fight-elite-boss');

        if (fightNormalBossButton && fightEliteBossButton) {
            fightNormalBossButton.addEventListener('click', () => this.openBossFight(false));
            fightEliteBossButton.addEventListener('click', () => this.openBossFight(true));
        }
    }

    openBossFight(isElite) {
        if (!this.boss || this.boss.isElite !== isElite) {
            this.boss = this.generateRandomBoss(isElite);
        }

        const playerWeapon = this.inventory.equippedWeapon;
        if (!playerWeapon) {
            console.log('Nemáte vybavenou zbraň!');
            return;
        }

        const popup = document.createElement('div');
        popup.className = 'boss-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h2 style="color: ${this.boss.color};">${this.boss.rarity} ${isElite ? 'Elitní Boss' : 'Normální Boss'}: ${this.boss.name}</h2>
                <div class="health-bar">
                    <div class="health-bar-inner" id="health-bar-inner" style="width: ${(this.boss.health / this.boss.maxHealth) * 100}%;"></div>
                    <span id="health-text">${this.boss.health} / ${this.boss.maxHealth}</span>
                </div>
                <p>Vaše poškození: <span id="damage-dealt">0</span></p>
                <div id="boss-image" class="boss-image ${this.boss.isElite ? 'elite' : ''}" style="background: linear-gradient(135deg, ${this.boss.color}, #ff7f00);"></div>
                <button id="close-popup">Zavřít</button>
            </div>
        `;
        document.body.appendChild(popup);

        const bossImage = document.getElementById('boss-image');
        const closePopupButton = document.getElementById('close-popup');

        if (bossImage && closePopupButton) {
            bossImage.addEventListener('click', (event) => {
                this.attackBoss(playerWeapon.power, playerWeapon.rarity.color, event);
            });

            closePopupButton.addEventListener('click', () => {
                popup.remove();
            });
        }
    }

    attackBoss(damage, color, event) {
        if (!this.boss) return;

        this.boss.health -= damage;
        if (this.boss.health < 0) this.boss.health = 0;

        const healthBarInner = document.getElementById('health-bar-inner');
        const healthText = document.getElementById('health-text');
        const healthPercentage = (this.boss.health / this.boss.maxHealth) * 100;

        if (healthBarInner && healthText) {
            healthBarInner.style.width = `${healthPercentage}%`;
            healthText.textContent = `${this.boss.health} / ${this.boss.maxHealth}`;
        }

        document.getElementById('damage-dealt').textContent = damage;

        this.createParticles(event.clientX, event.clientY, color);

        const bossImage = document.getElementById('boss-image');
        if (bossImage) {
            bossImage.classList.add('shake');
            setTimeout(() => bossImage.classList.remove('shake'), 300);
        }

        if (this.boss.health <= 0) {
            this.bossDefeated();
        }
    }

    createParticles(x, y, color) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = color;
            particle.style.position = 'absolute';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 50;
            const translateX = Math.cos(angle) * distance;
            const translateY = Math.sin(angle) * distance;

            particle.style.setProperty('--x', `${translateX}px`);
            particle.style.setProperty('--y', `${translateY}px`);

            fragment.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
        document.body.appendChild(fragment);
    }

    bossDefeated() {
        const baseReward = this.boss.isElite ? 200 : 100;
        const rebirthMultiplier = Math.pow(1.25, shop.rebirthCount);
        const totalReward = Math.round(baseReward * rebirthMultiplier);

        // Přidání odměny k antimatter
        shop.antimatter += totalReward;
        shop.updateAntimatterDisplay();

        alert(`Boss poražen! Získáváte odměnu ${totalReward} antimatter.`);
        this.boss = null;
        const bossPopup = document.querySelector('.boss-popup');
        if (bossPopup) bossPopup.remove();

        setTimeout(() => {
            alert('Můžete vyvolat dalšího bosse!');
        }, 5 * 60 * 1000);
    }
}
