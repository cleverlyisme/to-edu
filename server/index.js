const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const { authUser } = require("./middlewares/auth");
const checkUpdate = require("./middlewares/checkUpdate");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connected successfully!")
);

const updateRoute = require("./routes/update.route");
app.use("/updateStatus", updateRoute);

app.use(checkUpdate);

const logInRoute = require("./routes/logIn.route");
app.use("/login", logInRoute);

app.use(authUser);

const userRoute = require("./routes/user.route");
app.use("/user", userRoute);

const informationRoute = require("./routes/information.route");
app.use("/information", informationRoute);

const gradeRoute = require("./routes/grade.route");
app.use("/grade", gradeRoute);

const highlightRoute = require("./routes/highlight.route");
app.use("/highlight", highlightRoute);
