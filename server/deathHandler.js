/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import db from '../helper/mysql/db.js';
import { loadConfig } from '../helper/configLoader.js';

const config = loadConfig('configs/positions.json');
const LOBBY_POSITION = config.lobbyPosition;
const LOBBY_DIMENSION = config.lobbyDimension;
const { ffaPosition: FFA_POSITION, ffaDimension: FFA_DIMENSION } = config.zones[0];


export function handlePlayerDeath(player, killer, reason) {
    alt.log(`${player.name} was killed by ${killer ? killer.name : 'unknown'} (Reason: ${reason})`);
    const respawnDelay = 5000;

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

    let respawnPoint;
    if (player.dimension === FFA_DIMENSION) {
        respawnPoint = FFA_POSITION;
    } else if (player.dimension === LOBBY_DIMENSION) {
        respawnPoint = LOBBY_POSITION;
    } else {
        player.dimension = 0;
        respawnPoint = { x: -833.4594, y: -443.9868, z: 36.6263 };
        player.setSyncedMeta('isInFFA', false);
    }

    alt.setTimeout(() => {
        if (!player || !player.valid) return;

        player.spawn(respawnPoint.x, respawnPoint.y, respawnPoint.z, 0);
        player.health = 200;
        alt.log(`${player.name} has respawned at ${respawnPoint.x}, ${respawnPoint.y}, ${respawnPoint.z}`);
    }, respawnDelay);
}

export default {
    handlePlayerDeath
};
