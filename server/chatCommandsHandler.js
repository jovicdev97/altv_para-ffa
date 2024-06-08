import * as chat from 'alt:chat';
import * as alt from 'alt-server';
import { logPlayerInfo } from './playerConnectHandler.js';
import { LOBBY_POSITION, FFA_POSITION, FFA_DIMENSION, LOBBY_DIMENSION } from '../helper/coords.js';
import { equipFFAWeapon, removeFFAWeapon } from './ffaLogic.js';

export function registerChatCommands() {
    chat.registerCmd('ffa', handleFFACommand);
    chat.registerCmd('exitffa', handleExitFFACommand);
    chat.registerCmd('teleport', handleTeleportCommand); // Register teleport command
}

export function handleFFACommand(player) {
    if (isRateLimited(player)) {
        alt.log(`${player.name} is rate limited from using /ffa command too frequently.`);
        return;
    }

    teleportPlayer(player, FFA_POSITION, 1);
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

export function handleTeleportCommand(player) {
    if (player.valid && player.dimension === LOBBY_DIMENSION) {
        alt.emitClient(player, 'openTeleportMenu');
    } else {
        alt.log(`${player.name} cannot open teleport menu. Player is either invalid or not in the lobby dimension.`);
    }
}

export function teleportPlayer(player, position, dimension) {
    player.pos = new alt.Vector3(position.x, position.y, position.z);
    if (dimension !== undefined) {
        player.dimension = dimension;
        alt.log(`${player.name} dimension set to ${dimension}`);
    } else {
        alt.log(`${player.name} dimension not changed`);
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

// COLSHAPE EVENTS FOR PLAYER LEAVING THE FFA AREA

const lastCommandUsage = new Map();
const ffaColShape = new alt.ColshapeCircle(FFA_POSITION.x, FFA_POSITION.y, 50);
ffaColShape.dimension = 1;

alt.on('entityEnterColshape', (colshape, entity) => {
    if (entity instanceof alt.Player && colshape === ffaColShape && entity.dimension === 1) {
        alt.log(`${entity.name} entered the FFA zone in dimension ${entity.dimension}`);
        alt.emitClient(entity, 'entityEnterColshape');
    }
});

alt.on('entityLeaveColshape', (colshape, entity) => {
    if (entity instanceof alt.Player && colshape === ffaColShape && entity.dimension === 1) {
        alt.log(`${entity.name} leaving the FFA zone in dimension ${entity.dimension}`);
        teleportPlayer(entity, LOBBY_POSITION, LOBBY_DIMENSION);
        entity.setSyncedMeta('isInFFA', false);
        removeFFAWeapon(entity);
        logPlayerInfo(entity, "exited the FFA zone");
        alt.log(`${entity.name} left the FFA zone`);
        alt.emitClient(entity, 'entityLeaveColshape');
    }
});
