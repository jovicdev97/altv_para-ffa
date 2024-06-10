import * as alt from 'alt-client';
/* import * as native from 'natives'; */

// Listen for synced meta changes : log FFA status
alt.on('syncedMetaChange', handleSyncedMetaChange);

function handleSyncedMetaChange(entity, key, value) {
    if (entity === alt.Player.local && key === 'isInFFA') {
        if (value) {
            console.log('Player is now in FFA');
        } else {
            console.log('Player is no longer in FFA');
        }
    }
}

// Listen for server events : colshape entry and exit
alt.onServer('entityEnterColshape', () => {
    console.log('Entity entered FFA colshape');
});

alt.onServer('entityLeaveColshape', () => {
    console.log('Entity left FFA colshape');
});

// Listen for server event : create Marker
alt.onServer('createMarker', (markerConfig) => {
    console.log(`Received createMarker event with config: ${JSON.stringify(markerConfig)}`);
    
    const position = markerConfig.position;
    console.log(`Creating marker at position: ${JSON.stringify(position)}`);

    const marker = new alt.Marker(
        markerConfig.type,
        new alt.Vector3(position.x, position.y, position.z),
        new alt.RGBA(markerConfig.color[0], markerConfig.color[1], markerConfig.color[2], markerConfig.color[3]),
        true,
        markerConfig.scale[0]
    );
    marker.dimension = markerConfig.dimension;
    marker.scale = new alt.Vector3(markerConfig.scale[0], markerConfig.scale[1], markerConfig.scale[2]);

    console.log(`Marker created at (${position.x}, ${position.y}, ${position.z}) with scale ${markerConfig.scale} and color ${markerConfig.color}`);
});