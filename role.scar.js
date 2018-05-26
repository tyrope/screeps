var Config = require('config');

module.exports = {
    Body: [MOVE],

    Mem: {
        memory: {
            role: 'Scar'
        }
    },

    Tick: function(creep){
        // Try to be recycled.
        if(Game.spawns[Config.SpawnName].recycleCreep(creep) == ERR_NOT_IN_RANGE){
            // Didn't work, get closer.
            creep.moveTo(Game.spawns[Config.SpawnName]);
        }
    }
}

