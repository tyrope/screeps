var logVerbose = false;

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

    // Save and exit.
    Memory.CostMatrix[roomName] = ret;
    return ret;
}

module.exports = {
    findPath: function(from, to){
        if(logVerbose){
            console.log(
                'Pathfinding::Start -- '+
                'From: '+JSON.stringify(from)+' -- '+
                'To: '+JSON.stringify(to)
            );
        }
        // Serialize the path's name.
        let pathName = from.roomName+'.'+from.x+'.'+from.y;
        pathName +=  '-'+to.pos.roomName+'.'+  to.pos.x+'.'+  to.pos.y;

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
                range: 1
            }
        );

        // Save this path.
        Memory.Paths[pathName] = calculatedPath.path;

        if(logVerbose){
            console.log('Pathfinding::End');
        }
        // Return the new path.
        return Memory.Paths[pathName];
    }
}

