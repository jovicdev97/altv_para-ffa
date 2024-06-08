/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import * as native from 'natives';

/* dont do this */

const FFA_CENTER = { x: -833.4594, y: -443.9868, z: 36.6263 };
const FFA_RADIUS = 100;
const LOBBY_POSITION = { x: -833.4594, y: -443.9868, z: 36.6263 };
const FFA_POSITION = { x: -833.4594, y: -443.9868, z: 38.6263 };
const FFA_DIMENSION = 1;
const LOBBY_DIMENSION = 0;
const FFA_COLOR = { r: 255, g: 0, b: 0, a: 100 };

alt.on('syncedMetaChange', handleSyncedMetaChange);

function handleSyncedMetaChange(entity, key, value) {
    if (entity === alt.Player.local && key === 'isInFFA') {
        if (value) {
            console.log('Spieler ist nun in FFA');
        } else {
            console.log('Spieler ist nicht mehr in FFA');
        }
    }
}

alt.onServer('entityEnterColshape', () => {
    console.log('Entity entered FFA colshape');
});

alt.onServer('entityLeaveColshape', () => {
    console.log('Entity left FFA colshape');
});

const marker = new alt.Marker(28, new alt.Vector3(-833.4594,-443.9868,36.6263), new alt.RGBA(255, 255, 255, 255), true, 100.0);
marker.dimension = 1;
marker.scale = new alt.Vector3(50, 50, 50);