var Config = require('config');

var CAS = function(creep, position){
    if(creep.memory.CAS.location == {} || (
        // Apparently using == on 2 RoomLocations that point to the same place
        // can still return false...
        creep.memory.CAS.location.x == creep.pos.x &&
        creep.memory.CAS.location.y == creep.pos.y &&
        creep.memory.CAS.location.roomName == creep.pos.roomName
    )){
        // This is the first time we've invoked CAS in this location.
        // Just initialize, don't actually do anything yet.
        creep.memory.CAS['location'] = creep.pos;
        creep.memory.CAS['duration'] = 1;
        return;
    }

    // TODO: Are we unable to move to our path's end? If so, probably want to go somewhere else.

    // How long have we been stuck here?
    creep.memory.CAS.duration++;
    if(creep.memory.CAS.duration >= Config.CASDelay){
        // WE'RE DECLARING A COLLISION!
        creep.say('CAS alert!');
        switch(creep.pos.getDirectionTo(
            new RoomPosition(
                position.x,
                position.y,
                position.roomName
            )
        )){
            case TOP_LEFT:
                // Try TOP and LEFT
                if(canMove(new RoomPosition(creep.pos.x, creep.pos.y-1, creep.pos.roomName))){
                    creep.move(TOP);
                }else if(canMove(new RoomPosition(creep.pos.x-1, creep.pos.y, creep.pos.roomName))){
                    creep.move(LEFT);
                }
                break;
            case TOP:
                // Try TOP_RIGHT and TOP_LEFT
                if(canMove(new RoomPosition(creep.pos.x+1, creep.pos.y-1, creep.pos.roomName))){
                    creep.move(TOP_RIGHT);
                }else if(canMove(new RoomPosition(creep.pos.x-1, creep.pos.y-1, creep.pos.roomName))){
                    creep.move(TOP_LEFT);
                }
                break;
            case TOP_RIGHT:
                // Try TOP and RIGHT
                if(canMove(new RoomPosition(creep.pos.x, creep.pos.y-1, creep.pos.roomName))){
                    creep.move(TOP);
                }else if(canMove(new RoomPosition(creep.pos.x+1, creep.pos.y, creep.pos.roomName))){
                    creep.move(RIGHT);
                }
                break;
            case LEFT:
                // Try TOP_LEFT and BOTTOM_LEFT
                if(canMove(new RoomPosition(creep.pos.x-1, creep.pos.y-1, creep.pos.roomName))){
                    creep.move(TOP_LEFT);
                }else if(canMove(new RoomPosition(creep.pos.x-1, creep.pos.y+1, creep.pos.roomName))){
                    creep.move(BOTTOM_LEFT);
                }
                break;
            case RIGHT:
                // Try TOP_RIGHT and BOTTOM_RIGHT
                if(canMove(new RoomPosition(creep.pos.x+1, creep.pos.y-1, creep.pos.roomName))){
                    creep.move(TOP_RIGHT);
                }else if(canMove(new RoomPosition(creep.pos.x+1, creep.pos.y-1, creep.pos.roomName))){
                    creep.move(BOTTOM_RIGHT);
                }
                break;
            case BOTTOM_LEFT:
                // Try BOTTOM and LEFT
                if(canMove(new RoomPosition(creep.pos.x, creep.pos.y+1, creep.pos.roomName))){
                    creep.move(BOTTOM);
                }else if(canMove(new RoomPosition(creep.pos.x-1, creep.pos.y, creep.pos.roomName))){
                    creep.move(LEFT);
                }
                break;
            case BOTTOM:
                // Try BOTTOM_RIGHT and BOTTOM_LEFT
                if(canMove(new RoomPosition(creep.pos.x+1, creep.pos.y+1, creep.pos.roomName))){
                    creep.move(BOTTOM_RIGHT);
                }else if(canMove(new RoomPosition(creep.pos.x-1, creep.pos.y+1, creep.pos.roomName))){
                    creep.move(BOTTOM_LEFT);
                }
                break;
            case BOTTOM_RIGHT:
                // Try BOTTOM and RIGHT
                if(canMove(new RoomPosition(creep.pos.x, creep.pos.y+1, creep.pos.roomName))){
                    creep.move(BOTTOM);
                }else if(canMove(new RoomPosition(creep.pos.x-1, creep.pos.y, creep.pos.roomName))){
                    creep.move(LEFT);
                }
                break;
            default:
                console.log(
                    'CAS::['+
                    creep.pos.x+','+
                    creep.pos.y+'] to ['+
                    position.x+','+
                    position.y+'] is an invalid direction! ('+
                    creep.pos.getDirectionTo(position)+')'
                );
                break;
            // End switch
        }
        // We've strayed from our path, reconsider the movement next tick.
        creep.memory.activePath = {};
        creep.memory.CAS.location = {};
        creep.memory.CAS.duration = 0;
        return true;
    }
}

var canMove = function(position){
    let look = position.look();
    let canMove = true;
    look.forEach(
        function(lookObject){
            if(lookObject.type == 'creep'){
                canMove = false;
            }
            if(lookObject.type == 'terrain' && lookObject.terrain == 'wall'){
                canMove = false;
            }
            if(lookObject.type == 'structure'){
                let typ = lookObject.structure.structureType;
                if(typ == STRUCTURE_SPAWN ||
                    typ == STRUCTURE_EXTENSION ||
                    typ == STRUCTURE_WALL ||
                    (
                        // Ramparts cannot be moved through if they're owned
                        // by others and not set to public.
                        typ == STRUCTURE_RAMPART &&
                        (!lookObject.structure.my && !lookObject.structure.isPublic)
                    ) ||
                    typ == STRUCTURE_KEEPER_LAIR ||
                    // Portals don't block us, but it's a hassle to get back.
                    typ == STRUCTURE_PORTAL ||
                    typ == STRUCTURE_CONTROLLER ||
                    typ == STRUCTURE_LINK ||
                    typ == STRUCTURE_STORAGE ||
                    typ == STRUCTURE_TOWER ||
                    typ == STRUCTURE_OBSERVER ||
                    typ == STRUCTURE_POWER_BANK ||
                    typ == STRUCTURE_POWER_SPAWN ||
                    typ == STRUCTURE_EXTRACTOR ||
                    typ == STRUCTURE_LAB ||
                    typ == STRUCTURE_TERMINAL ||
                    typ == STRUCTURE_NUKER
                ){
                    canMove = false;
                }
            }
        }
    );
    return canMove;
}

var checkCache = function(){
    if('Expiry' in Memory == false){
        // We've not done any pathfinding yet? Set up the memory.
        Memory['Expiry'] = {
            'Rooms': {},
            'Paths': {}
        };
        return;
    }

    // We've got Expiry in our memory,
    // let's check out memory and see if it needs wiping.

    // Save the rooms we're expiring, because any path inside needs to be re-done too.
    var ExpiredRooms = [];

    for(let r in Memory.Expiry.Rooms){
        if(Memory.Expiry.Rooms[r] < Game.time){
            // Add to our list of rooms to expire all paths for.
            ExpiredRooms.push(r);

            // Remove this room from the Matrix.
            delete Memory.CostMatrix[r];
            delete Memory.Expiry.Rooms[r];
        }
    }

    let pathsExpired = 0;

    for(let p in Memory.Expiry.Paths){
        let rStart  = p.split('-')[0].split('.')[0];
        let rEnd    = p.split('-')[1].split('.')[0];
        let rExpire = false;
        // Check if our room has expired.
        for(let i in ExpiredRooms){
            if( ExpiredRooms[i] == rStart || ExpiredRooms[i] == rEnd){
                // One of our rooms expired, we need to expire as well.
                rExpire = true;
                break;
            }
        }

        // If either our room or we ourselves are expired...
        if(rExpire || Memory.Expiry.Paths[p] < Game.time){
            pathsExpired++;

            // Remove the path.
            delete Memory.Paths[p];
            delete Memory.Expiry.Paths[p];
        }
    }

    if(ExpiredRooms.length > 0 || pathsExpired > 0){
        console.log('Pathfinding::checkCache::'+ExpiredRooms.length+' room(s) and '+pathsExpired+' path(s) have expired.');
    }
}

var GetCostMatrix = function(roomName){
    // Make sure the memory is set up.
    if('CostMatrix' in Memory == false){
        Memory['CostMatrix'] = {};
    }

    // Use cached if available.
    if(roomName in Memory.CostMatrix){
        return Memory.CostMatrix.roomName;
    }

    // We don't have a cached version, does the room exist?
    let room = Game.rooms[roomName];
    if(!room){
        console.log('Pathfinding:GetCostMatrix::Invalid room! '+roomName);
        return false;
    }
    let ret = new PathFinder.CostMatrix;

    //Buildings.
    room.find(FIND_STRUCTURES).forEach(function(s) {
        let typ = s.structureType;
        // Roads cost half as much as plains.
        if(typ == STRUCTURE_ROAD){
            ret.set(s.pos.x, s.pos.y, 1);
        } else {
            // You shall not pass.
            ret.set(s.pos.x, s.pos.y, 0xff);
        }
    });

    // Save, set expiry and exit.
    Memory.CostMatrix[roomName] = ret;
    Memory.Expiry.Rooms[roomName] = Game.time + Config.PathFindingExpiry;
    return ret;
}

var findPath = function(from, to){
    // Serialize the path's name.
    // Example: sim.1.1-sim.2.2-1
    let pathName = from.roomName+'.'+from.x+'.'+from.y;
    pathName +=  '-'+to.pos.roomName+'.'+to.pos.x+'.'+to.pos.y+'-'+to.range;

    // At first, there's no such thing as /Paths in Memory.
    if('Paths' in Memory == false){
        // So let's make sure it exists.
        Memory['Paths'] = {};
    }

    // Do we have a path between these points?
    if(pathName in Memory.Paths){
        // Return the cached path.
        return Memory.Paths[pathName];
    }

    // Create a new path.
    let calculatedPath = PathFinder.search(
        from,
        to,
        {
            plainCost:2,
            swampCost:10,
            roomCallback: GetCostMatrix,
            range: to.range
        }
    );

    // Save this path.
    Memory.Paths[pathName] = calculatedPath.path;
    Memory.Expiry.Paths[pathName] = Game.time + Config.PathFindingExpiry;

    // Return the new path.
    return Memory.Paths[pathName];
}

module.exports = {
    CAS: CAS,
    CheckCache: checkCache,
    findPath: findPath
}

