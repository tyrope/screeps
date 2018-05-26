var Config = require('config');

var MakeSpawnList = function() {
    if(Config.Verbose){
        console.log('SpawnController::MakeSpawnList::start');
    }
    let SpawnList = Config.DesiredCreeps.valueOf();
    // Go through all current creeps.
    for(let c in Game.creeps){
        // Save this creep's role.
        let r = Game.creeps[c].memory.role;
        if(Config.Verbose){
            console.log('SpawnController::MakeSpawnList::Found a ' + r);
        }
        // Do we want one of this role?
        if(r in SpawnList && SpawnList[r] > 0) {
            // Yes, tally.
            SpawnList[r]--;
            if(Config.Verbose){
                console.log('SpawnController::MakeSpawnList::Tallied');
            }
        } else {
            //Nope, mark for recycling.
            Game.creeps[c].memory.role = 'Scar';
            if(Config.Verbose){
                console.log('SpawnController::MakeSpawnList::Marked for Recycling');
            }
        }
    }
    if(Config.Verbose){
        for(let r in SpawnList){
            console.log('SpawnController::MakeSpawnList::'+r+'='+SpawnList[r]);
        }
        console.log('SpawnController::MakeSpawnList::end');
    }
    return SpawnList;
}

var Spawn = function(role){
    if(Config.Verbose){
        console.log('SpawnController::MakeSpawnList::start');
    }
    if(Game.spawns[Config.SpawnName].spawnCreep(
        [WORK, CARRY, MOVE], //TODO Grab from role definition
        'dryRun' + Game.time,
        { dryRun:true }
    ) === 0){
        Game.spawns[Config.SpawnName].spawnCreep(
            [WORK, CARRY, MOVE], //TODO Grab from role definition
            r + Game.time,
            {
                memory: {role: r }
            }
        );
    }
}

module.exports = {
    DoSpawns() {
        if(Config.Verbose){
            console.log('SpawnController::start');
        }
        // If we're spawning. Don't do anything.
        if(Game.spawns[Config.SpawnName].spawning){
            if(Config.Verbose){
                console.log('SpawnController::Spawning In Progress');
                console.log('SpawnController::end');
            }
            return;
        }

        let SpawnList = MakeSpawnList();

        for(let r in SpawnList){
            if(SpawnList[r] > 0){
                console.log('SpawnController::Spawning a '+r);
                Spawn(r);
                break; // Once we're spawning, we can't spawn again this tick.
            }
        }
        if(Config.Verbose){
            console.log('SpawnController::end');
        }
    }
}

