var logVerbose = false;

var Config = require('config');

var checkCache = function(){
    if(logVerbose){ console.log('Pathfinding::checkCache::start'); }

    if('Expiry' in Memory == false){
        // We've not done any pathfinding yet? Set up the memory.
        Memory['Expiry'] = {
            'Rooms': {},
            'Paths': {}
        };
        if(logVerbose){ console.log('Pathfinding::checkCache::no memory -- end'); }
        return;
    }

    // We've got Expiry in our memory,
    // let's check out memory and see if it needs wiping.

    // Save the rooms we're expiring, because any path inside needs to be re-done too.
    var ExpiredRooms = [];

    for(let r in Memory.Expiry.Rooms){
        if(Memory.Expiry.Rooms[r] < Game.time){
            if(logVerbose){
                console.log('Pathfinding::checkCache::Room '+r+'\'s CostMatrix has expired.');
            }
            // Add to our list of rooms to expire all paths for.
            ExpiredRooms.push(r);

            // Remove this room from the Matrix.
            delete Memory.CostMatrix[r];
            delete Memory.Expiry.Rooms[r];
        }
    }

    if(ExpiredRooms.length > 0){
        console.log('Pathfinding::checkCache::'+ExpiredRooms.length+' rooms have expired: '+ExpiredRooms.toString());
    }

    for(let p in Memory.Expiry.Paths){
        let rStart  = p.split('-')[0].split('.')[0];
        let rEnd    = p.split('-')[1].split('.')[0];
        let rExpire = false;
        // Check if our room has expired.
        for(let i in ExpiredRooms){
            if( ExpiredRooms[i] == rStart || ExpiredRooms[i] == rEnd){
                // One of our rooms expired, we need to expire as well.
                if(logVerbose){
                    console.log('Pathfinding::checkCache::'+p+'\'s room has expired.');
                }
                rExpire = true;
                break;
            }
        }

        // If either our room or we ourselves are expired...
        if(rExpire || Memory.Expiry.Paths[p] < Game.time){
            if(logVerbose && !rExpire){
                console.log('Pathfinding::checkCache::'+p+' has expired.');
            }

            // Remove the path.
            delete Memory.Paths[p];
            delete Memory.Expiry.Paths[p];
        }
    }

    if(logVerbose){ console.log('Pathfinding::checkCache::end'); }
}

var GetCostMatrix = function(roomName){
    // Make sure the memory is set up.
    if('CostMatrix' in Memory == false){
        Memory['CostMatrix'] = {};
    }

    // Use cached if available.
    if(roomName in Memory.CostMatrix){
        if(logVerbose){
            console.log('Pathfinding::GetCostMatrix::'+
            'Returning cached room '+roomName);
        }
        return Memory.CostMatrix.roomName;
    }

    // We don't have a cached version, does the room exist?
    let room = Game.rooms[roomName];
    if(!room){
        console.log('Pathfinding:GetCostMatrix::Invalid room! '+roomName);
        return false;
    }

    if(logVerbose){
        console.log('Pathfinding::GetCostMatrix::Calculating new Matrix.');
    }
    let ret = new PathFinder.CostMatrix;

    //Buildings.
    room.find(FIND_STRUCTURES).forEach(function(s) {
        let typ = s.structureType;
        // Roads cost half as much as plains.
        if(typ == STRUCTURE_ROAD){
            ret.set(s.pos.x, s.pos.y, 1);
        } else if(s.structureType !== STRUCTURE_CONTAINER &&
            (s.structureType !== STRUCTURE_RAMPART || !s.my)){
            // You shall not pass.
            ret.set(s.pos.x, s.pos.y, 0xff);
        }
    });

    // Save, set expiry and exit.
    Memory.CostMatrix[roomName] = ret;
    Memory.Expiry.Rooms[roomName] = Game.tick + Config.PathFindingExpiry;
    return ret;
}

var findPath = function(from, to){
    if(logVerbose){
        console.log(
            'Pathfinding::Start -- '+
            'From: '+JSON.stringify(from)+' -- '+
            'To: '+JSON.stringify(to)+' -- '+
            'Range: '+to.range
        );
    }
    // Serialize the path's name.
    // Example: sim.1.1-sim.2.2-1
    let pathName = from.roomName+'.'+from.x+'.'+from.y;
    pathName +=  '-'+to.pos.roomName+'.'+to.pos.x+'.'+to.pos.y+'-'+to.range;

    if(logVerbose){
        console.log('Pathfinding::Serialized path name: '+pathName);
    }

    // At first, there's no such thing as /Paths in Memory.
    if('Paths' in Memory == false){
        // So let's make sure it exists.
        Memory['Paths'] = {};
    }

    // Do we have a path between these points?
    if(pathName in Memory.Paths){
        if(logVerbose){
            console.log('Pathfinding::Returning cached path.');
        }
        // Return the cached path.
        return Memory.Paths[pathName];
    }

    if(logVerbose){
            console.log('Pathfinding::Calculating new path.');
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

    if(logVerbose){
        console.log('Pathfinding::End');
    }
    // Return the new path.
    return Memory.Paths[pathName];
}

module.exports = {
    CheckCache: checkCache,
    findPath: findPath
}

