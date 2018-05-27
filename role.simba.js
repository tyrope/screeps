var Pathfinding = require('pathfinding');

var move = function(creep){
    let loc = creep.memory.activePath[0];
    let mv = creep.move(creep.pos.getDirectionTo(loc.x,loc.y));
    if(mv == OK){
        // This move was completed, delete it from our path.
        creep.memory.activePath = _.drop(creep.memory.activePath);
    }else if(mv != ERR_TIRED){
        // We couldn't move, and it wasn't because we were tired.
        console.log(creep.name+'::Trying to move to but can\'t. error code: '+mv);
    }
}

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            activePath: {},
            requireFilling: true,
            role: 'Simba'
        }
    },

    Tick: function(creep){
        // We moving?
        if(creep.memory.activePath.length){
            move(creep);
            return;
        }

        // Are we in the process of refilling?
        if(creep.memory.requireFilling){
            // We full yet?
            if(creep.carry.energy == creep.carryCapacity){
                // Job Done!
                creep.memory.requireFilling = false;
                return;
            }
            // TODO: Are there storages or containers we can take from?
            // Nope, go mine.
            let sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                // Not close enough, go to the source.
                creep.memory.activePath = Pathfinding.findPath(
                    creep.pos,
                    {
                        pos: sources[0].pos,
                        range: 1
                    }
                );
            }
        }else{
            if(creep.carry.energy == 0){
                // Actually... we're empty.
                creep.memory.requireFilling = true;
                return;
            }
            // So we've got stuffs and we're not refilling. Deposit!
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                // We're not there yet...
                creep.memory.activePath = Pathfinding.findPath(
                    creep.pos,
                    {
                        pos: creep.room.controller.pos,
                        range: 3
                    }
                );
            }
        }
    }
}

