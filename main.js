var PathFinding = require('pathfinding');
var SpawnController = require('spawnController');
var RoleController = require('roleController');

var garbageCollect = function(){
    for(let mem in Memory.creeps){
        if(!Game.creeps[mem]){
            delete Memory.creeps[mem];
            console.log('main::garbageCollect::deleted ' + mem);
        }
    }
}

module.exports.loop = function() {
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
}

