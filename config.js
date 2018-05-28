// USER CONFIGURABLE.
var DesiredCreeps = {'Cub': 1, 'Sarafina': 2, 'Simba': 1, 'Scar': 0};
var SpawnName = 'LionsDen';
var IdlePosition = {x: 20, y:20};
var preferredSource = 1;

/* END OF CONFIGURATION. DO NOT TOUCH BELOW THIS LINE.
 * **********************************
 */
module.exports = {
    DesiredCreeps: DesiredCreeps,
    SpawnName: SpawnName,
    IdleArea: new RoomPosition(IdlePosition.x, IdlePosition.y, Game.spawns[SpawnName].room.name),
    Source: preferredSource
}

