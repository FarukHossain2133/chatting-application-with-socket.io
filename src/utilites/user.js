
const users = [];

/************ Add User Function *************/
const addUser = ({id, username, room}) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if(!username || !room){
        return {
            error: 'Username and room are required'
        }
    }
    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    })
  
    // Validate username
    if(existingUser){
        return {
            error: 'username is already used'
        }
    }
    // Store user
    const user = {id, username, room};
    users.push(user);
    return { user }
}


/************ Remove User Function *************/
const removeUser = (id) => {
    if(!id){
        return {
            error: 'id must be a valid value'
        } 
    }

   const findUserIndex = users.findIndex((user) => user.id === id)

    if(findUserIndex !== -1){
        return users.splice(findUserIndex, 1)[0]
    }
    return {
        error: 'Id is not found'
    }
}

/************ Get User Function *************/
const getUser = (id) => {
    return users.find((user) =>  user.id === id )
}


/************ GEt Chat Room Users Function *************/
const getUsersInRoom = (room) => {
 
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}