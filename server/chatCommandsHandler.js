import * as chat from 'alt:chat';
import * as alt from 'alt-server';
import { logPlayerInfo } from './playerConnectHandler.js';
import { equipFFAWeapon, removeFFAWeapon } from './ffaLogic.js';
import { loadConfig } from '../helper/configLoader.js';
import { teleportPlayer } from '../helper/teleportHandler.js';

const config = loadConfig('configs/positions.json');
const LOBBY_POSITION = config.lobbyPosition;
const LOBBY_DIMENSION = config.lobbyDimension;

export function registerChatCommands() {
    chat.registerCmd('ffa', handleFFACommand);
    chat.registerCmd('exitffa', handleExitFFACommand);
    chat.registerCmd('teleport', handleTeleportCommand);
}

export function handleFFACommand(player, args) {
    let zoneName = args.length > 0 ? args[0] : "1";
    let zone = config.zones.find(z => z.name === zoneName);
    if (!zone) {
        alt.log(`FFA Zone ${zoneName} not found in config, defaulting to Zone 1`);
        zoneName = "1";
        zone = config.zones.find(z => z.name === zoneName);
        if (!zone) {
            alt.log(`Default FFA Zone 1 not found in config`);
            return;
        }
    }

    if (isRateLimited(player)) {
        alt.log(`${player.name} is rate limited from using /ffa command too frequently.`);
        return;
    }

    teleportPlayer(player, zone.ffaPosition, zone.ffaDimension);
    player.setSyncedMeta('isInFFA', true);
    equipFFAWeapon(player);
    logPlayerInfo(player, `joined the FFA zone ${zone.name}`);
}

export function handleExitFFACommand(player) {
    if (isRateLimited(player)) {
        alt.log(`${player.name} is rate limited from using /exitffa command too frequently.`);
        return;
    }

    teleportPlayer(player, LOBBY_POSITION, LOBBY_DIMENSION);
    player.setSyncedMeta('isInFFA', false);
    removeFFAWeapon(player);
    logPlayerInfo(player, "exited the FFA zone");
}

export function handleTeleportCommand(player) {
    if (player.valid && player.dimension === LOBBY_DIMENSION) {
        alt.emitClient(player, 'openTeleportMenu');
    } else {
        alt.log(`${player.name} cannot open teleport menu. Player is either invalid or not in the lobby dimension.`);
    }
}

function isRateLimited(player) {
    const now = Date.now();
    if (lastCommandUsage.has(player.id) && now - lastCommandUsage.get(player.id) < 5000) {
        return true;
    }
    lastCommandUsage.set(player.id, now);
    return false;
}

chat.registerCmd('coords', (player) => {
    let coords = player.pos;
    alt.log(coords + (" from alt console"));
    console.log(coords + " from console");
});

// COLSHAPE EVENTS FOR PLAYER LEAVING THE FFA AREA

const lastCommandUsage = new Map();

config.zones.forEach(zone => {
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
});
