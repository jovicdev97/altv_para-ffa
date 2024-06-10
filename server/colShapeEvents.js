import * as alt from 'alt-server';
import { logPlayerInfo } from './playerConnectHandler.js';
import { equipFFAWeapon, removeFFAWeapon } from './ffaLogic.js';
import { loadConfig } from '../helper/configLoader.js';
import { teleportPlayer } from '../helper/teleportHandler.js';

const config = loadConfig('configs/positions.json');
const LOBBY_POSITION = config.lobbyPosition;
const LOBBY_DIMENSION = config.lobbyDimension;

// COLSHAPE EVENTS FOR PLAYER LEAVING THE FFA AREA

/* config.zones.forEach(zone => {
    const ffaColShape = new alt.ColshapeCircle(zone.ffaColshape.x, zone.ffaColshape.y, zone.ffaColshape.radius);
    ffaColShape.dimension = zone.ffaDimension;

    alt.on('entityEnterColshape', (colshape, entity) => {
        if (entity instanceof alt.Player && colshape === ffaColShape && entity.dimension === zone.ffaDimension) {
            alt.log(`${entity.name} entered the FFA zone: ${zone.name}`);
            alt.emitClient(entity, 'entityEnterColshape');
        }
    });

    alt.on('entityLeaveColshape', (colshape, entity) => {
        if (entity instanceof alt.Player && colshape === ffaColShape && entity.dimension === zone.ffaDimension) {
            alt.log(`${entity.name} leaving the FFA zone: ${zone.name}`);
            teleportPlayer(entity, LOBBY_POSITION, LOBBY_DIMENSION);
            entity.setSyncedMeta('isInFFA', false);
            removeFFAWeapon(entity);
            logPlayerInfo(entity, `exited the ${zone.name}`);
            alt.log(`${entity.name} left the FFA zone: ${zone.name}`);
            alt.emitClient(entity, 'entityLeaveColshape');
        }
    });
}); */
