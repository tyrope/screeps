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
            let creep = Game.creeps[i]
            try{
                Roles[creep.memory.role].Tick(creep);
                if(logVerbose){
                    console.log('RoleController::Controlling: '+creep.name);
                }
            }catch(TypeError){
                console.log('RoleController::Unknown role: '+creep.name);
            }
        }

        if(logVerbose){
            console.log('RoleController::end');
        }
    },
    Roles: Roles
}

