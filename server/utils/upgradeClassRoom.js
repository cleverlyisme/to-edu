module.exports = (classRoom) => {
    const [currentGrade, currentRoom] = classRoom.split("")
    const newGrade = Number(currentGrade) + 1

    return newGrade + currentRoom
}
