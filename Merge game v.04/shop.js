class Shop {
    constructor(inventory) {
        this.inventory = inventory;
        this.antimatter = CONFIG.INITIAL_ANTIMATTER; // Ujistěte se, že je správně inicializováno
        this.rebirthCount = 0; // Přidáno pro sledování počtu rebirthů
        this.rebirthCost = 10000; // Změněno na 10,000
        this.antimatterElement = document.querySelector('#antimatter-container #antimatter-count');
        this.buyButton = document.getElementById('buy-item');
        this.generateButton = document.getElementById('generate-item');
        this.autoCombineButton = document.getElementById('auto-combine');
        this.messageElement = document.createElement('div');
        this.messageElement.id = 'shop-message';
        document.body.appendChild(this.messageElement);
        this.setupEventListeners();
        this.updateRebirthInfo(); // Aktualizace při inicializaci
        this.createRebirthButton(); // Vytvoření tlačítka při inicializaci
    }

    setupEventListeners() {
        this.buyButton.addEventListener('click', () => this.buyItem());
        this.generateButton.addEventListener('click', () => this.startItemGeneration());
        this.autoCombineButton.addEventListener('click', () => this.autoCombineAll());
        const rebirthButton = document.getElementById('rebirth-button');
        if (rebirthButton) {
            rebirthButton.addEventListener('click', () => this.rebirth());
        }
    }

    buyItem() {
        if (this.antimatter >= CONFIG.ITEM_COST) {
            this.antimatter -= CONFIG.ITEM_COST;
            const newItem = generateRandomItem();
            this.inventory.addItem(newItem);
            this.updateAntimatterDisplay(); // Ujistěte se, že se volá po změně antimatter
            this.showMessage(`Zakoupen nový předmět: ${newItem.name}`);
        } else {
            this.showMessage('Nedostatek antimatter!', 'error');
        }
    }

    startItemGeneration() {
        this.generateButton.disabled = true;
        let timeLeft = CONFIG.GENERATION_TIME / 1000;
        const countdownInterval = setInterval(() => {
            this.generateButton.textContent = `Generování... (${timeLeft}s)`;
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                this.generateItem();
                this.generateButton.disabled = false;
                this.generateButton.textContent = 'Vygenerovat předmět (10s)';
            }
        }, 1000);
    }

    generateItem() {
        this.antimatter++;
        const newItem = generateRandomItem();
        this.inventory.addItem(newItem);
        this.updateAntimatterDisplay();
    }

    updateAntimatterDisplay() {
        if (!this.antimatterElement) return;
        
        const oldValue = parseInt(this.antimatterElement.textContent);
        const newValue = this.antimatter;
        
        // Aktualizace hodnoty
        this.antimatterElement.textContent = newValue;
        
        // Přidání efektu při změně
        const container = document.getElementById('antimatter-container');
        if (container) {
            container.classList.add('antimatter-increase');
            setTimeout(() => container.classList.remove('antimatter-increase'), 500);
            
            // Přidání particle efektu
            if (newValue > oldValue) {
                this.createAntimatterParticles(container, '+' + (newValue - oldValue));
            }
        }
    }
    
    createAntimatterParticles(container, value) {
        if (!container) return;  // Kontrola existence containeru
        
        const particle = document.createElement('div');
        particle.className = 'antimatter-particle';
        particle.textContent = value;
        particle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
        particle.style.setProperty('--y', `-${Math.random() * 50 + 50}px`);
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }

    autoCombineAll() {
        const autoCombineCost = 50;
        if (this.antimatter >= autoCombineCost) {
            this.antimatter -= autoCombineCost;
            
            // Opakujeme kombinování, dokud jsou možné kombinace
            let totalCombinations = 0;
            let combinationsInRound;
            do {
                combinationsInRound = this.inventory.autoCombineAll();
                totalCombinations += combinationsInRound;
            } while (combinationsInRound > 0);

            this.updateAntimatterDisplay();
            this.showMessage(`Automaticky spojeno ${totalCombinations} předmětů!`);
        } else {
            this.showMessage('Nedostatek antimatter! Potřebujete 50 antimatter pro automatické spojení.', 'error');
        }
    }

    showMessage(message, type = 'info') {
        console.log('Showing message:', message); // Pro debugging
        
        // Odstranění existujících zpráv stejného typu
        const existingMessages = document.querySelectorAll(`.message.${type}`);
        existingMessages.forEach(msg => msg.remove());
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        // Animace
        messageElement.style.animation = 'slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s';
        
        setTimeout(() => {
            if (messageElement && messageElement.parentNode) {
                messageElement.remove();
            }
        }, 3000);
    }

    rebirth() {
        if (this.antimatter >= this.rebirthCost) {
            this.antimatter = 0;
            this.inventory.clearInventory();
            this.rebirthCount++;
            this.rebirthCost = Math.ceil(this.rebirthCost * 1.2);
            this.inventory.increaseWeaponPower(0.03); // Zvyšuje sílu zbraní o 3% za každý rebirth
            this.updateAntimatterDisplay();
            this.updateRebirthInfo(); // Aktualizace po rebirthu
            this.showMessage(`Rebirth úspěšný! Všechny zbraně jsou nyní o 3% silnější.`);
            const playerStats = JSON.parse(localStorage.getItem('playerStats') || '{}');
            playerStats[this.playerName] = playerStats[this.playerName] || {};
            playerStats[this.playerName].rebirths = (playerStats[this.playerName].rebirths || 0) + 1;
            localStorage.setItem('playerStats', JSON.stringify(playerStats));
        } else {
            this.showMessage(`Nedostatek antimatter! Potřebujete ${this.rebirthCost} antimatter pro rebirth.`, 'error');
        }
    }

    updateRebirthInfo() {
        const rebirthCountElement = document.getElementById('rebirth-count');
        const weaponBonusElement = document.getElementById('weapon-bonus');
        const rebirthButton = document.getElementById('rebirth-button');
        if (rebirthCountElement && weaponBonusElement && rebirthButton) {
            rebirthCountElement.textContent = this.rebirthCount;
            weaponBonusElement.textContent = `${(this.rebirthCount * 3).toFixed(1)}%`;
            rebirthButton.textContent = `Rebirth (${this.rebirthCost} AM)`;
        }
    }

    createRebirthButton() {
        const equipmentDiv = document.querySelector('#equipment');
        if (equipmentDiv) {
            const rebirthButton = document.createElement('button');
            rebirthButton.id = 'rebirth-button';
            rebirthButton.title = 'Rebirth';
            rebirthButton.textContent = `Rebirth (${this.rebirthCost} AM)`;
            rebirthButton.style.backgroundColor = '#ff5722';
            rebirthButton.style.marginTop = '10px';
            rebirthButton.addEventListener('click', () => this.rebirth());
            equipmentDiv.appendChild(rebirthButton);
        }
    }
}
