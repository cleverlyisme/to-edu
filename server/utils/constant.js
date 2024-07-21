module.exports = {
    pageSize: 25,
    schoolEmail: "devschool@gmail.com",
    createStudentText:
        "[Dev School] Tài khoản của học sinh $studentName$: ID học sinh: $studentId$ | Mật khẩu: $password$",
    createTeacherText:
        "[Dev School] Tài khoản cho giáo viên $teacherName$: Email: $teacherEmail$ - Mật khẩu: $password$",
    smsToMainTeacherText:
        "[Dev School] Tin nhắn từ phụ huynh học sinh $studentName$: $content$",
    forgetPasswordText:
        "[Dev School] Truy cập liên kết để đặt lại mật khẩu: $url$",
    forgetPasswordHtml:
        "<strong>[Dev School]</strong> Truy cập liên kết để đặt lại mật khẩu: $url$",
    forgetPasswordSubject: "Đặt lại mật khẩu",
    subjects: [
        "Toán",
        "Văn",
        "Anh",
        "Vật lý",
        "Hóa học",
        "Sinh học",
        "Địa",
        "Sử",
        "GDCD",
        "Âm nhạc",
        "Mỹ thuật",
        "Thể dục",
    ],
    developDomain: "http://localhost:3000",
    productDomain: "",
}
