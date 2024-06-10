import * as alt from 'alt-server';
import { handlePlayerDamage } from '../server/playerDamageHandler.js';
import { handlePlayerConnect, handlePlayerDisconnect } from '../server/playerConnectHandler.js';
import { registerChatCommands } from '../server/commands/chatCommands.js';
import { teleportPlayer } from '../helper/teleportHandler.js';
import { handlePlayerDeath } from '../server/deathHandler.js';
import { loadConfig } from '../helper/configLoader.js';
import { createFFAZone } from '../helper/zoneHandler.js';
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

// add: dynamic ffa zones
if (config.zones && Array.isArray(config.zones)) {
    config.zones.forEach(zone => {
        createFFAZone(zone);
    });
} else {
    alt.log('No zones found in config or config.zones is not an array');
}