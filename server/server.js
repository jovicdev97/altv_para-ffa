/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { handlePlayerDamage } from './playerDamageHandler.js';
import { handlePlayerConnect, handlePlayerDisconnect } from './playerConnectHandler.js';
import { registerChatCommands, teleportPlayer } from './chatCommandsHandler.js';
import { handlePlayerDeath } from './deathHandler.js';

alt.on('playerConnect', handlePlayerConnect);
alt.on('playerDisconnect', handlePlayerDisconnect);
alt.on('playerDamage', handlePlayerDamage);
alt.on('playerDeath', handlePlayerDeath);

registerChatCommands();

// teleport menu
alt.onClient('teleportPlayerToLocation', (player, position) => {
    teleportPlayer(player, position, player.dimension);
});