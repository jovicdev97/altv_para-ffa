/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import mysql from 'mysql2';
import { loadConfig } from '../helper/configLoader.js';

const config = loadConfig('configs/positions.json');
const LOBBY_POSITION = config.lobbyPosition;
const LOBBY_DIMENSION = config.lobbyDimension;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'altv',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const db = pool.promise();

export async function handlePlayerConnect(player) {
    try {
        const socialId = player.socialID || 'unknown';
        const discordId = player.discordID || 'unknown';

        const [results] = await db.query(
            'SELECT * FROM players WHERE socialid = ? OR discordid = ?',
            [socialId, discordId]
        );

        if (results.length === 0) {
            await db.query(
                'INSERT INTO players (socialid, discordid, name) VALUES (?, ?, ?)',
                [socialId, discordId, player.name]
            );
            console.log(`New player ${player.name} added to the database.`);
        } else {
            const dbPlayer = results[0];
            if (dbPlayer.socialid === socialId && dbPlayer.discordid === discordId) {
                if (dbPlayer.name !== player.name) {
                    await db.query(
                        'UPDATE players SET name = ? WHERE socialid = ? AND discordid = ?',
                        [player.name, socialId, discordId]
                    );
                    console.log(`Player ${player.name} reconnected with updated name.`);
                } else {
                    console.log(`Player ${player.name} reconnected.`);
                }
            } else {
                console.log(`Duplicate player found: ${player.name} with socialId: ${socialId} and discordId: ${discordId}`);
            }
        }

        player.spawn(LOBBY_POSITION.x, LOBBY_POSITION.y, LOBBY_POSITION.z, 0);
        player.dimension = LOBBY_DIMENSION;
        player.setSyncedMeta('isInFFA', false);
        createMarkersForPlayer(player);
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
