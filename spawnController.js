var Config = require('config');

module.exports = {
    DoSpawns() {
        if(Config.Verbose){
            console.log('SpawnController::start');
        }
        // If we're spawning. Don't do anything.
        if(Game.spawns[Config.SpawnName].spawning){
            return;
        }

        let SpawnList = Config.DesiredCreeps; //FIXME I should be a copy.
        let r;
        // Go through all current creeps.
        for(let c in Game.creeps){
            // Save this creep's role.
            r = Game.creeps[c].memory.role;
            // Do we still want this creep?
            if(r in SpawnList && SpawnList[r] > 0) {
                // Yes, tally.
                SpawnList[r]--;
            } else {
                //Nope, mark for recycling.
                Game.creeps[c].memory.role = 'Scar';
            }
        }

        for(r in SpawnList){
            if(SpawnList[r] > 0){
                Game.spawns[Config.SpawnName].spawnCreep(
                    [WORK, CARRY, MOVE],
                    r + Game.time,
                    {
                        memory: {role: r }
                    }
                );
                break; // Once we're spawning, we can't spawn again.
            }
        }
        if(Config.Verbose){
            console.log('SpawnController::end');
        }
    }
}

