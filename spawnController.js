var Config = require('config');

var MakeSpawnList = function() {
    let SpawnList = Config.DesiredCreeps.valueOf();
    let r;
    // Go through all current creeps.
    for(let c in Game.creeps){
        // Save this creep's role.
        r = Game.creeps[c].memory.role;
        // Do we want one of this role?
        if(r in SpawnList && SpawnList[r] > 0) {
            // Yes, tally.
            SpawnList[r]--;
            if(Config.Verbose){
                console.log('SpawnController::Found a '+r);
            }
        } else {
            //Nope, mark for recycling.
            Game.creeps[c].memory.role = 'Scar';
            if(Config.Verbose){
                console.log('SpawnController::Marked for Recycling');
            }
        }
    }
    return SpawnList;
}

var Spawn = function(r){
    Game.spawns[Config.SpawnName].spawnCreep(
        [WORK, CARRY, MOVE],
        r + Game.time,
        {
            memory: {role: r }
        }
    );
}

module.exports = {
    DoSpawns() {
        if(Config.Verbose){
            console.log('SpawnController::start');
        }
        // If we're spawning. Don't do anything.
        if(Game.spawns[Config.SpawnName].spawning){
            return;
        }

        let SpawnList = MakeSpawnList();

        for(let r in SpawnList){
            if(SpawnList[r] > 0){
                Spawn(r);
                break; // Once we're spawning, we can't spawn again this tick.
            }
        }
        if(Config.Verbose){
            console.log('SpawnController::end');
        }
    }
}

