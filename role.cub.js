var logVerbose = false;

var Config = require('config');
var Pathfinding = require('pathfinding');

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            activePath: {},
            role: 'Cub'
        }
    },

    Tick: function(creep){
        // We moving?
        if(creep.memory.activePath.length){
            if(logVerbose){
                console.log('role.cub::Tick::Continuing move.');
            }
            //Yup, so move.
            let loc = creep.memory.activePath[0];
            let mv = creep.move(creep.pos.getDirectionTo(loc.x,loc.y));
            if(mv == OK){
                // This move was completed, delete it.
                creep.memory.activePath = _.drop(creep.memory.activePath);
            }else if(mv != ERR_TIRED){
                console.log(creep.name+'::Trying to move to but can\'t. error code: '+mv);
            }
            return;
        }

        // We full?
        if(creep.carry.energy < creep.carryCapacity){
            if(logVerbose){
                console.log('role.cub::Tick::Storage not full.');
            }
            //Nope, go fetch.
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                if(logVerbose){
                    console.log('role.cub::Tick::Moving to Source.');
                }
                // Not close enough, go there.
                creep.memory.activePath = Pathfinding.findPath(
                    creep.pos,
                    {
                        pos: sources[0].pos,
                        range: 1
                    }
                );
            }
        }else{
            // Find a place that needs energy.
            if(logVerbose){
                console.log('role.cub::Tick::Storage full.');
            }
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.energy < structure.energyCapacity
                }
            });
            if(targets.length){
                if(logVerbose){
                    console.log('role.cub::Tick::Deposit destination located.');
                }
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.memory.activePath = Pathfinding.findPath(
                        creep.pos,
                        {
                            pos: targets[0].pos,
                            range: 1
                        }
                    );
                }
            }else{
                // What about storages?
                creep.say('Idling...');
                creep.memory.activePath = Pathfinding.findPath(
                    creep.pos,
                    {
                        pos: Config.IdleArea,
                        range: 1
                    }
                );
            }
        }
    }
}

