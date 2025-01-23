let { DataTypes, sequelize } = require("../lib/");
let { course } = require("./course.js");
let { student } = require("./student.js");

let studentCourse = sequelize.define("bookAuthor", {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: student,
      key: "id",
    },
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: course,
      key: "id",
    },
  },
});

course.belongsToMany(student, { through: studentCourse });
student.belongsToMany(course, { through: studentCourse });

module.exports = { studentCourse };
