/// <reference types="@altv/types-server" />
import alt from 'alt-server';

alt.on('playerDamage', handlePlayerDamage);

export function handlePlayerDamage(target, attacker, damage, weaponHash, bodyPart) {
    if (attacker && target !== attacker) {
        alt.log(`${attacker.name} hat ${target.name} getroffen und ${damage} Schaden verursacht. (Waffe: ${weaponHash}, Bodypart: ${bodyPart}, New-HP: ${target.health - damage}, Old-HP: ${target.health},`);
        if (target.health - damage <= 0) {
            console.log("Target: " + target, "Attacker: " + attacker);
        }
    }
}
