const Grade = require("../models/grade.model")
const Teacher = require("../models/teacher.model")

module.exports.getAllGrade = (req, res) => {
    try {
        Grade.find({ isDeleted: false })
            .then((grades) => {
                if (grades) {
                    res.status(200).json(
                        grades.sort((item1, item2) => item1.grade - item2.grade)
                    )
                } else {
                    res.status(200).json([])
                }
            })
            .catch((err) => {
                res.status(500).send(err.message)
            })
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports.getAllGradeWithMainTeacher = async (req, res) => {
    try {
        const grades = await Grade.find({ isDeleted: false })
        const teachers = await Teacher.find({ isDeleted: false })

        if (!grades) {
            throw new Error("Không có lớp học")
        }

        const result = grades.map((grade) => ({
            grade: grade.grade,
            classRoom: grade.classRoom.map((room) => ({
                room: room,
                mainTeacher: teachers.find(
                    (tc) => tc.mainTeacherOfClass === room
                ),
            })),
        }))

        res.status(200).json(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getAllClassOfGrade = (req, res) => {
    try {
        const grade = req.params.grade

        Grade.findOne({ isDeleted: false, grade })
            .then((grade) => {
                if (grade) {
                    res.status(200).json(grade.classRoom.sort())
                } else {
                    res.status(200).json([])
                }
            })
            .catch((err) => {
                res.status(500).send(err.message)
            })
    } catch (err) {
        res.status(401).send(err.message)
    }
}
