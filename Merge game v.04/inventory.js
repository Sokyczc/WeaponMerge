class Inventory {
    constructor() {
        this.items = [];
        this.equippedWeapon = null;
        this.upgradeWeapon = null;
        this.element = document.getElementById('item-grid');
        this.weaponSlot = document.getElementById('weapon-slot');
        this.upgradeSlot = document.getElementById('upgrade-slot');
        this.attackValueElement = document.getElementById('attack-value');
        this.upgradeProgressBar = document.getElementById('upgrade-bar');
        this.upgradeProgress = 0;
        this.sellDropZone = document.getElementById('sell-drop-zone');
        
        // Odstraníme automatický interval pro vylepšování
        // this.upgradeInterval = setInterval(() => {
        //     if (this.upgradeWeapon) {
        //         this.upgradeProgress += 10;
        //         this.updateUpgradeProgress();
        //         if (this.upgradeProgress >= 100) {
        //             this.upgradeWeaponRarity();
        //         }
        //     }
        // }, 1000);
        
        this.setupEventListeners();
        this.setupNewButtons();
    }

    setupEventListeners() {
        this.element.addEventListener('dragover', this.onDragOver.bind(this));
        this.element.addEventListener('drop', this.onDrop.bind(this));
        if (this.sellDropZone) { // Přidána kontrola
            this.sellDropZone.addEventListener('dragover', this.onDragOver.bind(this));
            this.sellDropZone.addEventListener('dragleave', this.onDragLeave.bind(this));
            this.sellDropZone.addEventListener('drop', this.onSellDrop.bind(this));
        }
        this.upgradeSlot.addEventListener('dragover', this.onDragOver.bind(this));
        this.upgradeSlot.addEventListener('drop', this.onUpgradeDrop.bind(this));
        this.upgradeSlot.addEventListener('click', this.onUpgradeSlotClick.bind(this));
        this.weaponSlot.addEventListener('click', this.onWeaponSlotClick.bind(this));

        // Oprava handleru pro drop na prodejní zónu
        const sellDropZone = document.getElementById('sell-drop-zone');
        sellDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const itemId = e.dataTransfer.getData('text/plain');
            const item = this.items.find(i => i.id === itemId);
            
            if (item) {
                // Nejdřív odstraníme předmět z inventáře
                this.items = this.items.filter(i => i.id !== itemId);
                
                // Pak přidáme antimatter
                const sellValue = Math.ceil(item.power * CONFIG.SELL_MULTIPLIER);
                shop.antimatter += sellValue;
                shop.updateAntimatterDisplay();
                shop.showMessage(`Prodáno za ${sellValue} antimatter!`);
                
                // Nakonec překreslíme inventář
                this.renderInventory();
                
                // Odstraníme třídu drag-over
                sellDropZone.classList.remove('drag-over');
            }
        });

        sellDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            sellDropZone.classList.add('drag-over');
        });

        sellDropZone.addEventListener('dragleave', () => {
            sellDropZone.classList.remove('drag-over');
        });
    }

    renderInventory() {
        console.log('Vykreslování inventáře, počet předmětů:', this.items.length);
        this.element.innerHTML = '';
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            console.log('Vykreslování předmětu:', item);
            const itemElement = item.render();
            itemElement.draggable = true;
            itemElement.dataset.index = i;
            itemElement.addEventListener('dragstart', (e) => this.onDragStart(e, i));
            itemElement.addEventListener('click', () => this.equipWeapon(item));
            this.element.appendChild(itemElement);
        }
        this.renderEquippedWeapon();
        this.updateAttackValue();
    }

    onDragStart(e, index) {
        e.dataTransfer.setData('text/plain', index);
    }

    onDragOver(e) {
        e.preventDefault();
        if (e.target === this.sellDropZone) {
            this.sellDropZone.classList.add('drag-over');
        }
    }

    onDragLeave(e) {
        if (e.target === this.sellDropZone) {
            this.sellDropZone.classList.remove('drag-over');
        }
    }

    onDrop(e) {
        e.preventDefault();
        const sourceIndex = e.dataTransfer.getData('text/plain');
        const sourceItem = this.items[sourceIndex];
        const targetElement = e.target.closest('.item');
        
        if (targetElement) {
            const targetIndex = Array.from(this.element.children).indexOf(targetElement);
            const targetItem = this.items[targetIndex];
            if (sourceItem !== targetItem) {
                const newItem = combineItems(sourceItem, targetItem);
                this.removeItem(sourceItem);
                this.removeItem(targetItem);
                this.addItem(newItem);
                this.renderInventory();
                shop.showMessage(`Vytvořena nová zbraň: ${newItem.name} (Síla: ${newItem.power})`);
            }
        }
    }

    onSellDrop(e) {
        e.preventDefault();
        this.sellDropZone.classList.remove('drag-over');
        const itemIndex = e.dataTransfer.getData('text/plain');
        const item = this.items[itemIndex];
        if (item) {
            this.sellItem(item);
        }
    }

    sellItem(item) {
        const sellValue = Math.floor(item.power * 0.5); // Prodejní cena je polovina síly zbraně
        shop.antimatter += sellValue;
        shop.updateAntimatterDisplay();
        this.removeItem(item);
        this.renderInventory(); // Přidáno pro aktualizaci inventáře po prodeji
        this.showSellAnimation(sellValue);
    }

    removeItem(item) {
        this.items = this.items.filter(i => i !== item);
        this.renderInventory();
        
        // Přidání animace pro odstranění předmětu
        const itemElement = this.element.querySelector(`[data-index="${this.items.indexOf(item)}"]`);
        if (itemElement) {
            itemElement.classList.add('item-removed');
            setTimeout(() => {
                itemElement.remove();
                this.renderInventory();
            }, 500);
        }
    }

    showSellAnimation(value) {
        const animationElement = document.createElement('div');
        animationElement.textContent = `+${value} antimatter`;
        animationElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            color: #4CAF50;
            opacity: 0;
            transition: all 1s ease-out;
            z-index: 1000;
        `;
        document.body.appendChild(animationElement);

        setTimeout(() => {
            animationElement.style.opacity = '1';
            animationElement.style.transform = 'translate(-50%, -100%)';
        }, 50);

        setTimeout(() => {
            animationElement.style.opacity = '0';
        }, 1000);

        setTimeout(() => {
            animationElement.remove();
        }, 2000);
    }

    equipWeapon(item) {
        if (this.equippedWeapon) {
            this.addItem(this.equippedWeapon);
        }
        this.equippedWeapon = item;
        this.removeItem(item);
        this.renderEquippedWeapon();
        this.updateAttackValue();
        this.showMessage(`Zbraň ${item.name} byla vybavena.`);
    }

    renderEquippedWeapon() {
        this.weaponSlot.innerHTML = '';
        if (this.equippedWeapon) {
            const weaponElement = this.equippedWeapon.render();
            weaponElement.title = "Klikněte pro vrácení do inventáře";
            this.weaponSlot.appendChild(weaponElement);
        } else {
            const placeholderText = document.createElement('p');
            placeholderText.textContent = 'Zbraň';
            this.weaponSlot.appendChild(placeholderText);
        }
    }

    updateAttackValue() {
        const attackValue = this.equippedWeapon ? this.equippedWeapon.power : 0;
        this.attackValueElement.textContent = attackValue;
    }

    combineItems(item1, item2) {
        if (item1.type === item2.type && item1.rarity === item2.rarity) {
            const newRarityIndex = CONFIG.RARITIES.indexOf(item1.rarity) + 1;
            if (newRarityIndex < CONFIG.RARITIES.length) {
                // Vytvoření nového předmětu
                const newItem = new Item(
                    item1.type,
                    CONFIG.RARITIES[newRarityIndex],
                    CONFIG.ATTRIBUTES[Math.floor(Math.random() * CONFIG.ATTRIBUTES.length)]
                );
                
                // Odstranění původních předmětů
                this.removeItem(item1);
                this.removeItem(item2);
                
                // Přidání nového předmětu
                this.addItem(newItem);
                
                return true;
            }
        }
        return false;
    }

    showCombineAnimation(newItem) {
        const animationElement = document.createElement('div');
        animationElement.className = 'combine-animation';
        animationElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: ${newItem.rarity.color};
            border-radius: 50%;
            width: 0;
            height: 0;
            opacity: 0;
            z-index: 1000;
            transition: all 0.5s ease-out;
        `;
        document.body.appendChild(animationElement);

        setTimeout(() => {
            animationElement.style.width = '300px';
            animationElement.style.height = '300px';
            animationElement.style.opacity = '0.8';
        }, 50);

        setTimeout(() => {
            animationElement.style.width = '0';
            animationElement.style.height = '0';
            animationElement.style.opacity = '0';
        }, 500);

        setTimeout(() => {
            animationElement.remove();
            alert(`Vytvořili jste novou zbraň: ${newItem.name} (Síla: ${newItem.power})`);
        }, 1000);
    }

    getUpgradedRarity(rarity1, rarity2) {
        const maxRarityIndex = Math.max(
            CONFIG.RARITIES.indexOf(rarity1),
            CONFIG.RARITIES.indexOf(rarity2)
        );
        return CONFIG.RARITIES[Math.min(maxRarityIndex + 1, CONFIG.RARITIES.length - 1)];
    }

    addItem(item) {
        this.items.push(item);
        this.renderInventory();
        
        // Přidání animace pro nový předmět
        const newItemElement = this.element.lastElementChild;
        if (newItemElement) {
            newItemElement.classList.add('item-added');
            setTimeout(() => newItemElement.classList.remove('item-added'), 500);
        }
    }

    autoCombineAll() {
        let combinationsCount = 0;
        let keepCombining = true;

        while (keepCombining && this.items.length >= 2) {
            keepCombining = false;

            // Seřadíme předměty podle rarity
            this.items.sort((a, b) => {
                return CONFIG.RARITIES.indexOf(a.rarity) - CONFIG.RARITIES.indexOf(b.rarity);
            });

            // Procházíme předměty a hledáme páry stejné rarity
            for (let i = 0; i < this.items.length - 1; i++) {
                const item1 = this.items[i];
                const item2 = this.items[i + 1];

                if (item1 && item2 && item1.rarity === item2.rarity) {
                    // Vytvoření nového předmětu s vyšší raritou
                    const currentRarityIndex = CONFIG.RARITIES.indexOf(item1.rarity);
                    const newRarityIndex = Math.min(currentRarityIndex + 1, CONFIG.RARITIES.length - 1);

                    // Vytvoření nového předmětu
                    const newItem = new Item(
                        CONFIG.ITEM_TYPES[Math.floor(Math.random() * CONFIG.ITEM_TYPES.length)],
                        CONFIG.RARITIES[newRarityIndex],
                        CONFIG.ATTRIBUTES[Math.floor(Math.random() * CONFIG.ATTRIBUTES.length)]
                    );

                    // Odstranění původních předmětů a přidání nového
                    this.removeItem(item1);
                    this.removeItem(item2);
                    this.addItem(newItem);

                    combinationsCount++;
                    keepCombining = true;
                    i--; // Vrátíme se o jeden krok zpět, abychom mohli zkontrolovat nově vytvořený předmět
                }
            }
        }

        if (combinationsCount > 0) {
            this.renderInventory();
            console.log(`Provedeno ${combinationsCount} kombinací`);
        }
        
        return combinationsCount;
    }

    onUpgradeDrop(e) {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const droppedItem = this.items[sourceIndex];

        if (!droppedItem) return;

        if (this.upgradeWeapon) {
            // Vypočítáme progress na základě rarit
            const upgradeRarityIndex = CONFIG.RARITIES.indexOf(this.upgradeWeapon.rarity);
            const droppedRarityIndex = CONFIG.RARITIES.indexOf(droppedItem.rarity);
            
            // Základní progress je 25%
            let progressToAdd = 25;

            // Upravíme progress podle rozdílu rarit
            if (droppedRarityIndex < upgradeRarityIndex) {
                // Snížíme progress pro nižší rarity
                const rarityDifference = upgradeRarityIndex - droppedRarityIndex;
                progressToAdd = Math.max(5, progressToAdd - (rarityDifference * 5));
            } else if (droppedRarityIndex > upgradeRarityIndex) {
                // Zvýšíme progress pro vyšší rarity
                const rarityDifference = droppedRarityIndex - upgradeRarityIndex;
                progressToAdd = Math.min(50, progressToAdd + (rarityDifference * 5));
            }

            this.upgradeProgress += progressToAdd;
            this.removeItem(droppedItem);
            this.updateUpgradeProgress();

            // Zobrazíme zprávu o přidaném progressu
            shop.showMessage(`Přidáno ${progressToAdd}% k vylepšení`);

            if (this.upgradeProgress >= 100) {
                this.upgradeWeaponRarity();
            }
        } else {
            // Vložení první zbraně do upgrade slotu
            this.upgradeWeapon = droppedItem;
            this.removeItem(droppedItem);
            this.upgradeProgress = 0;
            this.updateUpgradeProgress();
        }

        this.renderUpgradeWeapon();
        this.renderInventory();
        this.updateUpgradeAllButtonState();
    }

    setUpgradeWeapon(item) {
        this.upgradeWeapon = item;
        this.removeItem(item);
        this.renderUpgradeWeapon();
        this.upgradeProgress = 0;
        this.updateUpgradeProgress();
    }

    addItemToUpgrade(item) {
        if (this.upgradeWeapon) {
            const progressIncrease = item.power / this.upgradeWeapon.power * 100;
            this.upgradeProgress += progressIncrease;
            this.removeItem(item);
            this.updateUpgradeProgress();

            if (this.upgradeProgress >= 100) {
                this.upgradeWeaponRarity();
            }
        }
    }

    upgradeWeaponRarity() {
        const currentRarityIndex = CONFIG.RARITIES.indexOf(this.upgradeWeapon.rarity);
        if (currentRarityIndex < CONFIG.RARITIES.length - 1) {
            let newRarityIndex;
            const randomValue = Math.random();
            
            if (randomValue < 0.7) {
                // 70% šance na zvýšení rarity o 1
                newRarityIndex = currentRarityIndex + 1;
            } else if (randomValue < 0.9) {
                // 20% šance na zvýšení rarity o 2
                newRarityIndex = Math.min(currentRarityIndex + 2, CONFIG.RARITIES.length - 1);
            } else {
                // 10% šance na zvýšení rarity o 3
                newRarityIndex = Math.min(currentRarityIndex + 3, CONFIG.RARITIES.length - 1);
            }

            const newRarity = CONFIG.RARITIES[newRarityIndex];
            this.upgradeWeapon.rarity = newRarity;
            this.upgradeWeapon.power = Math.floor(Math.random() * (newRarity.maxPower - newRarity.minPower + 1)) + newRarity.minPower;
            this.upgradeProgress = 0;
            this.updateUpgradeProgress();
            this.renderUpgradeWeapon();
            shop.showMessage(`Zbraň vylepšena na ${newRarity.name}!`, 'success');
        }
    }

    renderUpgradeWeapon() {
        this.upgradeSlot.innerHTML = '';
        if (this.upgradeWeapon) {
            const weaponElement = this.upgradeWeapon.render();
            weaponElement.title = "Klikněte pro vrácení do inventáře";
            this.upgradeSlot.appendChild(weaponElement);
        } else {
            const placeholderText = document.createElement('p');
            placeholderText.textContent = 'Vylepšen';
            this.upgradeSlot.appendChild(placeholderText);
        }
    }

    updateUpgradeProgress() {
        const progressBar = document.getElementById('upgrade-bar');
        if (progressBar) {
            progressBar.style.width = `${this.upgradeProgress}%`;
        }
    }

    onUpgradeSlotClick() {
        if (this.upgradeWeapon) {
            this.addItem(this.upgradeWeapon);
            this.showMessage(`Zbraň ${this.upgradeWeapon.name} byla vrácena do inventáře.`);
            this.upgradeWeapon = null;
            this.upgradeProgress = 0;
            this.renderUpgradeWeapon();
            this.updateUpgradeProgress();
        }
        this.updateUpgradeAllButtonState();
    }

    onWeaponSlotClick() {
        if (this.equippedWeapon) {
            this.addItem(this.equippedWeapon);
            this.showMessage(`Zbraň ${this.equippedWeapon.name} byla vrácena do inventáře.`);
            this.equippedWeapon = null;
            this.renderEquippedWeapon();
            this.updateAttackValue();
        }
    }

    showMessage(message) {
        // Pokud nemáte metodu pro zobrazení zpráv v Inventory, můžete použít shop.showMessage
        if (typeof shop !== 'undefined' && shop.showMessage) {
            shop.showMessage(message);
        } else {
            console.log(message);
        }
    }

    upgradeWeapon() {
        if (this.upgradeWeapon) {
            this.upgradeProgress += 10;
            this.updateUpgradeProgress();

            if (this.upgradeProgress >= 100) {
                this.upgradeWeaponRarity();
            }
        }
    }

    setupNewButtons() {
        const sellAllButton = document.getElementById('sell-all');
        const upgradeAllButton = document.getElementById('upgrade-all');

        if (sellAllButton) {
            sellAllButton.addEventListener('click', () => this.sellAllItems());
        }

        if (upgradeAllButton) {
            upgradeAllButton.addEventListener('click', () => this.upgradeAllItems());
            // Inicializace stavu tlačítka
            this.updateUpgradeAllButtonState();
        }
    }

    sellAllItems() {
        let totalValue = 0;
        this.items.forEach(item => {
            // Snížená hodnota prodeje, například o 50%
            totalValue += item.power * 0.3;
        });

        // Zaokrouhlení celkové hodnoty na celé číslo
        totalValue = Math.round(totalValue);

        // Přidání antimatter za prodané zbraně
        shop.antimatter += totalValue;
        shop.updateAntimatterDisplay();

        // Vyprázdnění inventáře po prodeji
        this.clearInventory();

        // Zobrazení zprávy o prodeji
        shop.showMessage(`Prodali jste všechny zbraně za ${totalValue} antimatter.`);
    }

    calculateItemValue(item) {
        // Základní hodnota podle rarity
        const rarityIndex = CONFIG.RARITIES.indexOf(item.rarity);
        return Math.ceil((rarityIndex + 1) * 2 * (item.power / 10));
    }

    upgradeAllItems() {
        if (!this.upgradeWeapon || this.items.length === 0) {
            return;
        }

        // Kontrola antimatter
        if (typeof shop !== 'undefined' && shop.antimatter < 10) {
            shop.showMessage('Nedostatek antimatter! Potřebujete 10 AM pro vylepšení všech předmětů.', 'error');
            return;
        }

        // Odečtení antimatter
        if (typeof shop !== 'undefined') {
            shop.antimatter -= 10;
            shop.updateAntimatterDisplay();
        }

        // Výpočet celkového příspěvku k vylepšení
        let totalProgress = 0;
        this.items.forEach(item => {
            totalProgress += (item.power / this.upgradeWeapon.power) * 100;
        });

        // Přidání progressu
        this.upgradeProgress += totalProgress;
        this.updateUpgradeProgress();

        // Vyčištění inventáře
        this.items = [];
        this.renderInventory();

        // Kontrola dokončení vylepšení
        while (this.upgradeProgress >= 100) {
            this.upgradeWeaponRarity();
        }

        shop.showMessage(`Všechny předměty byly použity k vylepšení zbraně!`);
    }

    updateUpgradeAllButtonState() {
        const upgradeAllButton = document.getElementById('upgrade-all');
        if (upgradeAllButton) {
            upgradeAllButton.disabled = !this.upgradeWeapon;
        }
    }

    clearInventory() {
        this.items = [];
        this.renderInventory();
    }

    increaseWeaponPower(percentage) {
        this.items.forEach(item => {
            item.power = Math.ceil(item.power * (1 + percentage));
        });
        this.renderInventory();
    }
}
