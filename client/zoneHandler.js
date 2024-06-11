import * as alt from 'alt-client';

export function handleEntityEnterColshape() {
    console.log('Entity entered FFA colshape');
}

export function handleEntityLeaveColshape() {
    console.log('Entity left FFA colshape');
}

export function handleCreateMarker(markerConfig) {
    console.log(`Received createMarker event with config: ${JSON.stringify(markerConfig)}`);
    const position = markerConfig.position;
    console.log(`Creating marker at position: ${JSON.stringify(position)}`);
    createMarker(markerConfig);
    console.log(`Marker created at (${position.x}, ${position.y}, ${position.z}) with scale ${markerConfig.scale} and color ${markerConfig.color}`);
}

function createMarker(markerConfig) {
    const position = markerConfig.position;
    const marker = new alt.Marker(
        markerConfig.type,
        new alt.Vector3(position.x, position.y, position.z),
        new alt.RGBA(markerConfig.color[0], markerConfig.color[1], markerConfig.color[2], markerConfig.color[3]),
        true,
        markerConfig.scale[0]
    );
    marker.dimension = markerConfig.dimension;
    marker.scale = new alt.Vector3(markerConfig.scale[0], markerConfig.scale[1], markerConfig.scale[2]);
}
