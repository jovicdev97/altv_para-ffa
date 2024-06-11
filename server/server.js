import * as alt from 'alt-server';
import { handlePlayerDamage } from '../server/playerDamageHandler.js';
import { handlePlayerConnect, handlePlayerDisconnect } from '../server/playerConnectHandler.js';
import { registerChatCommands } from '../server/commands/chatCommands.js';
import { teleportPlayer } from '../helper/teleportHandler.js';
import { handlePlayerDeath } from '../server/deathHandler.js';
import { loadConfig } from '../helper/configLoader.js';
import { createFFAZone } from '../helper/zoneHandler.js';
import { equipFFAWeapon } from '../server/ffaLogic.js'; 
import '../helper/npcHandler.js';

const config = loadConfig('configs/positions.json');
alt.log('Loaded config:', JSON.stringify(config));

// Register event handlers
alt.on('playerConnect', handlePlayerConnect);
alt.on('playerDisconnect', handlePlayerDisconnect);
alt.on('playerDamage', handlePlayerDamage);
alt.on('playerDeath', handlePlayerDeath);

registerChatCommands();

alt.onClient('teleportPlayerToLocation', (player, position) => {
    teleportPlayer(player, position, player.dimension);
});

// Add dynamic FFA zones
if (config.zones && Array.isArray(config.zones)) {
    config.zones.forEach(zone => {
        createFFAZone(zone);
    });
} else {
    alt.log('No zones found in config or config.zones is not an array');
}

// add: join ffa with webview
alt.onClient('joinFFAZone', (player, zoneName) => {
    let zone = config.zones.find(z => z.name === zoneName);
    if (!zone) {
        console.log(`FFA Zone ${zoneName} not found in config, defaulting to Zone 1`);
        zoneName = "1";
        zone = config.zones.find(z => z.name === zoneName);
        if (!zone) {
            console.log(`Default FFA Zone 1 not found in config`);
            return;
        }
    }
    teleportPlayer(player, zone.ffaPosition, zone.ffaDimension);
    player.setSyncedMeta('isInFFA', true);
    equipFFAWeapon(player);
    console.log(`Player ${player.name} joined the FFA zone ${zone.name}`);
});
