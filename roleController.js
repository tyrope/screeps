var Config = require('config');
module.exports = {
    tick() {
        if(Config.Verbose){
            console.log('RoleController::start');
        }
        for(let i in Game.creeps){
            let c = Game.creeps[i]
            c.say(c.memory.role);
        }
        if(Config.Verbose){
            console.log('RoleController::end');
        }
    }
}

