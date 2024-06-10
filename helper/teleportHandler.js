import * as alt from 'alt-server';
import { logPlayerInfo } from '../server/playerConnectHandler.js';

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
