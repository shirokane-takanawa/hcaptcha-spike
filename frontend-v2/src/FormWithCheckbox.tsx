import React from "react";
import axios from "axios";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import trim from "lodash/trim";

const SITE_KEY = trim(process.env.REACT_APP_RECAPTCHA_KEY_CHECKBOX);

const FormWithCheckbox: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null);
  const [registrationResult, setRegistrationResult] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleRecaptchaChange = React.useCallback((token: string | null , ekey: string | null ) => {
    console.log("FormWithCheckbox::handleHCaptureChange > token: ", token);
    console.log("FormWithCheckbox::handleHCaptureChange > token: ", ekey);
    setRecaptchaToken(token);
  }, []);

  const handleUsernameChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = trim(event.target.value);
    setUsername(value);
  }, []);

  const handleClickRegister = React.useCallback(async () => {
    setErrorMessage("");

    if (!recaptchaToken) {
      alert("Please click reCAPTCHA checkbox!");
      return;
    }

    try {
      const response = await axios.post("/api/user/registration", {
        username,
        recaptchaToken,
        recaptchaVersion: "V2_CHECKBOX",
      });
      const { result } = response.data;
      console.log("FormWithCheckbox::handleClickRegister > result: ", result);
      setRegistrationResult(trim(result));
      alert("Register success");
    } catch (e: any) {
      const response = e.response;
      const { result, error } = response.data;
      setRegistrationResult(trim(result));
      setErrorMessage(trim(error));
    }
  }, [recaptchaToken, username]);

  return (
    <form className="Form" data-testid="FormWithCheckbox" data-registration-result={registrationResult}>
      <div>
        <label>
          <span>username: </span>
          <input type="text" name="username" value={username} onChange={handleUsernameChange} />
        </label>
      </div>
      
      <HCaptcha sitekey={SITE_KEY} onVerify={(token,ekey) => handleRecaptchaChange(token, ekey)} />

      <button type="button" onClick={handleClickRegister}>
        register
      </button>

      {errorMessage && <div className="Error">{errorMessage}</div>}
    </form>
  );
};

export default FormWithCheckbox;
