var logVerbose = false;

var Roles = {
    'Cub': require('role.cub'),
    'Sarafina': require('role.sarafina'),
    'Simba': require('role.simba'),
    'Scar': require('role.scar')
}

module.exports = {
    Tick: function(){
        if(logVerbose){
            console.log('RoleController::start');
        }

        // Tick each creep.
        for(let i in Game.creeps){
            let creep = Game.creeps[i];

            // This even a role we know?
            if(creep.memory.role in Roles == false){
                console.log('RoleController::Unknown role: '+creep.memory.role);
                continue;
            }

            // If this creep is still spawning, don't control it.
            if(creep.spawning){
                continue;
            }

            // Alright, we know of it's role and it's done spawning.
            if(logVerbose){
                console.log('RoleController::Controlling: '+creep.name);
            }
            Roles[creep.memory.role].Tick(creep);
        }

        if(logVerbose){
            console.log('RoleController::end');
        }
    },
    Roles: Roles
}

