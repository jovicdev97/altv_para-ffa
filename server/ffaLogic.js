/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';

export function equipFFAWeapon(player) {
    if (!player.hasSyncedMeta('isInFFA') || !player.getSyncedMeta('isInFFA')) {
        alt.log(`Player ${player.name} is not in FFA mode.`);
        return;
    }

    try {
        player.giveWeapon(alt.hash('WEAPON_PISTOL'), 250, true);
        alt.log(`${player.name} has been equipped with a pistol for FFA.`);
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
