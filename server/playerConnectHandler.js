/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { LOBBY_POSITION, LOBBY_DIMENSION, FFA_DIMENSION } from '../helper/coords.js';
import { npcPos1, npcPos2 } from '../helper/npcPos.js';

export function handlePlayerConnect(player) {
    player.spawn(LOBBY_POSITION.x, LOBBY_POSITION.y, LOBBY_POSITION.z, 0);
    createNPC();
    player.dimension = LOBBY_DIMENSION;
    player.setSyncedMeta('isInFFA', false);
    logPlayerInfo(player, "connected and teleported to the lobby");
}

export function handlePlayerDisconnect(player) {
    logPlayerInfo(player, "disconnected");
}

export function logPlayerInfo(player, action) {
    const info = {
        name: player.name,
        id: player.id,
        pos: player.pos,
        dimension: player.dimension,
        health: player.health,
        armour: player.armour,
        ping: player.ping,
        isInFFA: player.getSyncedMeta('isInFFA')
    };

    alt.log(`[${action.toUpperCase()}] Player Info:`, JSON.stringify(info, null, 4));
}

// create npc test
const createNPC = () => {
    try {
        const npc1 = new alt.Ped('S_M_Y_PestCont_01', npcPos1, 0);
        npc1.dimension = LOBBY_DIMENSION;

        const npc2 = new alt.Ped('S_M_Y_PestCont_01', npcPos2, 0);
        npc2.dimension = FFA_DIMENSION;
        if (!npc1 || !npc2) {
            console.error('Error: NPC could not be created.');
            return;
        }
        
        npc1.dimension = LOBBY_DIMENSION;
        npc2.dimension = FFA_DIMENSION;

        npc1.setMeta('visible', true);
        npc2.setMeta('visible', true);
        
    } catch (error) {
        console.error(error);
    }
}