module.exports = (schedule1, schedule2, subject) => {
    // get index of subject in 2 schedules
    try {
        let shortSchedule1 = []
        let shortSchedule2 = []

        Object.values(schedule1).map((arr, index) => {
            arr.map((s, i) => {
                if (s === subject) {
                    shortSchedule1 = [...shortSchedule1, `${index}${i}`]
                }
            })
        })

        Object.values(schedule2)
            .filter((item) => typeof item === "object")
            .map((arr, index) => {
                arr.map((s, i) => {
                    if (s === subject) {
                        shortSchedule2 = [...shortSchedule2, `${index}${i}`]
                    }
                })
            })

        return (
            shortSchedule1.filter((item) => shortSchedule2.includes(item))
                .length === 0
        )
    } catch (err) {
        console.log(err.message)
    }
}
