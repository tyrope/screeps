module.exports = {
    Body: [WORK, CARRY, MOVE],
    Mem: {
        role: 'Welp'
    }
    Tick: function(creep){
        creep.say(creep.memory.role);
    }
}
