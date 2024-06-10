import * as alt from 'alt-client';

export function handleSyncedMetaChange(entity, key, value) {
    if (entity === alt.Player.local && key === 'isInFFA') {
        if (value) {
            console.log('Player is now in FFA');
        } else {
            console.log('Player is no longer in FFA');
        }
    }
}
