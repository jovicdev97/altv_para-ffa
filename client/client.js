/// <reference types="@altv/types-client" />
import alt from 'alt-client';

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