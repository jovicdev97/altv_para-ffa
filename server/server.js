import * as alt from 'alt-server';
import { handlePlayerDamage } from '../Server/playerDamageHandler.js';
import { handlePlayerConnect, handlePlayerDisconnect } from '../server/playerConnectHandler.js';
import { registerChatCommands } from '../server/commands/chatCommands.js';
import { teleportPlayer } from '../helper/teleportHandler.js';
import { handlePlayerDeath } from '../server/deathHandler.js';
import { loadConfig } from '../helper/configLoader.js';
import { createFFAZone } from '../helper/zoneHandler.js';
import '../helper/npcHandler.js';

const config = loadConfig('configs/positions.json');

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
}