const _ = require("lodash")

// calculate result of a semester from finalScore && conduct
module.exports.calculateResult = (finalScore, conduct) => {
    const sGood = finalScore >= 8
    const sMedium = finalScore >= 6.5 && finalScore < 8
    const sBad = finalScore >= 5 && finalScore < 6.5
    const sVeryBad = finalScore < 5

    const cGood = conduct === "Tốt"
    const cMedium = conduct === "Khá"
    const cBad = conduct === "Trung bình"
    const cVeryBad = conduct === "Yếu"

    if (sGood && cGood) return "Giỏi"
    if (sGood && cMedium) return "Giỏi"
    if (sGood && cBad) return "Tiên tiến"
    if (sGood && cVeryBad) return "Tiên tiến"

    if (sMedium && !cVeryBad) return "Tiên tiến"
    if (sMedium && cVeryBad) return "Trung bình"

    if (sBad && !cVeryBad) return "Trung bình"
    if (sBad && cVeryBad) return "Yếu"

    if (sVeryBad) return "Yếu"
}

// calculate moderate conduct of entire year
module.exports.calculateConduct = (conduct1, conduct2) => {
    const c1Good = conduct1 === "Tốt"
    const c1Medium = conduct1 === "Khá"
    const c1Bad = conduct1 === "Trung bình"
    const c1VeryBad = conduct1 === "Yếu"

    const c2Good = conduct2 === "Tốt"
    const c2Medium = conduct2 === "Khá"
    const c2Bad = conduct2 === "Trung bình"
    const c2VeryBad = conduct2 === "Yếu"

    if (conduct1 === conduct2) return conduct1

    if (c1Good && c2Medium) return "Khá"
    if (c1Good && c2Bad) return "Khá"
    if (c1Good && c2VeryBad) return "Trung bình"

    if (c1Medium && c2Good) return "Tốt"
    if (c1Medium && c2Bad) return "Trung bình"
    if (c1Medium && c2VeryBad) return "Trung bình"

    if (c1Bad && c2Good) return "Khá"
    if (c1Bad && c2Medium) return "Khá"
    if (c1Bad && c2VeryBad) return "Yếu"

    if (c1VeryBad && c2Good) return "Khá"
    if (c1VeryBad && c2Medium) return "Trung bình"
    if (c1VeryBad && c2Bad) return "Trung bình"
}

// calculate moderate score of entire year
module.exports.calculateTotalScore = (score1, score2) => {
    const keys = Object.keys(score1).filter((item) => item !== "$init")

    const subjectTotalScore = {}

    for (const key of keys) {
        if (score1[key].medium !== -1) {
            subjectTotalScore[key] =
                (score1[key].medium + score2[key].medium * 2) / 3
        } else {
            subjectTotalScore[key] = score2[key].medium
        }
    }

    const scores = Object.values(subjectTotalScore)
    const totalScore = _.sum(scores) / scores.length

    return {
        subjectTotalScore,
        totalScore,
    }
}
