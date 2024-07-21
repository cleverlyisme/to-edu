const mongoose = require("mongoose");
const passwordHash = require("password-hash");
const _ = require("lodash");
const { subjects } = require("./utils/constant");

const Admin = require("./models/admin.model");
const Parent = require("./models/parent.model");
const Teacher = require("./models/teacher.model");
const Highlight = require("./models/highlight.model");
const Schedule = require("./models/schedule.model");
const Grade = require("./models/grade.model");
const Semester = require("./models/semester.model");
const Event = require("./models/event.model");

const uri =
  "mongodb+srv://tuananh2862:galaga286@final-exam.urgvem7.mongodb.net/to-edu?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const password = passwordHash.generate("12345678");
const dateOfBirth = (year) => {
  const day = Math.floor(Math.random() * 27 + 1);
  const month = _.sample([
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]);
  return `${month} ${day} ${year} 11:59:55 GMT+0700 (Indochina Time)`;
};

// function that render random names
const firstNames = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Mai",
  "Hoàng",
  "Đinh",
  "Đỗ",
  "Phạm",
  "Vũ",
  "Ngô",
  "Lý",
  "Bùi",
  "Đặng",
  "Phan",
  "Dương",
];

const middleNames = [
  "Việt",
  "Văn",
  "Quốc",
  "Tuấn",
  "Lâm",
  "Hoàng",
  "Trọng",
  "Thị",
  "Thùy",
  "Minh",
  "Thu",
  "Linh",
  "Huy",
  "Hải",
  "Mai",
  "Phương",
  "Quang",
  "Ngọc",
];

const lastNames = [
  "Hưng",
  "Hoàng",
  "Anh",
  "Hùng",
  "Hằng",
  "Hiệp",
  "Long",
  "Trung",
  "Duy",
  "Dương",
  "Linh",
  "Ngân",
  "Nguyệt",
  "Ly",
  "Nam",
  "Chính",
  "Hải",
  "Ngọc",
  "Đông",
  "Đức",
  "Thái",
  "Quang",
  "Ánh",
  "Khôi",
  "Tuấn",
  "Dũng",
  "Tùng",
  "Huy",
  "Trường",
  "Nam",
  "Giang",
  "Hiếu",
  "Phương",
  "Hà",
  "Minh",
  "Lan",
  "Trang",
  "Huyền",
  "Tân",
  "Đạt",
];

const renderName = () => {
  const firstName = _.sample(firstNames);
  const studentName = `${firstName} ${_.sample(middleNames)} ${_.sample(
    lastNames
  )}`;

  const fatherName = `${firstName} ${_.sample(middleNames)} ${_.sample(
    lastNames
  )}`;

  const motherName = `${_.sample(firstNames)} ${_.sample(
    middleNames
  )} ${_.sample(lastNames)}`;

  return {
    studentName,
    fatherName,
    motherName,
  };
};

// function that render random address
const districts = [
  "Hoàn Kiếm",
  "Đống Đa",
  "Ba Đình",
  "Hai Bà Trưng",
  "Hoàng Mai",
  "Thanh Xuân",
  "Long Biên",
  "Nam Từ Liêm",
  "Bắc Từ Liêm",
  "Tây Hồ",
  "Cầu Giấy",
  "Hà Đông",
  "Sơn Tây",
  "Ba Vì",
  "Chương Mỹ",
  "Phúc Thọ",
  "Đan Phượng",
  "Đông Anh",
  "Gia Lâm",
  "Hoài Đức",
  "Mê Linh",
  "Mỹ Đức",
  "Phú Xuyên",
  "Quốc Oai",
  "Sóc Sơn",
  "Thạch Thất",
  "Thanh Oai",
  "Thường Tín",
  "Ứng Hòa",
  "Thanh Trì",
];

const renderAddress = () => `${_.sample(districts)}, Hà Nội`;

// create admin
console.log("Creating admin...");
async function createAdmin() {
  const newAdmin = new Admin({
    email: "admin@gmail.com",
    password,
    isDeleted: false,
  });
  await newAdmin.save();
}
createAdmin().then(() => console.log("Created admin"));

// create semester && year
console.log("Creating semester...");

async function createSemester(data) {
  const newSemester = new Semester(data);
  await newSemester.save();
}

const now = new Date();

const month = now.getMonth() + 1;
const year = month < 9 ? now.getFullYear() - 1 : now.getFullYear();
const semester = month < 9 ? 2 : 1;

const lastResult = [
  { time: "2016-2017 II", good: 73, medium: 20, bad: 5, veryBad: 2 },
  { time: "2017-2018 I", good: 72, medium: 10, bad: 15, veryBad: 3 },
  { time: "2017-2018 II", good: 70, medium: 20, bad: 9, veryBad: 1 },
  { time: "2018-2019 I", good: 70, medium: 23, bad: 5, veryBad: 2 },
  { time: "2018-2019 II", good: 65, medium: 19, bad: 15, veryBad: 1 },
  { time: "2019-2020 I", good: 75, medium: 19, bad: 5, veryBad: 1 },
];

createSemester({ year, semester, lastResult }).then(() =>
  console.log("Created semester")
);

// create class
console.log("Creating grades and classes...");
const grades = [
  { grade: 10, classRoom: ["10A1", "10A2", "10D1", "10D2"] },
  { grade: 11, classRoom: ["11A1", "11A2", "11D1", "11D2", "11D3"] },
  { grade: 12, classRoom: ["12A1", "12A2", "12D1"] },
];

async function createGrade(grades) {
  for (const grade of grades) {
    grade.isDeleted = false;
    const newGrade = new Grade(grade);
    await newGrade.save();
  }
  console.log("Created grades and classes");
}

createGrade(grades);

// create schedule
console.log("Creating schedules...");

let classRoom = [];
grades.forEach((grade) => {
  classRoom = [...classRoom, ...grade.classRoom];
});

const length = classRoom.length;

async function createSchedule(classSchedule) {
  const newSchedule = new Schedule(classSchedule);
  await newSchedule.save();
}

const lessons = [
  "Văn",
  "Văn",
  "Văn",
  "Văn",
  "Toán",
  "Toán",
  "Toán",
  "Toán",
  "Vật lý",
  "Vật lý",
  "Hóa học",
  "Hóa học",
  "Sinh học",
  "Sinh học",
  "Anh",
  "Anh",
  "Anh",
  "Sử",
  "Địa",
  "GDCD",
  "Âm nhạc",
  "Mỹ thuật",
  "Thể dục",
];

for (let i = 0; i < length; i++) {
  const shuffleSubjects = _.shuffle(lessons);

  const schedule = ["Chào cờ", ...shuffleSubjects, "Sinh hoạt"];

  const classSchedule = {
    classRoom: classRoom[i],
    schedule: {
      mon: schedule.slice(0, 5),
      tue: schedule.slice(5, 10),
      wed: schedule.slice(10, 15),
      thu: schedule.slice(15, 20),
      fri: schedule.slice(20, 25),
    },
    isDeleted: false,
  };
  createSchedule(classSchedule).then(() =>
    console.log(`Created ${i + 1} of ${length} schedules`)
  );
}

// create highlights
console.log("Creating highlights...");

async function createHighlight(data) {
  const newHighlight = new Highlight(data);
  await newHighlight.save();
}

const highlight = {
  title: "Kế hoạch tham quan dã ngoại trường THCS Dev School",
  content:
    "<p>Do t&igrave;nh h&igrave;nh nghỉ học c&aacute;ch ly k&eacute;o d&agrave;i, thời gian học sinh được sinh hoạt c&ugrave;ng nhau l&agrave; rất &iacute;t trong năm học n&agrave;y. V&igrave; thế nh&agrave; trường quyết định tổ chức một buổi d&atilde; ngoại k&eacute;o d&agrave;i 2 ng&agrave;y 1 đ&ecirc;m cho c&aacute;c em học sinh khối 6, 7, 8. C&aacute;c em học sinh khối 9 do thời gian c&ograve;n lại của năm học rất &iacute;t, n&ecirc;n để đảm bảo chất lượng cho kỳ thi chuyển cấp được diễn ra v&agrave;o cuối th&aacute;ng 7, c&aacute;c em sẽ học b&igrave;nh thường tại trường.</p><p>Thời gian buổi d&atilde; ngoại: 13 - 14/6/2020</p><p>Địa điểm d&atilde; ngoại: Ba V&igrave;, H&agrave; Nội</p><p>Lịch tr&igrave;nh chi tiết c&aacute;c gi&aacute;o vi&ecirc;n chủ nhiệm sẽ phổ biến đến c&aacute;c em v&agrave;o buổi sinh hoạt cuối tuần n&agrave;y.</p>",
  time: "Fri May 22 2020 18:34:23 GMT+0700 (Indochina Time)",
  isDeleted: false,
};

createHighlight(highlight).then(() => console.log("created highlight"));

// create event
console.log("Creating event");

async function createEvent(data) {
  const newEvent = new Event(data);
  await newEvent.save();
}

const event = {
  time: "Sat Jun 13 2020 00:00:00 GMT+0700 (Indochina Time)",
  content: "Dã ngoại 2 ngày 1 đêm",
  isDeleted: false,
};

createEvent(event).then(() => console.log("Created event"));

// create students
console.log("Creating students...");
let id = 1;
let pad = "0000";

async function createStudent(student) {
  const newStudent = new Parent(student);
  await newStudent.save();
}

for (const room of classRoom) {
  const numberOfStudent = Math.floor(Math.random() * 10 + 35);
  for (let i = 1; i < numberOfStudent; i++) {
    const stId = pad + id;
    id++;

    const names = renderName();
    const yearNow = new Date().getFullYear();

    const data = {
      studentId: stId.substr(stId.length - 5),
      studentName: names.studentName,
      password,
      gender: Math.random() > 0.5,
      grade: Number(room[0]),
      classRoom: room,
      dateOfBirth: dateOfBirth(yearNow - (Number(room[0]) + 6)),
      address: renderAddress(),
      note: "",
      father: {
        name: names.fatherName,
        yearOfBirth: "1987",
        phoneNumber: "0123456789",
        note: "",
      },
      mother: {
        name: names.motherName,
        yearOfBirth: "1987",
        phoneNumber: "0123456789",
        note: "",
      },
      isDeleted: false,
      score1: {
        math: {
          x1: [9, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        literature: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        english: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        physics: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        chemistry: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        biology: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        geography: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        history: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        law: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        music: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        art: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        sport: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
      },
      dayOff1: [],
      finalScore1: -1,
      conduct1: "Tốt",
      result1: "",
      score2: {
        math: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        literature: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        english: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        physics: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        chemistry: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        biology: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        geography: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        history: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        law: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        music: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        art: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
        sport: {
          x1: [10, 9, 9],
          x2: [8, 7],
          x3: [8],
          medium: -1,
        },
      },
      dayOff2: [],
      finalScore2: -1,
      conduct2: "Tốt",
      result2: "",

      subjectTotalScore: {
        math: -1,
        literature: -1,
        english: -1,
        physics: -1,
        chemistry: -1,
        biology: -1,
        geography: -1,
        history: -1,
        law: -1,
        music: -1,
        art: -1,
        sport: -1,
      },
      totalScore: -1,
      totalConduct: "Tốt",
      totalResult: "",
    };
    createStudent(data).then(() =>
      console.log(
        `Created ${
          i + 1
        } students of ${numberOfStudent} students of class ${room}`
      )
    );
  }
}

// create teachers
console.log("Creating teachers...");

async function createTeacher(teacher) {
  const newTeacher = new Teacher(teacher);
  await newTeacher.save();
}

for (const room of classRoom) {
  let count = 1;
  subjects.map((item, index) => {
    const data = {
      name: renderName().studentName,
      password,
      yearOfBirth: "1996",
      gender: Math.random() > 0.5,
      email: `teacher${count}-${room}@gmail.com`,
      phoneNumber: "0123456789",
      mainTeacherOfClass: index === 0 ? room : "",
      teacherOfClass: room,
      subject: item,
      isDeleted: false,
    };

    createTeacher(data).then(() => console.log(`Created ${count} teachers`));

    count++;
  });
}
