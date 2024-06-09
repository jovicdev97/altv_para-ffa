import * as alt from 'alt-server';
import { handlePlayerDamage } from './playerDamageHandler.js';
import { handlePlayerConnect, handlePlayerDisconnect } from './playerConnectHandler.js';
import { registerChatCommands, teleportPlayer } from './chatCommandsHandler.js';
import { handlePlayerDeath } from './deathHandler.js';
import { loadConfig } from '../helper/configLoader.js';
import { createColshapeAndMarker } from './ffaLogic.js';

const config = loadConfig('configs/positions.json');

alt.on('playerConnect', handlePlayerConnect);
alt.on('playerDisconnect', handlePlayerDisconnect);
alt.on('playerDamage', handlePlayerDamage);
alt.on('playerDeath', handlePlayerDeath);

registerChatCommands();
createColshapeAndMarker(config.ffaColshape, config.ffaMarker);

alt.onClient('teleportPlayerToLocation', (player, position) => {
    teleportPlayer(player, position, player.dimension);
});
