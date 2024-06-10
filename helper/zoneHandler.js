import * as alt from 'alt-server';
import { teleportPlayer } from '../helper/teleportHandler.js';
import { removeFFAWeapon } from '../server/ffaLogic.js';
import { loadConfig } from '../helper/configLoader.js';

const config = loadConfig('configs/positions.json');
const LOBBY_POSITION = config.lobbyPosition;
const LOBBY_DIMENSION = config.lobbyDimension;

export function createFFAZone(zoneConfig) {
    const { ffaDimension, ffaColshape, ffaMarker } = zoneConfig;

    const colshape = new alt.ColshapeCircle(ffaColshape.x, ffaColshape.y, ffaColshape.radius); // create colshape
    colshape.dimension = ffaDimension;

    alt.on('entityEnterColshape', (shape, entity) => {
        if (entity instanceof alt.Player && shape === colshape && entity.dimension === ffaDimension) {
            alt.log(`${entity.name} entered the FFA zone: ${zoneConfig.name}`);
            alt.emitClient(entity, 'entityEnterColshape');
        }
    });

    alt.on('entityLeaveColshape', (shape, entity) => {
        if (entity instanceof alt.Player && shape === colshape && entity.dimension === ffaDimension) {
            alt.log(`${entity.name} leaving the FFA zone: ${zoneConfig.name}`);
            teleportPlayer(entity, LOBBY_POSITION, LOBBY_DIMENSION); // tp back to lobby
            entity.setSyncedMeta('isInFFA', false);
            removeFFAWeapon(entity);
            alt.log(`${entity.name} left the FFA zone: ${zoneConfig.name}`);
            alt.emitClient(entity, 'entityLeaveColshape');
        }
    });

    // create marker
    alt.Player.all.forEach(player => {
        alt.emitClient(player, 'createMarker', {
            type: ffaMarker.type,
            position: ffaColshape,
            scale: ffaMarker.scale,
            color: ffaMarker.color,
            dimension: ffaDimension
        });
    });

    alt.log(`FFA zone ${zoneConfig.name} created with Colshape and Marker.`);
}
