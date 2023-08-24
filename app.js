const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const cors = require("cors");
////////////////////////////////////////////////////////////////
var fsWin = require("fswin");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hi i am sugam");
});

var attributes = {
  IS_ARCHIVED: true, //true means yes
  IS_HIDDEN: true, //false means no
  //IS_NOT_CONTENT_INDEXED: true, //remove this attribute if you don't want to change it
  IS_OFFLINE: false,
  IS_READ_ONLY: true,

  IS_SYSTEM: false,
  IS_TEMPORARY: true,
  IS_UNPINNED: true,
  IS_PINNED: false,
};

app.post("/post", async (req, res) => {
  const folderName = "C:/UserPrivatedata";
  console.log("request body",req.body)
  res.send("req body")
    try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);

      fs.writeFileSync(
        folderName + "/userData.json",
        JSON.stringify(req.body),
        function (err) {
          if (err) throw err;
          res.status(200).json({ msg: "Success" });
          console.log("File is created successfully.");
        }
      );

      fsWin.setAttributes(
        folderName,
        { IS_HIDDEN: true },
        // attributes
        (fswinErr) => {
          if (fswinErr) {
            console.error("Error setting hidden attribute:", fswinErr);
          } else {
            console.log("Directory created and hidden successfully.");
          }
        }
      );
    } else {
      fs.writeFileSync(
        folderName + "/userData.json",
        JSON.stringify(req.body),
        function (err) {
          if (err) throw err;
          res.status(200).json({ msg: "Success" });
          console.log("File is created successfully.");
        }
      );

      fsWin.setAttributes(
        folderName+"/userData.json",
        { IS_HIDDEN: true },

        (fswinErr) => {
          if (fswinErr) {
            console.error("Error setting hidden attribute:", fswinErr);
          } else {
            console.log("Directory created and hidden successfully.");
          }
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/get", (req, res) => {
  const folderName = "C:/UserPrivatedata";
  if (!fs.existsSync(folderName))
    res
      .status(500)
      .send({ message: "NO data Found,please create data first!" });

  if (fs.existsSync(folderName + "/userData.json")) {
    const filePath = "C:/UserPrivatedata/userData.json";
    const data = fs.readFileSync(filePath, "utf-8");

    res.status(200).json({ msg: "Success", data: JSON.parse(data) });
    console.log("send successfully.");
    fsWin.setAttributes(folderName + "/userData.json", { IS_HIDDEN: true });
  } else
    res
      .status(500)
      .send({ message: "NO data Found,please create data first!" });
});

app.listen(8080, () => {
  try {
    console.log("connection successful");
  } catch (err) {
    console.log(err);
  }
});
