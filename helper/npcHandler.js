import * as alt from 'alt-server';
import { loadConfig } from '../helper/configLoader.js';

const config = loadConfig('configs/positions.json');

if (config && config.npc_positions) {
    config.npc_positions.forEach(pos => {
        createNPC(pos);
    });
}

export function createNPC(position) {
    try {
        const npc = new alt.Ped('S_M_Y_PestCont_01', position, 0);
        npc.dimension = position.dimension || 0;
        npc.setMeta('visible', true);
        alt.log(`NPC created at (${position.x}, ${position.y}, ${position.z}) in dimension ${npc.dimension}`);
    } catch (error) {
        console.error('Error creating NPC:', error);
    }
}
