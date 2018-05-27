var Config = require('config');
var Pathfinding = require('pathfinding');

var move = function(creep){
    let loc = creep.memory.activePath[0];
    let mv = creep.move(creep.pos.getDirectionTo(loc.x,loc.y));
    if(mv == OK){
        // This move was completed, delete it.
        creep.memory.activePath = _.drop(creep.memory.activePath);
    }else if(mv != ERR_TIRED){
        console.log(creep.name+'::Trying to move to but can\'t. error code: '+mv);
    }
}

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
            move(creep);
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

