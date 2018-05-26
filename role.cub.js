var Config = require('config');

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            role: 'Cub'
        }
    },

    Tick: function(creep){
        // We full?
        if(creep.carry.energy < creep.carryCapacity){
            //Nope, go fetch.
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                // Not close enough, go there.
                creep.moveTo(sources[0], {
                    visualizePathStyle: {
                        stroke: '#00ff00'}
                });
            }
        }else{
            // Find a place that needs energy.
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.energy < structure.energyCapacity
                }
            });
            if(targets.length){
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: '#00ff00'
                        }
                    });
                }
            }else{
                // What about storages?
                creep.say('Idling...');
                creep.moveTo(
                    Config.IdleArea.x, Config.IdleArea.y, {
                        visualizePathStyle: {
                            stroke: '#ff0000'
                        }
                    }
                );
            }
        }
    }
}

