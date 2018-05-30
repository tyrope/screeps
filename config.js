// USER CONFIGURABLE.

// The number of creeps you want.
var DesiredCreeps = {'Cub': 1, 'Simba': 1, 'Sarafina': 1, 'Scar': 0};

// The name of the spawn
var SpawnName = 'LionsDen';

// Where in the room that the above spawner is in should the creeps idle?
var IdlePosition = {x: 4, y:45};

// How long should the Pathfinding system hold onto data before discarding it?
// Default: 1800 = ~30 minutes.
var PFExpiry = 1800;

/* END OF CONFIGURATION. DO NOT TOUCH BELOW THIS LINE.
 * **********************************
 */
module.exports = {
    DesiredCreeps: DesiredCreeps,
    SpawnName: SpawnName,
    IdleArea: function(){
        // Don't cache this. `Game` apparently resets sometimes.
        return new RoomPosition(
            IdlePosition.x,
            IdlePosition.y,
            Game.spawns[SpawnName].room.name
        );
    },
    PathFindingExpiry: PFExpiry
}

