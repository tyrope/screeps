var logVerbose = false;

module.exports = {
    Roles: {
        'Welp': require('role.welp');
    }

    Tick: function(){
        if(logVerbose){
            console.log('RoleController::start');
        }

        // Tick each creep.
        for(let i in Game.creeps){
            roles[i.memory.role].tick(i);
        }

        if(logVerbose){
            console.log('RoleController::end');
        }
    }
}

