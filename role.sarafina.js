var Config = require('config');

var refill = function(creep){
    // TODO: Are there storages or containers we can take from?
    // Nope, go mine.
    let sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
        // Not close enough, go to the source.
        creep.moveTo(sources[0], {
            visualizePathStyle: {
                stroke: '#ffff00'}
        });
    }
}

var repair = function(creep){
    let repairs = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.hits < structure.hitsMax
        }
    });

    if(repairs.length){
        if(creep.repair(repairs[0]) == ERR_NOT_IN_RANGE){
            creep.moveTo(repairs[0], {
                visualizePathStyle: {
                    stroke: '#ffa500' }
            });
        }
        return true;
    }
    return false;
}

var build = function(creep){
    let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
    if(sites.length){
        // We've got a thing to build!
        if(creep.build(sites[0]) == ERR_NOT_IN_RANGE){
            creep.moveTo(sites[0], {
                visualizePathStyle: {stroke: '#00ff00'}
            });
        }
        return true;
    }
    return false;
}

var supply = function(creep){
    let storages = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.energy < structure.energyCapacity
        }
    });

    if(storages.length){
        if(creep.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(storages[0], {
                visualizePathStyle: {
                    stroke: '#00ff00'
                }
            });
        }
        return true;
    }
    return false;
}

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
            refill(creep);
        }else{
            if(creep.carry.energy == 0){
                // Actually... we're empty.
                creep.memory.requireFilling = true;
                return;
            }

            if(repair(creep)){ return; }
            if(build(creep) ){ return; }
            if(supply(creep)){ return; }
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

