var Config = require('config');
var Pathfinding = require('pathfinding');
var TM = require('taskMaster');

module.exports = {
    Body: [MOVE],

    Mem: {
        memory: {
            activePath: {},
            role: 'Scar'
        }
    },

    Tick: function(creep){
        // We moving?
        if(creep.memory.activePath.length){
            TM.Move(creep);
            return;
        }

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

