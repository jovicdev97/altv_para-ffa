/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import { LOBBY_POSITION, FFA_POSITION, FFA_DIMENSION, LOBBY_DIMENSION } from '../helper/coords.js';

alt.on('playerDeath', handlePlayerDeath);

export function handlePlayerDeath(player, killer, reason) {
    alt.log(`${player.name} was killed by ${killer ? killer.name : 'unknown'} (Reason: ${reason})`);
    const respawnDelay = 2000;

    let respawnPoint;
    if (player.dimension === FFA_DIMENSION) {
        respawnPoint = FFA_POSITION;
    } else if (player.dimension === LOBBY_DIMENSION) {
        respawnPoint = LOBBY_POSITION;
    } else {
        respawnPoint = { x: 0, y: 0, z: 0 };
    }

    alt.setTimeout(() => {
        if (!player || !player.valid) return;

        player.spawn(respawnPoint.x, respawnPoint.y, respawnPoint.z, 0);
        player.health = 150;
        alt.log(`${player.name} has respawned at ${respawnPoint.x}, ${respawnPoint.y}, ${respawnPoint.z}`);
    }, respawnDelay);
}

export default {
    handlePlayerDeath
};
