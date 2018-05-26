module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            requireFilling: true,
            role: 'Sarafina'
        }
    },

    Tick: function(creep){
        // Are we in the process of refilling?
        if(creep.memory.requireFilling){
            // We full yet?
            if(creep.carry.energy == creep.carryCapacity){
                // Job Done!
                creep.memory.requireFilling = false;
                return;
            }
            // Nope, go mine.
            let sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                // Not close enough, go to the source.
                creep.moveTo(sources[0], {
                    visualizePathStyle: {
                        stroke: '#ffff00'}
                });
            }
        }else{
            if(creep.carry.energy == 0){
                // Actually... we're empty.
                creep.memory.requireFilling = true;
                return;
            }
            // So we've got stuffs and we're not refilling. Time to build!
            let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(sites.length){
                // We've got a thing to build!
                if(creep.build(sites[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sites[0], {
                        visualizePathStyle: {stroke: '#00ff00'}
                    });
                }
            }else{
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

