var Pathfinding = require('pathfinding');

var Build = function(creep){
    let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if(site != null){
        // We've got a thing to build!
        let err = creep.build(site);
        if(creep.build(site) == ERR_NOT_IN_RANGE){
            SetPath(creep, site.pos, 3);
        }else if(err == OK){
            creep.say(''); //TODO Add emoji.
        }
        return true;
    }
    return false;
}

var Mine = function(creep){
    let source = creep.pos.findClosestByPath(FIND_SOURCES);
    let err = creep.harvest(source);
    if(err == ERR_NOT_IN_RANGE){
        SetPath(creep, source.pos,1);
    }else if(err == OK){
        creep.say(''); //TODO Add emoji.
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
    let repair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.hits < structure.hitsMax
        }
    });

    if(repair != null){
        let err = creep.repair(repair);
        if(err == ERR_NOT_IN_RANGE){
            SetPath(creep, repair.pos, 3);
        }else if(err = OK){
            creep.say(''); // TODO Add emoji
        }
        return true;
    }
    return false;
}

var SetPath = function(creep, dest, range){
    creep.memory.activePath = Pathfinding.findPath(
        creep.pos,
        {
            pos: dest,
            range: range
        }
    );
}

var Supply = function(creep){
    let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.energy < structure.energyCapacity
        }
    });

    if(storage != null){
        let err = creep.transfer(storage, RESOURCE_ENERGY);
        if(err == ERR_NOT_IN_RANGE){
            SetPath(creep, storage.pos, 1);
        }else if(err == OK){
            creep.say(''); //TODO Add emoji.
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
    SetPath: SetPath,
    Supply: Supply
}

