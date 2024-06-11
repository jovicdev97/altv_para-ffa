/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import db from '../helper/mysql/db.js';
import { loadConfig } from '../helper/configLoader.js';

const config = loadConfig('configs/positions.json');
const LOBBY_POSITION = config.lobbyPosition;
const LOBBY_DIMENSION = config.lobbyDimension;

function getZoneByDimension(dimension) {
    return config.zones.find(zone => zone.ffaDimension === dimension);
}

function updatePlayerStats(player, killer) {
    db.query('UPDATE players SET deaths = deaths + 1 WHERE socialid = ? OR discordid = ?', [player.socialID, player.discordID], (err) => {
        if (err) {
            console.error('Error updating deaths in the database:', err);
            return;
        }
        console.log(`Updated deaths for player ${player.name}.`);
    });

    if (killer && killer.valid && killer instanceof alt.Player) {
        db.query('UPDATE players SET kills = kills + 1 WHERE socialid = ? OR discordid = ?', [killer.socialID, killer.discordID], (err) => {
            if (err) {
                console.error('Error updating kills in the database:', err);
                return;
            }
            console.log(`Updated kills for player ${killer.name}.`);
        });
    } else {
        alt.log('Killer is not a valid player. Kills not updated.');
    }
}

function determineRespawnPoint(player) {
    if (player.dimension === LOBBY_DIMENSION) {
        return { position: LOBBY_POSITION, dimension: LOBBY_DIMENSION };
    }

    let zone = getZoneByDimension(player.dimension);
    if (zone) {
        return { position: zone.ffaPosition, dimension: zone.ffaDimension };
    } else {
        return { position: LOBBY_POSITION, dimension: LOBBY_DIMENSION };
    }
}

function respawnPlayer(player, respawnPoint) {
    const respawnDelay = 3100;
    alt.setTimeout(() => {
        if (!player || !player.valid) return;

        player.dimension = respawnPoint.dimension;
        player.spawn(respawnPoint.position.x, respawnPoint.position.y, respawnPoint.position.z, 0);
        player.health = 200;
        alt.log(`${player.name} has respawned at ${respawnPoint.position.x}, ${respawnPoint.position.y}, ${respawnPoint.position.z} in dimension ${respawnPoint.dimension}`);
    }, respawnDelay);
}

export function handlePlayerDeath(player, killer, reason) {
    alt.log(`${player.name} was killed by ${killer ? killer.name : 'unknown'} (Reason: ${reason})`);
    
    updatePlayerStats(player, killer);

    const respawnPoint = determineRespawnPoint(player);
    respawnPlayer(player, respawnPoint);
}
