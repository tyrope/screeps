var logVerbose = false;
var memDump = false;

var PathFinding = require('pathfinding');
var SpawnController = require('spawnController');
var RoleController = require('roleController');

var garbageCollect = function(){
    if(logVerbose){
        console.log('main::garbageCollect::start');
    }
    for(let mem in Memory.creeps){
        if(!Game.creeps[mem]){
            delete Memory.creeps[mem];
            console.log('main::garbageCollect::deleted ' + mem);
        }
    }
    if(logVerbose){
        console.log('main::garbageCollect::end');
    }
}

module.exports.loop = function() {
    if(memDump){
        console.log(
            'main::start::dumping memory...\n'+
            RawMemory.get()
        );
    }else if(logVerbose){
        console.log('main::start');
    }

    // Memory cleanup.
    garbageCollect();
    if(Game.time % 600 == 0){
        // Check the cache every 10 minutes.
        PathFinding.CheckCache();
    }

    // Do we need to spawn a new creep?
    SpawnController.DoSpawns();

    // TODO: Check for intruders.

    // Tick active creeps.
    RoleController.Tick();

    if(logVerbose){
        console.log('main::end');
    }
}

