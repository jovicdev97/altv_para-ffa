import * as alt from 'alt-server';
import * as chat from 'alt:chat';
import { handleFFACommand, handleExitFFACommand } from './ffaCommands.js';
import '../colShapeEvents.js';

export function registerChatCommands() {
    chat.registerCmd('ffa', handleFFACommand);
    chat.registerCmd('exitffa', handleExitFFACommand);
    chat.registerCmd('webview', handleWebViewCommand);
}

chat.registerCmd('coords', (player) => {
    let coords = player.pos;
    alt.log(coords + " from alt console");
    console.log(coords + " from console");
});

const webviewUrl = 'http://resource/client/html/index.html';
function handleWebViewCommand(player) {
    alt.log('Received /webview command from player:', player.name);
    alt.emitClient(player, 'showWebView', webviewUrl);
}
