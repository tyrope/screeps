var logVerbose = true;

var SpawnController = require('spawnController');
var RoleController = require('roleController');

module.exports.loop = function() {
    if(logVerbose){
        console.log('main::start');
    }
    // Do we need to spawn a new creep?
    SpawnController.DoSpawns();

    // TODO: Check for intruders.

    // Tick active creeps.
    RoleController.tick();
    if(logVerbose){
        console.log('main::end');
    }
}

