var Pathfinding = require('pathfinding');
var TM = require('taskMaster');

module.exports = {
    Body: [WORK, CARRY, MOVE],

    Mem: {
        memory: {
            requireFilling: true,
            role: 'Simba'
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
            // So we've got stuffs and we're not refilling. Deposit!
            let err = creep.upgradeController(creep.room.controller);
            if(err == ERR_NOT_IN_RANGE){
                // We're not there yet...
                TM.SetPath(creep, creep.room.controller.pos, 3);
            }else if(err == OK){
/* FIXME: Room Signing.
                // If we didn't sign yet, we should now.
                if(creep.room.controller.sign.text != 'Roar!'){
                    if(creep.signController(creep.room.controller, 'Roar!') != OK){
                        console.log(creep.name+' is moving closer to the controller so he can sign it.');
                        TM.SetPath(creep, creep.room.controller.pos, 1);
                    }else{
                        console.log('Sign: '+creep.room.controller.sign.text);
                        console.log('ROAR! Room '+creep.room.name+' has been signed by '+creep.name+'.');
                    }
                }
*/
                creep.say('📈');
            }
        }
    }
}

