class Item {
    constructor(type, rarity, attribute) {
        this.type = type;
        this.rarity = rarity;
        this.attribute = attribute;
        this.power = this.calculatePower();
        this.name = `${this.attribute} ${this.type}`;
        this.colors = this.generateColors();
        this.svg = this.generateSVG();

        // Přidáme kontrolu pro legendární a vyšší vzácnosti
        if (this.rarity.name === 'Legendary' || CONFIG.RARITIES.indexOf(this.rarity) >= CONFIG.RARITIES.indexOf(CONFIG.RARITIES.find(r => r.name === 'Legendary'))) {
            // Vytvoříme a dispatchneme event
            const legendaryEvent = new CustomEvent('legendaryFound', {
                detail: {
                    itemName: this.name,
                    rarity: this.rarity.name
                }
            });
            document.dispatchEvent(legendaryEvent);
        }
    }

    calculatePower() {
        return Math.floor(Math.random() * (this.rarity.maxPower - this.rarity.minPower + 1)) + this.rarity.minPower;
    }

    generateColors() {
        const baseColor = this.rarity.color;
        return {
            primary: baseColor,
            secondary: this.getComplementaryColor(baseColor),
            accent: this.getRandomColor(),
            glow: this.getAttribute(this.attribute)
        };
    }

    getAttribute(attribute) {
        const attributeColors = {
            'Flaming': '#FF4500',
            'Frozen': '#00FFFF',
            'Venomous': '#00FF00',
            'Thunderous': '#FFD700',
            'Radiant': '#FFFFFF',
            'Shadowy': '#4B0082',
            'Arcane': '#FF00FF',
            'Divine': '#FFF8DC'
        };
        return attributeColors[attribute] || this.getRandomColor();
    }

    generateSVG() {
        const weaponShapes = {
            'Sword': this.generateSword(),
            'Axe': this.generateAxe(),
            'Mace': this.generateMace(),
            'Dagger': this.generateDagger(),
            'Bow': this.generateBow(),
            'Staff': this.generateStaff(),
            'Wand': this.generateWand()
        };

        let svg = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="itemGradient${this.id}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:${this.colors.primary};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${this.colors.secondary};stop-opacity:1" />
                </radialGradient>
                <filter id="glow${this.id}">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                ${this.rarity.rainbow ? this.generateRainbowGradient() : ''}
                ${this.rarity.dimensionalShift ? this.generateDimensionalShiftEffect() : ''}
                ${this.rarity.name === 'Universal' ? this.generateRisingParticlesFilter() : ''}
                ${this.rarity.etherealFlame ? this.generateEtherealFlameEffect() : ''}
            </defs>
            
            <!-- Background effects -->
            ${this.generateBackground()}
            ${this.rarity.dimensionalShift ? this.generateDimensionalShiftAnimation() : ''}
            ${this.rarity.energyField ? this.generateEnergyField() : ''}
            ${this.rarity.etherealFlame ? this.generateEtherealFlames() : ''}
            
            <!-- Rising particles for Universal rarity -->
            ${this.rarity.name === 'Universal' ? this.generateRisingParticles() : ''}
            
            <!-- Weapon shape on top -->
            <g filter="url(#glow${this.id})">
                ${weaponShapes[this.type]}
            </g>
            
            <!-- Other effects -->
            ${this.generateParticles()}
            ${this.generateAura()}
            ${this.rarity.rainbow ? this.generateShine() : ''}
            ${this.rarity.rainbow ? this.generateRainbowEffect() : ''}
            ${this.rarity.lightning ? this.generateLightningEffect() : ''}
        </svg>
        `;

        if (this.rarity.name === 'Ethereal Flame') {
            svg = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="etherealFlame${this.id}">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="5">
                            <animate 
                                attributeName="seed" 
                                from="0" 
                                to="100" 
                                dur="3s" 
                                repeatCount="indefinite"
                            />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" scale="10"/>
                        <feGaussianBlur stdDeviation="1"/>
                        <feComposite operator="in" in2="SourceGraphic"/>
                    </filter>
                    
                    <radialGradient id="flameGlow${this.id}">
                        <stop offset="0%" stop-color="#00ff00" stop-opacity="0.5"/>
                        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
                    </radialGradient>
                    
                    <linearGradient id="flameGrad${this.id}" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#000000" stop-opacity="0.8"/>
                        <stop offset="50%" stop-color="#00ff00" stop-opacity="0.5"/>
                        <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
                    </linearGradient>
                </defs>
                
                <!-- Pozadí s efektem záře -->
                <rect 
                    width="100" 
                    height="100" 
                    fill="url(#flameGlow${this.id})"
                />
                
                <!-- Animované plameny -->
                <g filter="url(#etherealFlame${this.id})">
                    <rect 
                        width="100" 
                        height="100" 
                        fill="url(#flameGrad${this.id})"
                    />
                </g>
                
                <!-- Weapon shape s efektem -->
                <g filter="url(#etherealFlame${this.id})">
                    ${weaponShapes[this.type]}
                </g>
            </svg>`;
        }

        return svg;
    }

    generateBackground() {
        return `
        <rect width="100" height="100" fill="url(#itemGradient${this.id})" />
        `;
    }

    generateAura() {
        if (this.rarity.glow) {
            return `
            <circle cx="50" cy="50" r="45" fill="none" stroke="${this.colors.accent}" stroke-width="3" filter="url(#glow${this.id})">
                <animate attributeName="r" values="43;47;43" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
            </circle>
            `;
        }
        return '';
    }

    generateParticles() {
        let particles = '';
        for (let i = 0; i < this.rarity.particles; i++) {
            particles += `
            <circle class="particle" cx="${Math.random() * 100}" cy="${Math.random() * 100}" r="${0.5 + Math.random() * 1.5}" fill="${this.colors.accent}">
                <animate attributeName="opacity" values="0;1;0" dur="${1 + Math.random() * 2}s" repeatCount="indefinite" begin="${Math.random() * 2}s" />
                <animate attributeName="cy" values="${Math.random() * 100};${Math.random() * 100}" dur="${2 + Math.random() * 3}s" repeatCount="indefinite" begin="${Math.random() * 2}s" />
                <animate attributeName="cx" values="${Math.random() * 100};${Math.random() * 100}" dur="${2 + Math.random() * 3}s" repeatCount="indefinite" begin="${Math.random() * 2}s" />
            </circle>
            `;
        }
        return particles;
    }

    generateRainbowGradient() {
        return `
        <linearGradient id="rainbow${this.id}" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stop-color="violet" />
            <stop offset="16.67%" stop-color="indigo" />
            <stop offset="33.33%" stop-color="blue" />
            <stop offset="50%" stop-color="green" />
            <stop offset="66.67%" stop-color="yellow" />
            <stop offset="83.33%" stop-color="orange" />
            <stop offset="100%" stop-color="red" />
        </linearGradient>
        `;
    }

    generateRainbowEffect() {
        return `
        <rect width="100" height="100" fill="url(#rainbow${this.id})" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
        </rect>
        `;
    }

    generateShine() {
        return `
        <circle cx="25" cy="25" r="35" fill="url(#rainbow${this.id})" opacity="0.2">
            <animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
        </circle>
        `;
    }

    generateEnergyField() {
        if (this.rarity.energyField) {
            return `
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#rainbow${this.id})" stroke-width="2" opacity="0.5">
                <animate attributeName="r" values="46;50;46" dur="4s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1;3;1" dur="4s" repeatCount="indefinite" />
            </circle>
            `;
        }
        return '';
    }

    generateLightningEffect() {
        if (this.rarity.lightning) {
            return `
            <path d="M50,10 L55,50 L60,30 L65,90" stroke="${this.colors.accent}" stroke-width="2" fill="none">
                <animate attributeName="d" values="M50,10 L55,50 L60,30 L65,90;M45,10 L50,50 L55,30 L60,90;M50,10 L55,50 L60,30 L65,90" dur="0.5s" repeatCount="indefinite" />
            </path>
            `;
        }
        return '';
    }

    generateAxe() {
        return `
            <path d="M20,40 L50,20 L80,40 L65,60 L35,60 Z" fill="${this.colors.primary}" stroke="${this.colors.secondary}" stroke-width="2"/>
            <rect x="48" y="40" width="4" height="50" fill="${this.colors.accent}"/>
            <path d="M30,50 Q50,30 70,50" fill="none" stroke="${this.colors.glow}" stroke-width="3" filter="url(#glow${this.power})"/>
        `;
    }

    generateSword() {
        return `
            <path d="M30,20 L70,20 L75,50 L70,80 L30,80 L25,50 Z" fill="${this.colors.primary}" stroke="${this.colors.secondary}" stroke-width="2"/>
            <path d="M40,20 L60,20 L62,50 L60,80 L40,80 L38,50 Z" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="1"/>
            <rect x="48" y="10" width="4" height="80" fill="${this.colors.accent}"/>
            <circle cx="50" cy="50" r="8" fill="${this.colors.glow}" filter="url(#glow${this.power})"/>
        `;
    }

    generateMace() {
        return `
            <circle cx="50" cy="30" r="25" fill="${this.colors.primary}" stroke="${this.colors.secondary}" stroke-width="2"/>
            <rect x="48" y="30" width="4" height="60" fill="${this.colors.accent}"/>
            <circle cx="50" cy="30" r="15" fill="${this.colors.glow}" filter="url(#glow${this.power})"/>
            ${[0, 60, 120, 180, 240, 300].map(angle => `
                <circle cx="${50 + 22 * Math.cos(angle * Math.PI / 180)}" cy="${30 + 22 * Math.sin(angle * Math.PI / 180)}" r="5" fill="${this.colors.accent}"/>
            `).join('')}
        `;
    }

    generateDagger() {
        return `
            <path d="M40,20 L60,20 L65,50 L60,80 L40,80 L35,50 Z" fill="${this.colors.primary}" stroke="${this.colors.secondary}" stroke-width="2"/>
            <path d="M45,20 L55,20 L57,50 L55,80 L45,80 L43,50 Z" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="1"/>
            <rect x="49" y="15" width="2" height="70" fill="${this.colors.accent}"/>
            <path d="M40,20 Q50,15 60,20" fill="none" stroke="${this.colors.glow}" stroke-width="2" filter="url(#glow${this.power})"/>
        `;
    }

    generateBow() {
        return `
            <path d="M30,20 C20,50 20,50 30,80" fill="none" stroke="${this.colors.primary}" stroke-width="4"/>
            <path d="M70,20 C80,50 80,50 70,80" fill="none" stroke="${this.colors.primary}" stroke-width="4"/>
            <line x1="30" y1="50" x2="70" y2="50" stroke="${this.colors.secondary}" stroke-width="2"/>
            <circle cx="50" cy="50" r="5" fill="${this.colors.glow}" filter="url(#glow${this.power})"/>
            <path d="M30,20 C20,50 20,50 30,80 M70,20 C80,50 80,50 70,80" fill="none" stroke="${this.colors.accent}" stroke-width="1"/>
        `;
    }

    generateStaff() {
        return `
            <rect x="48" y="10" width="4" height="80" fill="${this.colors.primary}"/>
            <circle cx="50" cy="20" r="15" fill="${this.colors.secondary}"/>
            <path d="M35,20 Q50,5 65,20" fill="none" stroke="${this.colors.accent}" stroke-width="2"/>
            <circle cx="50" cy="20" r="8" fill="${this.colors.glow}" filter="url(#glow${this.power})"/>
        `;
    }

    generateWand() {
        return `
            <rect x="48" y="20" width="4" height="70" fill="${this.colors.primary}"/>
            <path d="M40,20 L50,10 L60,20 L50,30 Z" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="1"/>
            <circle cx="50" cy="20" r="5" fill="${this.colors.glow}" filter="url(#glow${this.power})"/>
            ${[0, 72, 144, 216, 288].map(angle => `
                <circle cx="${50 + 12 * Math.cos(angle * Math.PI / 180)}" cy="${20 + 12 * Math.sin(angle * Math.PI / 180)}" r="2" fill="${this.colors.accent}"/>
            `).join('')}
        `;
    }

    getComplementaryColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`;
    }

    getRandomColor() {
        return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    }

    render() {
        console.log('Vykreslování předmětu:', this.name);
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.style.backgroundColor = this.rarity.color;
        itemElement.innerHTML = `
            ${this.generateSVG()}
            <span class="item-name">${this.name}</span>
            <span class="item-rarity">${this.rarity.name}</span>
            <span class="item-power">Síla: ${this.power}</span>
        `;
        if (this.rarity.glow) {
            itemElement.style.boxShadow = `0 0 10px ${this.rarity.color}`;
        }
        return itemElement;
    }

    // Přidání nové metody pro dimensionalShift efekt
    generateDimensionalShiftEffect() {
        return `
        <filter id="dimensionalShift${this.id}">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10"/>
            <feGaussianBlur stdDeviation="1"/>
            <feBlend in="SourceGraphic" mode="screen"/>
        </filter>
        `;
    }

    generateDimensionalShiftAnimation() {
        return `
        <g opacity="0.5">
            <rect width="100" height="100" fill="url(#itemGradient${this.id})" filter="url(#dimensionalShift${this.id})">
                <animate attributeName="opacity" 
                    values="0.3;0.7;0.3" 
                    dur="4s" 
                    repeatCount="indefinite"/>
            </rect>
        </g>
        `;
    }

    generateRisingParticlesFilter() {
        return `
        <filter id="particleBlur${this.id}">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
        </filter>
        `;
    }

    generateRisingParticles() {
        const particles = [];
        const numParticles = 15;

        for (let i = 0; i < numParticles; i++) {
            const x = Math.random() * 100;
            const delay = Math.random() * 4;
            const size = Math.random() * 2 + 1;
            const duration = Math.random() * 2 + 2;

            particles.push(`
                <circle class="rising-particle" cx="${x}" cy="100" r="${size}" fill="rgba(0,0,0,0.6)" filter="url(#particleBlur${this.id})">
                    <animate 
                        attributeName="cy" 
                        from="100" 
                        to="-10"
                        dur="${duration}s" 
                        begin="${delay}s"
                        repeatCount="indefinite" />
                    <animate 
                        attributeName="opacity" 
                        values="0.6;0.3;0"
                        dur="${duration}s" 
                        begin="${delay}s"
                        repeatCount="indefinite" />
                    <animate 
                        attributeName="r" 
                        values="${size};${size * 1.5};${size * 0.5}"
                        dur="${duration}s" 
                        begin="${delay}s"
                        repeatCount="indefinite" />
                </circle>
            `);
        }

        return `
        <g class="rising-particles">
            ${particles.join('')}
        </g>
        `;
    }

    generateEtherealFlameEffect() {
        return `
        <filter id="etherealFlame${this.id}">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="5" seed="${Math.random() * 100}">
                <animate attributeName="seed" from="0" to="100" dur="3s" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="20"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite operator="in" in2="SourceGraphic"/>
        </filter>

        <linearGradient id="flameGradient${this.id}" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" style="stop-color:#00ff00;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#000000;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#00ff00;stop-opacity:0.3" />
        </linearGradient>
        `;
    }

    generateEtherealFlames() {
        const flames = [];
        const numFlames = 12;

        for (let i = 0; i < numFlames; i++) {
            const x = 50 + 30 * Math.cos(2 * Math.PI * i / numFlames);
            const y = 50 + 30 * Math.sin(2 * Math.PI * i / numFlames);
            
            flames.push(`
                <path d="M ${x} ${y} Q ${50 + Math.random() * 20 - 10} ${50 + Math.random() * 20 - 10} 50 50" 
                    fill="none" 
                    stroke="url(#flameGradient${this.id})" 
                    stroke-width="3"
                    filter="url(#etherealFlame${this.id})">
                    <animate attributeName="d" 
                        dur="${2 + Math.random()}s" 
                        repeatCount="indefinite"
                        values="M ${x} ${y} Q ${50 + Math.random() * 20 - 10} ${50 + Math.random() * 20 - 10} 50 50;
                                M ${x} ${y} Q ${50 + Math.random() * 20 - 10} ${50 + Math.random() * 20 - 10} 50 50;
                                M ${x} ${y} Q ${50 + Math.random() * 20 - 10} ${50 + Math.random() * 20 - 10} 50 50"/>
                </path>
            `);
        }

        return `
        <g class="ethereal-flames">
            ${flames.join('')}
        </g>
        `;
    }
}

function generateRandomItem() {
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    
    for (const rarity of CONFIG.RARITIES) {
        cumulativeProbability += rarity.chance;
        if (randomValue <= cumulativeProbability) {
            const type = CONFIG.ITEM_TYPES[Math.floor(Math.random() * CONFIG.ITEM_TYPES.length)];
            const attribute = CONFIG.ATTRIBUTES[Math.floor(Math.random() * CONFIG.ATTRIBUTES.length)];
            return new Item(type, rarity, attribute);
        }
    }
    
    // Pokud by se náhodou stalo, že žádná vzácnost nebyla vybrána (což by nemělo),
    // vrátíme Common item jako fallback
    return new Item(CONFIG.ITEM_TYPES[0], CONFIG.RARITIES[0], CONFIG.ATTRIBUTES[0]);
}

function selectRarity() {
    const rand = Math.random();
    let cumulativeChance = 0;
    for (const rarity of CONFIG.RARITIES) {
        cumulativeChance += rarity.chance;
        if (rand < cumulativeChance) {
            return rarity;
        }
    }
    return CONFIG.RARITIES[CONFIG.RARITIES.length - 1];
}

function combineItems(item1, item2) {
    const rarityIndex1 = CONFIG.RARITIES.indexOf(item1.rarity);
    const rarityIndex2 = CONFIG.RARITIES.indexOf(item2.rarity);
    const maxRarityIndex = Math.max(rarityIndex1, rarityIndex2);
    
    let newRarityIndex;
    const randomValue = Math.random();
    
    if (randomValue < 0.8) {
        // 80% šance na zachování stejné rarity
        newRarityIndex = maxRarityIndex;
    } else if (randomValue < 0.95) {
        // 15% šance na zvýšení rarity o 1
        newRarityIndex = Math.min(maxRarityIndex + 1, CONFIG.RARITIES.length - 1);
    } else {
        // 5% šance na zvýšení rarity o 2
        newRarityIndex = Math.min(maxRarityIndex + 2, CONFIG.RARITIES.length - 1);
    }

    const newRarity = CONFIG.RARITIES[newRarityIndex];
    const newType = Math.random() < 0.5 ? item1.type : item2.type;
    const newAttribute = Math.random() < 0.5 ? item1.attribute : item2.attribute;
    
    // Výpočet nové síly zbraně
    const minPower = newRarity.minPower;
    const maxPower = newRarity.maxPower;
    const newPower = Math.floor(Math.random() * (maxPower - minPower + 1)) + minPower;
    
    const newItem = new Item(newType, newRarity, newAttribute);
    newItem.power = newPower;

    showCombineAnimation(item1, item2, newItem);

    return newItem;
}

function showCombineAnimation(item1, item2, newItem) {
    const animationElement = document.createElement('div');
    animationElement.className = 'combine-animation';
    animationElement.innerHTML = `
        <div class="item1">${item1.svg}</div>
        <div class="item2">${item2.svg}</div>
        <div class="new-item">${newItem.svg}</div>
    `;
    document.body.appendChild(animationElement);

    setTimeout(() => {
        animationElement.classList.add('animate');
    }, 100);

    setTimeout(() => {
        animationElement.remove();
    }, 2000);
}

