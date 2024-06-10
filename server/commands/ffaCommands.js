// commands gets registed in chatCommands.js
import * as alt from 'alt-server';
import * as chat from 'alt:chat';
import { equipFFAWeapon } from '../ffaLogic.js';
import { logPlayerInfo } from '../playerConnectHandler.js';
import { teleportPlayer } from '../../helper/teleportHandler.js';
import { loadConfig } from '../../helper/configLoader.js';

const config = loadConfig('configs/positions.json');

/* FFA Command: /ffa */

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

/* FFA-Exit Command: /exitffa */

import { removeFFAWeapon } from '../ffaLogic.js';

const LOBBY_POSITION = config.lobbyPosition;
const LOBBY_DIMENSION = config.lobbyDimension;

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

// prevent spamming

const lastCommandUsage = new Map();

function isRateLimited(player) {
    const now = Date.now();
    if (lastCommandUsage.has(player.id) && now - lastCommandUsage.get(player.id) < 5000) {
        return true;
    }
    lastCommandUsage.set(player.id, now);
    return false;
}