/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import db from '../helper/mysql/db.js';
import { loadConfig } from '../helper/configLoader.js';
import { createNPC } from '../helper/npcHandler.js';

const config = loadConfig('configs/positions.json');
const LOBBY_POSITION = config.lobbyPosition;
const LOBBY_DIMENSION = config.lobbyDimension;
const { ffaPosition: FFA_POSITION, ffaDimension: FFA_DIMENSION } = config.zones[0];
const [npcPos1, npcPos2] = config.npc_positions;

export async function handlePlayerConnect(player) {
    try {
        const socialId = player.socialID || 'unknown';
        const discordId = player.discordID || 'unknown';

        const [results] = await db.promise().query(
            'SELECT * FROM players WHERE socialid = ? OR discordid = ?',
            [socialId, discordId]
        );

        if (results.length === 0) {
            await db.promise().query(
                'INSERT INTO players (socialid, discordid, name) VALUES (?, ?, ?)',
                [socialId, discordId, player.name]
            );
            console.log(`New player ${player.name} added to the database.`);
        } else {
            const dbPlayer = results[0];
            if (dbPlayer.socialid !== socialId || dbPlayer.discordid !== discordId) {
                await db.promise().query(
                    'INSERT INTO players (socialid, discordid, name) VALUES (?, ?, ?)',
                    [socialId, discordId, player.name]
                );
                console.log(`Player ${player.name} has new IDs and was added to the database.`);
            } else {
                if (dbPlayer.name !== player.name) {
                    await db.promise().query(
                        'UPDATE players SET name = ? WHERE socialid = ? OR discordid = ?',
                        [player.name, socialId, discordId]
                    );
                    console.log(`Player ${player.name} reconnected with updated name.`);
                } else {
                    console.log(`Player ${player.name} reconnected.`);
                }
            }
        }

        player.spawn(LOBBY_POSITION.x, LOBBY_POSITION.y, LOBBY_POSITION.z, 0);
        createMarkersForPlayer(player);
        createNPC();
        player.dimension = LOBBY_DIMENSION;
        player.setSyncedMeta('isInFFA', false);
        logPlayerInfo(player, "connected and teleported to the lobby");

    } catch (err) {
        console.error('Error handling player connect:', err);
    }
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
        isInFFA: player.getSyncedMeta('isInFFA'),
        socialId: player.socialID,
        discordId: player.discordID
    };

    alt.log(`[${action.toUpperCase()}] Player Info:`, JSON.stringify(info, null, 4));
}

// create npc test
/* const createNPC = () => {
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
} */

function createMarkersForPlayer(player) {
    if (config.zones && Array.isArray(config.zones)) {
        config.zones.forEach(zone => {
            const markerConfig = zone.ffaMarker;
            const position = zone.ffaColshape;
            const posX = position.x;
            const posY = position.y;
            const posZ = position.z || 0;

            alt.emitClient(player, 'createMarker', {
                type: markerConfig.type,
                position: { x: posX, y: posY, z: posZ },
                scale: markerConfig.scale,
                color: markerConfig.color,
                dimension: zone.ffaDimension
            });

            alt.log(`Emitting createMarker event for player: ${player.name} with config: ${JSON.stringify(markerConfig)}`);
        });
    }
}