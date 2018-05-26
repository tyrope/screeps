var logVerbose = false;

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            requireFilling: true,
            role: 'Simba'
        }
    },

    Tick: function(creep){
        // Are we in the process of refilling?
        if(creep.memory.requireFilling){
            // We full yet?
            if(creep.carry.energy < creep.carryCapacity){
                // Nope, go mine.
                let sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                    // Not close enough, go to the source.
                    creep.moveTo(sources[0], {
                        visualizePathStyle: {
                            stroke: '#ffa500'}
                    });
                }
            }else{
                // Job done!
                creep.memory.requireFilling = false;
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
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: {stroke:'#00ff00'}
                });
            }
        }
    }
}

