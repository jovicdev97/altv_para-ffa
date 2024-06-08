/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { LOBBY_POSITION, LOBBY_DIMENSION, FFA_DIMENSION } from '../helper/coords.js';
import { npcPos1, npcPos2 } from '../helper/npcPos.js';
import db from '../helper/mysql/db.js';

export function handlePlayerConnect(player) {
    db.query('SELECT * FROM players WHERE name = ?', [player.name], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return;
        }
        if (results.length === 0) {
            db.query('INSERT INTO players (name) VALUES (?)', [player.name], (err) => {
                if (err) {
                    console.error('Error inserting player into database:', err);
                    return;
                }
                console.log(`New player ${player.name} added to the database.`);
            });
        } else {
            console.log(`Player ${player.name} exists in the database.`);
        }
    });

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