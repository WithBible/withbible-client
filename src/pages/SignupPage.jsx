import React, { useContext, useReducer, useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Container, Typography, Box, TextField, Button } from "@mui/material";

// INTERNAL IMPORT
import Style from "./page.module.css";
import { SIGNUP_URI } from "../constants/api";
import { LOGIN_PATH } from "../constants/route";
import { PasswordInput } from "../components";
import { AuthContext } from "../contexts/AuthContext";
import { AUTH_HEADER_CONFIG } from "../constants/config";

// VO
const initialState = {
  userName: "",
  userEmail: "",
  userID: "",
  password: "",
};

const initialValidityState = {
  userNameError: null,
  userEmailError: null,
  userIDError: null,
  passwordError: null,
};

// MAIN
function SignupPage() {
  const { payLoadReducer, payLoadValidityReducer, isAllValid, setUserID } =
    useContext(AuthContext);
  const [payload, setPayload] = useReducer(payLoadReducer, initialState);
  const [payloadValidity, setPayloadValidity] = useReducer(
    payLoadValidityReducer,
    initialValidityState
  );
  const [isValid, setIsValid] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    setIsValid(isAllValid(payloadValidity));
  }, [payloadValidity]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios({
        method: "post",
        url: SIGNUP_URI,
        auth: {
          username: payload.userID,
          password: payload.password,
        },
        data: {
          userName: payload.userName,
          userEmail: payload.userEmail,
        },
        ...AUTH_HEADER_CONFIG,
      });
      setUserID(data.result.userID);
      history.push("/");
    } catch (error) {
      const { message } = error.response.data;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <Container className={Style.container}>
      <Typography variant="h5">????????????</Typography>

      <Box
        component="form"
        className={Style.formContainer}
        onSubmit={handleSubmit}
      >
        <TextField
          required
          error={payloadValidity.userNameError}
          helperText={
            payloadValidity.userNameError && "?????? ?????? ????????? ???????????????."
          }
          variant="standard"
          label="??????"
          name="userName"
          inputProps={{
            onBlur: () =>
              setPayloadValidity({
                type: "VALIDATE_USER_NAME",
                value: payload.userName,
              }),
          }}
          onChange={(event) => setPayload({ type: event.target })}
        />

        <TextField
          required
          error={payloadValidity.userEmailError}
          helperText={
            payloadValidity.userEmailError && "????????? ????????? ?????? ????????????."
          }
          variant="standard"
          label="?????????"
          name="userEmail"
          inputProps={{
            onBlur: () =>
              setPayloadValidity({
                type: "VALIDATE_USER_EMAIL",
                value: payload.userEmail,
              }),
          }}
          onChange={(event) => setPayload({ type: event.target })}
        />

        <TextField
          required
          error={payloadValidity.userIDError}
          helperText={
            payloadValidity.userIDError && "????????? ?????? ????????? ???????????????."
          }
          variant="standard"
          label="?????????"
          name="userID"
          inputProps={{
            onBlur: () =>
              setPayloadValidity({
                type: "VALIDATE_USER_ID",
                value: payload.userID,
              }),
          }}
          onChange={(event) => setPayload({ type: event.target })}
        />

        <PasswordInput
          payload={payload}
          setPayload={setPayload}
          setPayloadValidity={setPayloadValidity}
          isError={payloadValidity.passwordError}
        />

        <Button disabled={!isValid} type="submit">
          ??????
        </Button>
      </Box>

      <Box component={Link} to={LOGIN_PATH}>
        ????????? ????????????????
      </Box>
    </Container>
  );
}

export default SignupPage;
