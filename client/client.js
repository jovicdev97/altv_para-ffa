import * as alt from 'alt-client';
import { handleSyncedMetaChange } from './handleSyncedMetaChange.js';
import { handleEntityEnterColshape, handleEntityLeaveColshape, handleCreateMarker } from './zoneHandler.js';

let webview = null;

// Listen for synced meta changes : log FFA status
alt.on('syncedMetaChange', handleSyncedMetaChange);

// Listen for server events : colshape entry and exit
alt.onServer('entityEnterColshape', handleEntityEnterColshape);
alt.onServer('entityLeaveColshape', handleEntityLeaveColshape);

// Listen for server event : create Marker
alt.onServer('createMarker', handleCreateMarker);

alt.onServer('showWebView', (url) => {
    alt.log('Showing webview with URL:', url);
    if (!url) {
        alt.log('Error: URL is undefined');
        return;
    }

    if (webview) return;

    webview = new alt.WebView(url, true);
    webview.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);

    webview.on('closeWebView', () => {
        alt.log('Closing webview');
        alt.showCursor(false);
        alt.toggleGameControls(true);
        webview.destroy();
        webview = null;
    });

    webview.on('joinFFAZone', (zoneName) => {
        alt.emitServer('joinFFAZone', zoneName);
    });
});
