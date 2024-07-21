module.exports = (score) => {
    return (
        (score.x1[0] +
            score.x1[1] +
            score.x1[2] +
            2 * (score.x2[0] + score.x2[1]) +
            3 * score.x3[0]) /
        10
    )
}
