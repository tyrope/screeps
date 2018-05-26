var logVerbose = false;

var Config = require('config');
var RoleController = require('roleController');

var CheckSpawnList = function() {
    if(logVerbose){
        console.log('SpawnController::CheckSpawnList::start');
    }

    let Desireds = Config.DesiredCreeps.valueOf();

    for(let r in RoleController.Roles){
        let count = _.filter(
            Game.creeps,
            (creep) => creep.memory.role == r
        ).length;

        if(logVerbose){
            console.log(
                'SpawnController::CheckSpawnList::'+r+
                '('+count+'/'+Desireds[r]+')'
            );
        }

        if(count < Desireds[r]){
            DoCreepSpawn(r);
            break; //Once we're spawning, we can stop seeing if we need a spawn.
        } else if (count > Desireds[r]){
            //TODO Destroy over-population.
        }
    }

    if(logVerbose){
        console.log('SpawnController::CheckSpawnList::end');
    }
}

var DoCreepSpawn = function(role){
    if(logVerbose){
        console.log('SpawnController::DoCreepSpawn::Spawning a '+role);
    }

    let spawnCode = Game.spawns[Config.SpawnName].spawnCreep(
        RoleController.Roles[role].Body,
        'dryRun' + Game.time,
        {dryRun:true});

    if( spawnCode === 0){
        if(logVerbose){
            console.log('SpawnController::DoCreepSpawn::Spawning.');
        }
        Game.spawns[Config.SpawnName].spawnCreep(
            RoleController.Roles[role].Body,
            role + Game.time,
            RoleController.Roles[role].Mem
        );
    }else if(logVerbose){
        console.log('SpawnController::DoCreepSpawn::Cannot spawn: ' + spawnCode);
    }
    if(logVerbose){
        console.log('SpawnController::DoCreepSpawn::end');
    }
}

module.exports = {
    DoSpawns: function() {
        if(logVerbose){
            console.log('SpawnController::start');
        }
        // If we're spawning. Don't do anything.
        if(Game.spawns[Config.SpawnName].spawning){
            if(logVerbose){
                console.log('SpawnController::Spawning In Progress');
                console.log('SpawnController::end');
            }
            return;
        }

        CheckSpawnList();

        if(logVerbose){
            console.log('SpawnController::end');
        }
    }
}

