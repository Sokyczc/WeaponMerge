const CONFIG = {
    RARITIES: [
        { name: 'Common', color: '#a5a5a5', chance: 0.35, minPower: 1, maxPower: 10, particles: 0 },
        { name: 'Uncommon', color: '#55aa55', chance: 0.25, minPower: 11, maxPower: 20, particles: 0 },
        { name: 'Rare', color: '#5555ff', chance: 0.15, minPower: 21, maxPower: 30, particles: 3 },
        { name: 'Epic', color: '#aa55aa', chance: 0.1, minPower: 31, maxPower: 40, particles: 5 },
        { name: 'Legendary', color: '#ffaa00', chance: 0.06, minPower: 41, maxPower: 50, particles: 8, glow: true },
        { name: 'Mythic', color: '#ff5555', chance: 0.035, minPower: 51, maxPower: 60, particles: 10, glow: true },
        { name: 'Divine', color: '#55ffff', chance: 0.02, minPower: 61, maxPower: 70, particles: 12, glow: true },
        { name: 'Celestial', color: '#ffffff', chance: 0.01, minPower: 71, maxPower: 80, particles: 15, glow: true, aura: true },
        { name: 'Cosmic', color: '#ff00ff', chance: 0.005, minPower: 81, maxPower: 90, particles: 18, glow: true, aura: true },
        { name: 'Transcendent', color: '#ffff00', chance: 0.0025, minPower: 91, maxPower: 100, particles: 20, glow: true, aura: true, rainbow: true },
        { name: 'Ethereal', color: '#00ffaa', chance: 0.00125, minPower: 101, maxPower: 110, particles: 22, glow: true, aura: true, rainbow: true },
        { name: 'Astral', color: '#aa00ff', chance: 0.000625, minPower: 111, maxPower: 120, particles: 25, glow: true, aura: true, rainbow: true },
        { name: 'Quantum', color: '#00ffff', chance: 0.0003125, minPower: 121, maxPower: 130, particles: 28, glow: true, aura: true, rainbow: true },
        { name: 'Dimensional', color: '#ff00aa', chance: 0.00015625, minPower: 131, maxPower: 140, particles: 30, glow: true, aura: true, rainbow: true },
        { name: 'Omnipotent', color: '#ffffff', chance: 0.000078125, minPower: 141, maxPower: 150, particles: 35, glow: true, aura: true, rainbow: true, fullEffect: true },
        { name: 'Godly', color: '#ffd700', chance: 0.0000390625, minPower: 151, maxPower: 160, particles: 40, glow: true, aura: true, rainbow: true, fullEffect: true },
        { name: 'Infinite', color: '#000000', chance: 0.00001953125, minPower: 161, maxPower: 170, particles: 45, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true },
        { name: 'Eternal', color: '#4b0082', chance: 0.000009765625, minPower: 171, maxPower: 180, particles: 50, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true },
        { name: 'Primordial', color: '#006400', chance: 0.0000048828125, minPower: 181, maxPower: 190, particles: 55, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true },
        { name: 'Void', color: '#36013f', chance: 0.00000244140625, minPower: 191, maxPower: 200, particles: 60, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true, blackHole: true },
        { name: 'Singularity', color: '#000000', chance: 0.000001220703125, minPower: 201, maxPower: 210, particles: 65, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true, blackHole: true, gravitationalLensing: true },
        { name: 'Multiversal', color: '#00ff00', chance: 0.0000006103515625, minPower: 211, maxPower: 220, particles: 70, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true, blackHole: true, gravitationalLensing: true, dimensionalRift: true },
        { name: 'Omniversal', color: '#ff0000', chance: 0.00000030517578125, minPower: 221, maxPower: 230, particles: 75, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true, blackHole: true, gravitationalLensing: true, dimensionalRift: true, realityWarp: true },
        { name: 'Conceptual', color: '#0000ff', chance: 0.000000152587890625, minPower: 231, maxPower: 240, particles: 80, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true, blackHole: true, gravitationalLensing: true, dimensionalRift: true, realityWarp: true, abstractManifest: true },
        { name: 'Absolute', color: '#ffffff', chance: 0.0000000762939453125, minPower: 241, maxPower: 250, particles: 85, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true, blackHole: true, gravitationalLensing: true, dimensionalRift: true, realityWarp: true, abstractManifest: true, omnipresence: true },
        // Přidání nové rarity
        { name: 'Universal', color: '#4B0082', chance: 0.00000003814697265625, minPower: 251, maxPower: 260, particles: 90, glow: true, aura: true, rainbow: true, fullEffect: true, vortex: true, blackHole: true, gravitationalLensing: true, dimensionalRift: true, realityWarp: true, abstractManifest: true, omnipresence: true, dimensionalShift: true },
        // Nová rarita
        { 
            name: 'Ethereal Flame', 
            color: '#000000', // Změněno na černou
            chance: 0.00000001907348632812, 
            minPower: 261, 
            maxPower: 270, 
            particles: 0, 
            etherealFlame: true,
            glow: true,
            aura: true
        }
    ],
    ITEM_TYPES: ['Sword', 'Axe', 'Mace', 'Dagger', 'Bow', 'Staff', 'Wand'],
    ATTRIBUTES: ['Flaming', 'Frozen', 'Venomous', 'Thunderous', 'Radiant', 'Shadowy', 'Arcane', 'Divine'],
    INITIAL_ANTIMATTER: 10,
    ITEM_COST: 2,
    GENERATION_TIME: 10000
};
