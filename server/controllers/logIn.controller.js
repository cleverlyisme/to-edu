const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const Base64 = require("js-base64").Base64;

const Parent = require("../models/parent.model");
const Teacher = require("../models/teacher.model");
const Admin = require("../models/admin.model");
const Semester = require("../models/semester.model");

const {
  developDomain,
  productDomain,
  forgetPasswordText,
  forgetPasswordHtml,
  forgetPasswordSubject,
  schoolEmail,
} = require("../utils/constant");

const sendSms = require("../utils/sendSms");
const sendEmail = require("../utils/sendEmail");

module.exports.logIn = async (req, res) => {
  const role = req.body.role;
  const identity = req.body.identity;
  const password = req.body.password;

  const semester = await Semester.findOne();
  const isFirstSemester = semester.semester === 1;
  const dayOff = isFirstSemester ? "dayOff1" : "dayOff2";

  switch (role) {
    case "parent":
      return Parent.findOne({ studentId: identity, isDeleted: false })
        .then((student) => {
          if (student && passwordHash.verify(password, student.password)) {
            const data = {
              _id: student._id,
              studentId: student.studentId,
              studentName: student.studentName,
              gender: student.gender,
              grade: student.grade,
              classRoom: student.classRoom,
              fees: student.fees,
              dateOfBirth: student.dateOfBirth,
              address: student.address,
              note: student.note,
              father: student.father,
              mother: student.mother,
              dayOff: student[dayOff],
              role: "parent",
            };

            const access_token = jwt.sign(
              data,
              process.env.ACCESS_TOKEN_SECRET_KEY,
              { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
            );

            let refresh_token = null;

            if (!student.refreshToken) {
              refresh_token = jwt.sign(
                data,
                process.env.REFRESH_TOKEN_SECRET_KEY,
                {
                  expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
                }
              );

              student.refreshToken = refresh_token;

              student.save();
            } else {
              try {
                jwt.verify(
                  student.refreshToken,
                  process.env.REFRESH_TOKEN_SECRET_KEY
                );
                refresh_token = student.refreshToken;
              } catch {
                refresh_token = jwt.sign(
                  data,
                  process.env.REFRESH_TOKEN_SECRET_KEY,
                  {
                    expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
                  }
                );

                student.refreshToken = refresh_token;

                student.save();
              }
            }

            res.status(200).json({
              data,
              access_token,
              refresh_token,
              access_from: new Date().getTime(),
            });
          } else {
            res.status(401).json("Thông tin đăng nhập không hợp lệ");
          }
        })
        .catch((err) => {
          res.status(401).json(err.message);
        });

    case "teacher":
      return Teacher.findOne({ email: identity, isDeleted: false })
        .then((teacher) => {
          if (teacher && passwordHash.verify(password, teacher.password)) {
            const data = {
              _id: teacher._id,
              name: teacher.name,
              email: teacher.email,
              phoneNumber: teacher.phoneNumber,
              yearOfBirth: teacher.yearOfBirth,
              gender: teacher.gender,
              mainTeacherOfClass: teacher.mainTeacherOfClass,
              teacherOfClass: teacher.teacherOfClass,
              subject: teacher.subject,
              role: "teacher",
            };

            const access_token = jwt.sign(
              data,
              process.env.ACCESS_TOKEN_SECRET_KEY,
              { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
            );

            let refresh_token = null;

            if (!teacher.refreshToken) {
              refresh_token = jwt.sign(
                data,
                process.env.REFRESH_TOKEN_SECRET_KEY,
                {
                  expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
                }
              );

              teacher.refreshToken = refresh_token;

              teacher.save();
            } else {
              try {
                jwt.verify(
                  teacher.refreshToken,
                  process.env.REFRESH_TOKEN_SECRET_KEY
                );
                refresh_token = teacher.refreshToken;
              } catch {
                refresh_token = jwt.sign(
                  data,
                  process.env.REFRESH_TOKEN_SECRET_KEY,
                  {
                    expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
                  }
                );

                teacher.refreshToken = refresh_token;

                teacher.save();
              }
            }

            res.status(200).json({
              data,
              access_token,
              refresh_token,
              access_from: new Date().getTime(),
            });
          } else {
            res.status(401).json("Thông tin đăng nhập không hợp lệ");
          }
        })
        .catch((err) => {
          res.status(401).json(err.message);
        });
    case "admin":
      return Admin.findOne({ email: identity, isDeleted: false })
        .then((admin) => {
          if (admin && passwordHash.verify(password, admin.password)) {
            const data = {
              _id: admin._id,
              email: admin.email,
              role: "admin",
            };

            const access_token = jwt.sign(
              data,
              process.env.ACCESS_TOKEN_SECRET_KEY,
              { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
            );

            let refresh_token = null;

            if (!admin.refreshToken) {
              refresh_token = jwt.sign(
                data,
                process.env.REFRESH_TOKEN_SECRET_KEY,
                {
                  expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
                }
              );

              admin.refreshToken = refresh_token;

              admin.save();
            } else {
              try {
                jwt.verify(
                  admin.refreshToken,
                  process.env.REFRESH_TOKEN_SECRET_KEY
                );
                refresh_token = admin.refreshToken;
              } catch {
                refresh_token = jwt.sign(
                  data,
                  process.env.REFRESH_TOKEN_SECRET_KEY,
                  {
                    expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
                  }
                );

                admin.refreshToken = refresh_token;

                admin.save();
              }
            }

            res.status(200).json({
              data,
              access_token,
              refresh_token,
              access_from: new Date().getTime(),
            });
          } else {
            console.log(err.message);
            res.status(401).json("Thông tin đăng nhập không hợp lệ");
          }
        })
        .catch((err) => {
          res.status(401).json(err.message);
        });
    default:
      return res.status(400).json("Đăng nhập thất bại");
  }
};

module.exports.getUserInformation = async (req, res) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : "";

  const semester = await Semester.findOne();
  const isFirstSemester = semester.semester === 1;
  const dayOff = isFirstSemester ? "dayOff1" : "dayOff2";

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    switch (userInfo.role) {
      case "admin":
        const admin = await Admin.findOne({
          _id: userInfo._id,
          isDeleted: false,
        });
        if (!admin) {
          throw new Error("Lấy thông tin người dùng thất bại");
        }
        return res.status(200).json({
          data: {
            _id: admin._id,
            email: admin.email,
            role: "admin",
          },
        });

      case "teacher":
        const teacher = await Teacher.findOne({
          _id: userInfo._id,
          isDeleted: false,
        });
        if (!teacher) {
          throw new Error("Lấy thông tin người dùng thất bại");
        }
        return res.status(200).json({
          data: {
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            phoneNumber: teacher.phoneNumber,
            yearOfBirth: teacher.yearOfBirth,
            gender: teacher.gender,
            mainTeacherOfClass: teacher.mainTeacherOfClass,
            teacherOfClass: teacher.teacherOfClass,
            subject: teacher.subject,
            role: "teacher",
          },
        });

      case "parent":
        const parent = await Parent.findOne({
          _id: userInfo._id,
          isDeleted: false,
        });
        if (!parent) {
          throw new Error("Lấy thông tin người dùng thất bại");
        }
        return res.status(200).json({
          data: {
            _id: parent._id,
            studentId: parent.studentId,
            studentName: parent.studentName,
            classRoom: parent.classRoom,
            gender: parent.gender,
            grade: parent.grade,
            dateOfBirth: parent.dateOfBirth,
            address: parent.address,
            note: parent.note,
            father: parent.father,
            mother: parent.mother,
            dayOff: parent[dayOff],
            fees: parent.fees,
            role: "parent",
          },
        });

      default:
        return res.status(401).json("Unthorizated");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports.getUserInformationAndNewAccessToken = async (req, res) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : "";

  const semester = await Semester.findOne();
  const isFirstSemester = semester.semester === 1;
  const dayOff = isFirstSemester ? "dayOff1" : "dayOff2";

  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    const userInfo = jwt.decode(token, process.env.REFRESH_TOKEN_SECRET_KEY);

    switch (userInfo.role) {
      case "admin":
        return Admin.findOne({ refreshToken: token, isDeleted: false })
          .then((admin) => {
            if (
              admin &&
              jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY)
            ) {
              const data = {
                _id: admin._id,
                email: admin.email,
                role: "admin",
              };

              const access_token = jwt.sign(
                data,
                process.env.ACCESS_TOKEN_SECRET_KEY,
                {
                  expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE,
                }
              );

              res.status(200).json({
                data,
                access_token,
                refresh_token: token,
                access_from: new Date().getTime(),
              });
            } else {
              res.status(401).json("Unthorizated");
            }
          })
          .catch((err) => {
            res.status(500).send(err.message);
          });

      case "teacher":
        return Teacher.findOne({
          refreshToken: token,
          isDeleted: false,
        })
          .then((teacher) => {
            if (
              teacher &&
              jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY)
            ) {
              const data = {
                _id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                phoneNumber: teacher.phoneNumber,
                yearOfBirth: teacher.yearOfBirth,
                gender: teacher.gender,
                mainTeacherOfClass: teacher.mainTeacherOfClass,
                teacherOfClass: teacher.teacherOfClass,
                subject: teacher.subject,
                role: "teacher",
              };

              const access_token = jwt.sign(
                data,
                process.env.ACCESS_TOKEN_SECRET_KEY,
                {
                  expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE,
                }
              );

              res.status(200).json({
                data,
                access_token,
                refresh_token: token,
                access_from: new Date().getTime(),
              });
            } else {
              res.status(401).json("Unthorizated");
            }
          })
          .catch((err) => {
            res.status(500).send(err.message);
          });

      case "parent":
        return Parent.findOne({ refreshToken: token, isDeleted: false })
          .then((student) => {
            if (
              student &&
              jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY)
            ) {
              const data = {
                _id: student._id,
                studentId: student.studentId,
                studentName: student.studentName,
                classRoom: student.classRoom,
                gender: student.gender,
                grade: student.grade,
                dateOfBirth: student.dateOfBirth,
                address: student.address,
                note: student.note,
                father: student.father,
                mother: student.mother,
                dayOff: student[dayOff],
                role: "parent",
              };

              const access_token = jwt.sign(
                data,
                process.env.ACCESS_TOKEN_SECRET_KEY,
                {
                  expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE,
                }
              );

              res.status(200).json({
                data,
                access_token,
                refresh_token: token,
                access_from: new Date().getTime(),
              });
            } else {
              res.status(401).json("Unthorizated");
            }
          })
          .catch((err) => {
            res.status(500).send(err.message);
          });

      default:
        return res.status(401).json("Unthorizated");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
};

let resetPasswordRequest = [];

module.exports.forgetPassword = async (req, res) => {
  try {
    const { role, identity } = req.body;
    if (!["admin", "teacher", "parent"].includes(role))
      throw new Error("Bad request");

    const isAdmin = role === "admin";
    const isTeacher = role === "teacher";
    const isParent = role === "parent";

    if (isAdmin) {
      const email = identity;
      const admin = await Admin.findOne({ isDeleted: false, email });
      if (!admin) throw new Error("User doesn't exist");

      const secretKey = "ds" + Base64.encode(`admin&&${admin._id}`);
      const domain =
        process.env.ENVIRONMENT === "DEVELOPMENT"
          ? developDomain
          : productDomain;

      const emailToSent =
        process.env.ENVIRONMENT === "DEVELOPMENT"
          ? "tuananhdao.dev.js@gmail.com"
          : email;

      const resetPasswordUrl = `${domain}/resetPassword/${secretKey}`;
      resetPasswordRequest = [
        ...resetPasswordRequest,
        { time: new Date().getTime(), secretKey },
      ];

      // send resetPasswordUrl to admin email
      const data = {
        to: emailToSent,
        from: schoolEmail,
        subject: forgetPasswordSubject,
        text: forgetPasswordText.replace("$url$", resetPasswordUrl),
        html: forgetPasswordHtml.replace("$url$", resetPasswordUrl),
      };

      sendEmail(data);
    }

    if (isTeacher) {
      const email = identity;
      const teacher = await Teacher.findOne({ isDeleted: false, email });
      if (!teacher) throw new Error("User doesn't exist");

      const secretKey = "ds" + Base64.encode(`teacher&&${teacher._id}`);
      const domain =
        process.env.ENVIRONMENT === "DEVELOPMENT"
          ? developDomain
          : productDomain;
      const emailToSent =
        process.env.ENVIRONMENT === "DEVELOPMENT"
          ? "tuananhdao.dev.js@gmail.com"
          : email;

      const resetPasswordUrl = `${domain}/resetPassword/${secretKey}`;
      resetPasswordRequest = [
        ...resetPasswordRequest,
        { time: new Date().getTime(), secretKey },
      ];

      // send resetPasswordUrl to teacher email
      const data = {
        to: emailToSent,
        from: schoolEmail,
        subject: forgetPasswordSubject,
        text: forgetPasswordText.replace("$url$", resetPasswordUrl),
        html: forgetPasswordHtml.replace("$url$", resetPasswordUrl),
      };

      sendEmail(data);
    }

    if (isParent) {
      const studentId = identity;
      const student = await Parent.findOne({
        isDeleted: false,
        studentId,
      });
      if (!student) throw new Error("User doesn't exist");

      const secretKey = "ds" + Base64.encode(`parent&&${student._id}`);
      const domain =
        process.env.ENVIRONMENT === "DEVELOPMENT"
          ? developDomain
          : productDomain;

      const resetPasswordUrl = `${domain}/resetPassword/${secretKey}`;
      resetPasswordRequest = [
        ...resetPasswordRequest,
        { time: new Date().getTime(), secretKey },
      ];

      const phoneNumber = student.father.phoneNumber
        ? student.father.phoneNumber
        : student.mother.phoneNumber;

      // send resetPasswordUrl to parent phone number
      const body = forgetPasswordText.replace("$url$", resetPasswordUrl);

      const to =
        process.env.ENVIRONMENT === "DEVELOPMENT"
          ? "+84337223434"
          : phoneNumber.replace("0", "+84");

      sendSms(to, body);
    }

    res
      .status(200)
      .send("Liên kết reset password đã được gửi. Hết hạn trong 15 phút");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { secretKey, newPassword } = req.body;

    const isSigned = resetPasswordRequest.find(
      (item) => item.secretKey === secretKey
    );

    if (!isSigned) throw new Error("Invalid request");

    if (new Date().getTime() - isSigned.time > 900000) {
      resetPasswordRequest = resetPasswordRequest.filter(
        (item) => item.secretKey !== secretKey
      );
      throw new Error("Liên kết hết hạn");
    }

    const encodedId = secretKey.slice(2, secretKey.length);
    const decodeInfo = Base64.decode(encodedId);

    const [role, id] = decodeInfo.split("&&");

    const isAdmin = role === "admin";
    const isTeacher = role === "teacher";
    const isParent = role === "parent";

    if (isAdmin) {
      const admin = await Admin.findOne({ isDeleted: false, _id: id });
      if (!admin) throw new Error("Người dùng không tồn tại");

      admin.password = passwordHash.generate(newPassword);
      await admin.save();
    }

    if (isTeacher) {
      const teacher = await Teacher.findOne({ isDeleted: false, _id: id });
      if (!teacher) throw new Error("User doesn't exist");

      teacher.password = passwordHash.generate(newPassword);
      await teacher.save();
    }

    if (isParent) {
      const parent = await Parent.findOne({ isDeleted: false, _id: id });
      if (!parent) throw new Error("Người dùng không tồn tại");

      parent.password = passwordHash.generate(newPassword);
      await parent.save();
    }

    resetPasswordRequest = resetPasswordRequest.filter(
      (item) => item.secretKey !== secretKey
    );

    res.status(200).send("Cập nhật mật khẩu thành công");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
