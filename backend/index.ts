import express from "express";
import _ from "lodash";
import axios from "axios";
const app = express();
const port = 9876;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

type VerifyRecaptchaTokenArgs = {
  secret: string;
  token: string;
};
const verifyRecaptchaToken = async (args: VerifyRecaptchaTokenArgs) => {
  const { secret, token } = args;
  if (!token || !secret) {
    throw new Error("reCAPTCHA secret or token is invalid");
  }
  console.warn('sending request to https://api.hcaptcha.com/siteverify');

  const response = await axios({
    method: 'post',
    url: 'https://hcaptcha.com/siteverify',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: `response=${token}&secret=${secret}`
  })  

  console.log("reCAPTCHA siteverify result: ", response.data);

  if (!response.data.success) {
    throw new Error("reCAPTCHA token is invalid");
  }
};

const getSecretByRecaptchaVersion = (version: string) => {
  switch (version) {
    case "V2_CHECKBOX":
      return "0x5cdC32f787Bda25a1b08A68EF69919F16778eb93"; // replace with your secret key
    case "V2_INVISIBLE":
      return "0x5cdC32f787Bda25a1b08A68EF69919F16778eb93"; // replace with your secret key
    default:
      throw new Error("hCAPTCHA secret not found");
  }
};

const validateUsername = (username: string) => {
  if (username.length < 2) {
    throw new Error("Invalid username");
  }
};

app.post("/api/user/registration", async (req, res) => {
  const recaptchaVersion = _.trim(_.get(req.body, "recaptchaVersion"));
  const username = _.trim(_.get(req.body, "username"));
  const token = _.trim(_.get(req.body, "recaptchaToken"));

  try {
    validateUsername(username);
    const secret = getSecretByRecaptchaVersion(recaptchaVersion);
    await verifyRecaptchaToken({ token, secret });
    // ... Register ...
    res.status(201).json({ result: "SUCCESS", username });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      result: "FAIL",
      error: _.get(e, "message") ? _.get(e, "message") : JSON.stringify(e),
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
