export default [
  { path: "/", name: "Trang chủ", icon: "fas fa-home" },
  {
    path: "/profile",
    name: "Trang cá nhân",
    icon: "fas fa-user-edit",
    roles: ["teacher", "parent"],
  },
  {
    path: "/students",
    name: "Quản lý học sinh",
    icon: "fas fa-users",
    roles: ["admin", "teacher"],
  },
  {
    path: "/teachers",
    name: "Quản lý giáo viên",
    icon: "fas fa-chalkboard-teacher",
    roles: ["admin"],
  },
  {
    path: "/fees",
    name: "Quản lý học phí",
    icon: "fas fa-wallet",
    roles: ["admin"],
  },
  {
    path: "/fees",
    name: "Học phí",
    icon: "fas fa-wallet",
    roles: ["parent"],
  },
  {
    path: "/highlights",
    name: "Thông báo",
    icon: "fas fa-newspaper",
  },
  {
    path: "/gradeAndClass",
    name: "Quản lý lớp học",
    icon: "fas fa-school",
    roles: ["admin"],
  },
  {
    path: "/timeInfo",
    name: "Thông tin năm học",
    icon: "fas fa-info",
    roles: ["admin"],
  },
];
