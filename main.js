var logVerbose = true;

var SpawnController = require('spawnController');
var RoleController = require('roleController');

var garbageCollect = function(){
    if(logVerbose){
        console.log('main::garbageCollect::start');
    }
    for(let mem in Memory.creeps){
        if(!Game.creeps[mem]){
            delete Memory.creeps[mem];
            if(logVerbose){
                console.log('main::garbageCollect::deleted '+mem);
            }
        }
    }
    if(logVerbose){
        console.log('main::garbageCollect::end');
    }
}

module.exports.loop = function() {
    if(logVerbose){
        console.log('main::start');
    }

    // Memory cleanup.
    garbageCollect();

    // Do we need to spawn a new creep?
    SpawnController.DoSpawns();

    // TODO: Check for intruders.

    // Tick active creeps.
    // RoleController.Tick();

    if(logVerbose){
        console.log('main::end');
    }
}

