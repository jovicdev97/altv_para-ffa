import * as alt from 'alt-client';
import * as native from 'natives';

const teleportMenuURL = 'http://resource/client/html/teleportMenu.html';
let webView = null;

/* dont do this */
alt.onServer('openTeleportMenu', () => {
    const player = alt.Player.local;
    if (webView === null && player.valid && player.dimension === 0) {
        webView = new alt.WebView(teleportMenuURL);
        webView.focus();
        alt.showCursor(true);
        alt.toggleGameControls(false);
        
        webView.on('teleportPlayer', handleTeleport);
        webView.on('closeMenu', handleCloseMenu);
    }
});

function handleTeleport(location) {
    let position;
    switch (location) {
        case 'Airport':
            position = { x: -1034.6, y: -2733.6, z: 13.8 };
            break;
        case 'Vinewood Sign':
            position = { x: 709.7, y: 1180.9, z: 325.0 };
            break;
        case 'Mount Chiliad':
            position = { x: 501.5, y: 5604.8, z: 796.9 };
            break;
        default:
            position = null;
            break;
    }
    
    if (position) {
        alt.emitServer('teleportPlayerToLocation', position);
    }
    closeMenuSafely();
}

function handleCloseMenu() {
    closeMenuSafely();
}

function closeMenuSafely() {
    if (webView !== null) {
        webView.destroy();
        webView = null;
    }
    alt.showCursor(false);
    alt.toggleGameControls(true);
}

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