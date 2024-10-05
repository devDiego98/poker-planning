export function findRoomByName(rooms, roomName) {
    for (const roomId in rooms) {
      if (rooms[roomId].name.toLowerCase() === roomName.toLowerCase()) {
        return { id: roomId, ...rooms[roomId] };
      }
    }
    return null; // Room not found
  }