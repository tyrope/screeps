var Config = require('config');
var Pathfinding = require('pathfinding');

module.exports = {
    Body: [MOVE],

    Mem: {
        memory: {
            activePath: {},
            role: 'Scar'
        }
    },

    Tick: function(creep){
        // Try to be recycled.
        if(Game.spawns[Config.SpawnName].recycleCreep(creep) == ERR_NOT_IN_RANGE){
            // Didn't work, get closer.
            creep.memory.activePath = Pathfinding.findPath(
                creep.pos,
                {
                    pos: Game.spawns[Config.SpawnName].pos,
                    range: 1
                }
            );
        }
    }
}

