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
        }else if(!TM.Supply(creep)){
            creep.say('Idling...'); //TODO change to emoji.
            TM.SetPath(creep, Config.IdleArea, 1);
        }
    }
}

