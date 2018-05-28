var Pathfinding = require('pathfinding');
var TM = require('taskMaster');

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            activePath: {},
            requireFilling: true,
            role: 'Simba'
        }
    },

    Tick: function(creep){
        // We moving?
        if(creep.memory.activePath.length){
            TM.Move(creep);
            return;
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
            // So we've got stuffs and we're not refilling. Deposit!
            let err = creep.upgradeController(creep.room.controller);
            if(err == ERR_NOT_IN_RANGE){
                // We're not there yet...
                TM.SetPath(creep, creep.room.controller.pos, 3);
            }else if(err == OK){
                // If we didn't sign yet, we should now.
                if(creep.room.controller.sign != 'Roar!'){
                    creep.signController(creep.room.controller, 'Roar!');
                }
                creep.say('📈');
            }
        }
    }
}

