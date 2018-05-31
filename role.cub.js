var logVerbose = false;

var Config = require('config');
var Pathfinding = require('pathfinding');
var TM = require('taskMaster');

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            activePath: {},
            requireFilling: true,
            role: 'Cub'
        }
    },

    Tick: function(creep){
        // We moving?
        if(creep.memory.activePath.length){
            if(TM.Move(creep)){
                // Only return if we're actually moving.
                return;
            }
        }

        // Are we in the process of refilling?
        if(creep.memory.requireFilling){
            // We full yet?
            if(creep.carry.energy == creep.carryCapacity){
                // Job done!
                creep.memory.requireFilling = false;
                return;
            }
            TM.Mine(creep);
        }else{
            if(creep.carry.energy == 0){
                // Actually... we're empty.
                creep.memory.requireFilling = true;
                return;
            }
            if(TM.Supply(creep)){ return; }
            if(TM.Repair(creep)){ return; }
            creep.say('💤');
            TM.SetPath(creep, Config.IdleArea, 1);
        }
    }
}

