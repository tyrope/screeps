var logVerbose = false;

var Config = require('config');
var Pathfinding = require('pathfinding');
var TM = require('taskMaster');

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            activePath: {},
            role: 'Cub'
        }
    },

    Tick: function(creep){
        // We moving?
        if(creep.memory.activePath.length){
            TM.Move(creep);
            return;
        }

        // We full?
        if(creep.carry.energy < creep.carryCapacity){
            TM.Mine(creep);
        }else{
            if(TM.Supply(creep)){ return; }
            if(TM.Repair(creep)){ return; }
            creep.say('💤');
            TM.SetPath(creep, Config.IdleArea, 1);
        }
    }
}

