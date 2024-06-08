/// <reference types="@altv/types-server" />
import * as chat from 'alt:chat';
import * as alt from 'alt-server';
import { logPlayerInfo } from './playerConnectHandler.js';
import { LOBBY_POSITION, FFA_POSITION, FFA_DIMENSION, LOBBY_DIMENSION } from '../helper/coords.js';


export function registerChatCommands() {
    chat.registerCmd('ffa', handleFFACommand);
    chat.registerCmd('exitffa', handleExitFFACommand);
}

export function handleFFACommand(player) {
    teleportPlayer(player, FFA_POSITION, FFA_DIMENSION);
    player.setSyncedMeta('isInFFA', true);
    logPlayerInfo(player, "joined the FFA zone");
}

export function handleExitFFACommand(player) {
    teleportPlayer(player, LOBBY_POSITION, LOBBY_DIMENSION);
    player.setSyncedMeta('isInFFA', false);
    logPlayerInfo(player, "exited the FFA zone");
}

export function teleportPlayer(player, position, dimension) {
    player.pos = new alt.Vector3(position.x, position.y, position.z);
    if (dimension !== undefined) {
        player.dimension = dimension;
    }
    logPlayerInfo(player, `teleported to ${JSON.stringify(position)}`);
}

chat.registerCmd('coords', (player) => {
    console.log("erstelle koordinaten");
    let coords = player.pos;
    alt.log(coords + ("von alt konsole"));
    console.log(coords + "von konsole")
})
