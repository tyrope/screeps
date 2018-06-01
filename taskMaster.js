var logVerbose = false;

var Config = require('config');
var Pathfinding = require('pathfinding');

var Build = function(creep){
    if(logVerbose){
        console.log('TaskMaster::Build::'+creep);
    }
    let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if(site != null){
        // We've got a thing to build!
        let err = creep.build(site);
        if(creep.build(site) == ERR_NOT_IN_RANGE){
            SetPath(creep, site.pos, 3);
        }else if(err == OK){
            creep.say('🔨');
        }
        return true;
    }
    return false;
}

var Idle = function(creep){
    if(logVerbose){
        console.log('TaskMaster::Idle::'+creep);
    }
    if(creep.pos == Config.IdleArea()){
        creep.say('IdleEmoji');
    }else{
        SetPath(creep, Config.IdleArea(), 1);
    }
}

var Mine = function(creep){
    if(logVerbose){
        console.log('TaskMaster::Idle::'+creep);
    }
    let source = creep.pos.findClosestByPath(FIND_SOURCES);
    let err = creep.harvest(source);
    if(err == ERR_NOT_IN_RANGE){
        SetPath(creep, source.pos,1);
    }else if(err == OK){
        creep.say('🚧');
    }
}

var Move = function(creep){
    if(logVerbose){
        console.log('TaskMaster::Move::'+creep);
    }
    let loc = creep.memory.activePath[0];
    if(loc.x == creep.pos.x && loc.y == creep.pos.y){
        // We're here, so drop this part of the path.
        creep.memory.activePath = _.drop(creep.memory.activePath);

        // Reset the CAS for this creep.
        creep.memory.CAS = {'location': {}, 'duration': 0};

        // Grab the next bit of path, if available
        if(creep.memory.activePath.length){
            loc = creep.memory.activePath[0];
        }else{
            // No more moving.
            return false;
        }
    }else{
        // If we reached this part of the code, there's one of 2 scenarios.
        // 1) We've just started a new path.
        // 2) On the last tick, our move was blocked.
        // Either way, we should invoke the CAS.
        if(Pathfinding.CAS(creep, loc)){
            // CAS triggered, tell the creep we're moving, but don't continue our path!
            return true;
        }
    }

    let mv = creep.move(creep.pos.getDirectionTo(loc.x, loc.y));
    if(mv != OK && mv != ERR_TIRED){
        console.log(creep.name+'::Trying to move to but cannot. error code: '+mv);
        return false;
    }
    return true;
}

var Refill = function(creep){
    if(logVerbose){
        console.log('TaskMaster::Refill::'+creep);
    }
    // TODO: Are there storages or containers we can take from?
    // Nope, go mine.
    Mine(creep);
}

var Repair = function(creep){
    if(logVerbose){
        console.log('TaskMaster::Repair::'+creep);
    }
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
            creep.say('🔧');
        }
        return true;
    }
    return false;
}

var SetPath = function(creep, dest, range){
    if(logVerbose){
        console.log('TaskMaster::SetPath::'+creep);
    }
    creep.memory.activePath = Pathfinding.findPath(
        creep.pos,
        {
            pos: dest,
            range: range
        }
    );
}

var Supply = function(creep){
    if(logVerbose){
        console.log('TaskMaster::Supply::'+creep);
    }
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
            creep.say('📦');
        }
        return true;
    }
    return false;
}

module.exports = {
    Build: Build,
    Idle, Idle,
    Mine: Mine,
    Move: Move,
    Refill: Refill,
    Repair: Repair,
    SetPath: SetPath,
    Supply: Supply
}

