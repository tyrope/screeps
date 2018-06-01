var Config = require('config');
var Pathfinding = require('pathfinding');
var TM = require('taskMaster');

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            requireFilling: true,
            role: 'Sarafina'
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
                // Job Done!
                creep.memory.requireFilling = false;
                return;
            }
            TM.Refill(creep);
        }else{
            if(creep.carry.energy == 0){
                // Actually... we're empty.
                creep.memory.requireFilling = true;
                return;
            }

            if(TM.Build( creep)){ return; }
            if(TM.Repair(creep)){ return; }
            if(TM.Supply(creep)){ return; }
            TM.Idle(creep);
        }
    }
}

