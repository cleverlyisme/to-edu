const subjects = [
    { name: "Toán", prop: "math" },
    { name: "Văn", prop: "literature" },
    { name: "Anh", prop: "english" },
    { name: "Vật lý", prop: "physics" },
    { name: "Hóa học", prop: "chemistry" },
    { name: "Sinh học", prop: "biology" },
    { name: "Địa", prop: "geography" },
    { name: "Sử", prop: "history" },
    { name: "GDCD", prop: "law" },
    { name: "Âm nhạc", prop: "music" },
    { name: "Mỹ thuật", prop: "art" },
    { name: "Thể dục", prop: "sport" },
]

export default (name, prop = null) => {
    let subject = null

    if (name) {
        subject = subjects.find((item) => item.name === name)
    }

    if (prop) {
        subject = subjects.find((item) => item.prop === prop)
    }

    if (!subject) return false

    return name ? subject.prop : subject.name
}
