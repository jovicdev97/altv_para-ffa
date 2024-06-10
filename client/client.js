// client.js
import * as alt from 'alt-client';
import { handleSyncedMetaChange } from './handleSyncedMetaChange.js';
import { handleEntityEnterColshape, handleEntityLeaveColshape, handleCreateMarker } from './zoneHandler.js';

// Listen for synced meta changes : log FFA status
alt.on('syncedMetaChange', handleSyncedMetaChange);

// Listen for server events : colshape entry and exit
alt.onServer('entityEnterColshape', handleEntityEnterColshape);
alt.onServer('entityLeaveColshape', handleEntityLeaveColshape);

// Listen for server event : create Marker
alt.onServer('createMarker', handleCreateMarker);
