/// <reference types="@altv/types-server" />
import * as chat from 'alt:chat';
import * as alt from 'alt-server';
import { logPlayerInfo } from './playerConnectHandler.js';
import { LOBBY_POSITION, FFA_POSITION, FFA_DIMENSION, LOBBY_DIMENSION } from '../helper/coords.js';
import { equipFFAWeapon, removeFFAWeapon } from './ffaLogic.js';

const lastCommandUsage = new Map();

export function registerChatCommands() {
    chat.registerCmd('ffa', handleFFACommand);
    chat.registerCmd('exitffa', handleExitFFACommand);
}

export function handleFFACommand(player) {
    if (isRateLimited(player)) {
        alt.log(`${player.name} is rate limited from using /ffa command too frequently.`);
        return;
    }

    teleportPlayer(player, FFA_POSITION, FFA_DIMENSION);
    player.setSyncedMeta('isInFFA', true);
    equipFFAWeapon(player);
    logPlayerInfo(player, "joined the FFA zone");
}

export function handleExitFFACommand(player) {
    if (isRateLimited(player)) {
        alt.log(`${player.name} is rate limited from using /exitffa command too frequently.`);
        return;
    }

    teleportPlayer(player, LOBBY_POSITION, LOBBY_DIMENSION);
    player.setSyncedMeta('isInFFA', false);
    removeFFAWeapon(player);
    logPlayerInfo(player, "exited the FFA zone");
}

export function teleportPlayer(player, position, dimension) {
    player.pos = new alt.Vector3(position.x, position.y, position.z);
    if (dimension !== undefined) {
        player.dimension = dimension;
    }
    logPlayerInfo(player, `teleported to ${JSON.stringify(position)}`);
}

function isRateLimited(player) {
    const now = Date.now();
    if (lastCommandUsage.has(player.id) && now - lastCommandUsage.get(player.id) < 5000) {
        return true;
    }
    lastCommandUsage.set(player.id, now);
    return false;
}

chat.registerCmd('coords', (player) => {
    let coords = player.pos;
    alt.log(coords + (" from alt console"));
    console.log(coords + " from console");
});
