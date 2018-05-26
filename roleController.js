var logVerbose = true;

module.exports = {
    tick() {
        if(logVerbose){
            console.log('RoleController::start');
        }

        for(let i in Game.creeps){
            let c = Game.creeps[i]
            c.say(c.memory.role);
        }

        if(logVerbose){
            console.log('RoleController::end');
        }
    }
}

