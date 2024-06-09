import * as alt from 'alt-server';

export function createColshapeAndMarker(colshapeConfig, markerConfig) {
    const colShape = new alt.ColshapeCircle(colshapeConfig.x, colshapeConfig.y, colshapeConfig.radius);
    colShape.dimension = 1;

    alt.on('entityEnterColshape', (colshape, entity) => {
        if (entity instanceof alt.Player && colshape === colShape && entity.dimension === 1) {
            alt.log(`${entity.name} entered the FFA zone in dimension ${entity.dimension}`);
            alt.emitClient(entity, 'entityEnterColshape');
        }
    });

    alt.on('entityLeaveColshape', (colshape, entity) => {
        if (entity instanceof alt.Player && colshape === colShape && entity.dimension === 1) {
            alt.log(`${entity.name} leaving the FFA zone in dimension ${entity.dimension}`);
            teleportPlayer(entity, config.lobbyPosition, config.lobbyDimension);
            entity.setSyncedMeta('isInFFA', false);
            removeFFAWeapon(entity);
            logPlayerInfo(entity, "exited the FFA zone");
            alt.log(`${entity.name} left the FFA zone`);
            alt.emitClient(entity, 'entityLeaveColshape');
        }
    });

    alt.emitAllClients('createMarker', markerConfig.type, colshapeConfig.x, colshapeConfig.y, colshapeConfig.z, markerConfig.scale, markerConfig.color);
}

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
