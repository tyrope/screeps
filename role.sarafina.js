var Config = require('config');
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

var refill = function(creep){
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
}

var repair = function(creep){
    let repairs = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.hits < structure.hitsMax
        }
    });

    if(repairs.length){
        if(creep.repair(repairs[0]) == ERR_NOT_IN_RANGE){
            creep.memory.activePath = Pathfinding.findPath(
                creep.pos,
                {
                    pos: repairs[0].pos,
                    range: 3
                }
            );
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
            creep.memory.activePath = Pathfinding.findPath(
                creep.pos,
                {
                    pos: sites[0].pos,
                    range: 3
                }
            );
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
            creep.memory.activePath = Pathfinding.findPath(
                creep.pos,
                {
                    pos: storages[0].pos,
                    range: 1
                }
            );
        }
        return true;
    }
    return false;
}

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            activePath: {},
            requireFilling: true,
            role: 'Sarafina'
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

