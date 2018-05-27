var Pathfinding = require('pathfinding');

var Build = function(creep){
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

var Mine = function(creep){
    let sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
        creep.memory.activePath = Pathfinding.findPath(
            creep.pos,
            {
                pos: sources[0].pos,
                range: 1
            }
        );
    }
}

var Move = function(creep){
    let loc = creep.memory.activePath[0];
    let mv = creep.move(creep.pos.getDirectionTo(loc.x,loc.y));
    if(mv == OK){
        // TODO: The return code might call itself 'OK',
        // but we might not have actually moved due to a creep blocking us.

        // This move was completed, delete it.
        creep.memory.activePath = _.drop(creep.memory.activePath);
    }else if(mv != ERR_TIRED){
        console.log(creep.name+'::Trying to move to but cannot. error code: '+mv);
    }
}

var Refill = function(creep){
    // TODO: Are there storages or containers we can take from?
    // Nope, go mine.
    Mine(creep);
}

var Repair = function(creep){
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

var Supply = function(creep){
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
    Build: Build,
    Mine: Mine,
    Move: Move,
    Refill: Refill,
    Repair: Repair,
    Supply: Supply
}

