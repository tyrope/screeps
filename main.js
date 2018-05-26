var Config = require('config');
var SpawnController = require('spawnController');
var RoleController = require('roleController');

module.exports.loop = function() {
    if(Config.Verbose){
        console.log('main::start');
    }
    // Do we need to spawn a new creep?
    SpawnController.DoSpawns();

    // TODO: Check for intruders.

    // Tick active creeps.
    RoleController.tick();
    if(Config.Verbose){
        console.log('main::end');
    }
}

