let inventory;
let shop;
let worldBoss;
let achievements;
let playTime;
let leaderboard;

async function requestPlayerName() {
    if (!localStorage.getItem('playerName')) {
        const playerName = await showNameDialog();
        if (playerName) {
            localStorage.setItem('playerName', playerName);
        }
    }
}

function showNameDialog() {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'name-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h2>Zadej své jméno</h2>
                <input type="text" id="player-name-input" maxlength="20" placeholder="Tvoje jméno">
                <button id="save-name">Uložit</button>
            </div>
        `;
        document.body.appendChild(dialog);

        const input = dialog.querySelector('#player-name-input');
        const button = dialog.querySelector('#save-name');

        function saveName() {
            const name = input.value.trim();
            if (name) {
                dialog.remove();
                resolve(name);
            } else {
                input.classList.add('error');
            }
        }

        button.addEventListener('click', saveName);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveName();
        });
        input.focus();
    });
}

function createRarityLegend() {
    console.log('Vytváření legendy vzácností');
    const legendContainer = document.querySelector('.rarity-legend');
    if (!legendContainer) {
        console.error('Nenalezen kontejner pro legendu vzácností');
        return;
    }
    CONFIG.RARITIES.forEach(rarity => {
        const legendItem = document.createElement('div');
        legendItem.className = 'rarity-legend-item';
        legendItem.innerHTML = `
            <div class="rarity-legend-color" style="background-color: ${rarity.color}"></div>
            <span>${rarity.name}</span>
        `;
        legendContainer.appendChild(legendItem);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await requestPlayerName(); // Počkáme na zadání jména
    
    playTime = new PlayTime();
    inventory = new Inventory();
    shop = new Shop(inventory);
    worldBoss = new WorldBoss(inventory);
    achievements = new Achievements(inventory, shop);
    leaderboard = new Leaderboard();

    // Přidejte několik počátečních předmětů do inventáře
    for (let i = 0; i < 5; i++) {
        const newItem = generateRandomItem();
        inventory.addItem(newItem);
    }

    // Aktualizujte počáteční zobrazení antimatter
    shop.updateAntimatterDisplay();

    // Vykreslete inventář
    inventory.renderInventory();

    createRarityLegend();
});

// Přidat na konec souboru
function addUniversalWeapon() {
    // Najdeme raritu s nejvyšším maxPower (poslední v poli)
    const bestRarity = CONFIG.RARITIES[CONFIG.RARITIES.length - 1];
    
    // Vytvoříme novou zbraň s nejlepší raritou
    const newWeapon = new Item(
        'Sword', // Můžete změnit na jiný typ zbraně
        bestRarity,
        'Divine' // Můžete změnit na jiný atribut
    );

    // Přidáme do inventáře
    inventory.addItem(newWeapon);
    inventory.renderInventory();
    
    // Zobrazíme zprávu
    shop.showMessage(`Přidána ${bestRarity.name} zbraň!`, 'info');
}

function addAntimatter() {
    if (typeof shop !== 'undefined') {
        shop.antimatter += 50000;
        shop.updateAntimatterDisplay();
        shop.showMessage('Přidáno 50,000 antimatter!', 'info');
    }
}

// Pro snadné odstranění v produkci stačí:
// 1. Smazat div s id="dev-button" z HTML
// 2. Smazat funkci addUniversalWeapon() z main.js
