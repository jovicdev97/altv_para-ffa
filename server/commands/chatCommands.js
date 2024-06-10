import * as chat from 'alt:chat';
import { handleFFACommand, handleExitFFACommand} from './ffaCommands.js';
import '../colShapeEvents.js';

export function registerChatCommands() {
    chat.registerCmd('ffa', handleFFACommand);
    chat.registerCmd('exitffa', handleExitFFACommand);
}

chat.registerCmd('coords', (player) => {
    let coords = player.pos;
    alt.log(coords + (" from alt console"));
    console.log(coords + " from console");
});
