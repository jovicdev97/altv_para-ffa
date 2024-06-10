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
        const model = position.model || 'S_M_Y_PestCont_01';
        const rotation = position.rotation || { x: 0, y: 0, z: 0 };
        const streamingDistance = position.streamingDistance || undefined;

        const npc = new alt.Ped(model, position, rotation, streamingDistance);
        npc.dimension = position.dimension || 0;  
        npc.setMeta('visible', true);

        alt.log(`NPC created at (${position.x}, ${position.y}, ${position.z}) in dimension ${npc.dimension} with model ${model}`);
    } catch (error) {
        console.error('Error creating NPC:', error);
    }
}
