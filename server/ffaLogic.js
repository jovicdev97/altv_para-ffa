import * as alt from 'alt-server';
import { loadConfig } from '../helper/configLoader.js';
import '../helper/npcHandler.js';

const positionsConfig = loadConfig('configs/positions.json');

function getZoneByPlayerDimension(player) {
    for (let zone of positionsConfig.zones) {
        if (player.dimension === zone.ffaDimension) {
            return zone;
        }
    }
    return null;
}

export function equipFFAWeapon(player) {
    if (!player.hasSyncedMeta('isInFFA') || !player.getSyncedMeta('isInFFA')) {
        alt.log(`Player ${player.name} is not in FFA mode.`);
        return;
    }

    const zone = getZoneByPlayerDimension(player);

    if (!zone) {
        alt.log(`No zone found for player ${player.name}`);
        return;
    }

    try {
        player.removeAllWeapons();
        alt.log(`All weapons removed for player ${player.name} before equipping FFA weapons.`);

        for (let weapon of zone.weapons) {
            player.giveWeapon(alt.hash(weapon.name), weapon.ammo, true);
            alt.log(`${player.name} has been equipped with ${weapon.name} (${weapon.ammo} ammo) for FFA.`);
        }
    } catch (err) {
        console.error(`Error equipping weapon for ${player.name}:`, err);
    }
}

export function removeFFAWeapon(player) {
    if (player.hasSyncedMeta('isInFFA') && player.getSyncedMeta('isInFFA')) {
        alt.log(`Player ${player.name} is still in FFA mode.`);
        return;
    }

    try {
        player.removeAllWeapons();
        alt.log(`${player.name}'s weapons have been removed after exiting FFA.`);
    } catch (err) {
        console.error(`Error removing weapons for ${player.name}:`, err);
    }
}