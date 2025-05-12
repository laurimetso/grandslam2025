import { useState } from "react"
import { Box, Button, TextField, Checkbox } from "@mui/material"

// fetch function to send data to the backend and get validation errors
const fetchData = async (email: string, password: string, isAdmin: boolean) => {
  try {
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, isAdmin }), // send email, password and admin status to the backend
    })
    const data = await response.json()

    console.log(data)
    // handle errors and build error object
    const errors: { [key: string]: string } = {} // error object (i know this is horrid). 
    // stores error messages with keys. key is a string e.g. email, password and value is a string with the error message

    if (!response.ok && data.errors) { // mount errors that come from backend to the error object
      data.errors.forEach((error: { path: string, msg: string }) => // loop through the errors array from the backend
        errors[String(error.path)] = error.msg // my eyes ;__; // store errors in the error object
      )
    } else { // if registering is successful, redirect user to login part
      window.location.href = "/login"
    }
    return errors

  } catch (error) {
    return { general: "Server error. Please try again later." }
  }
}

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string, password?: string, confirmPassword?: string, general?: string }>({})

  const handleSubmit = async () => { // function to handle submitting, i thought this was clever with the errors and all
    setErrors({}) // reset errors before submitting

    // check if passwords match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." })
      return // don't submit if passwords don't match
    }

    // call the fetchData function to get validation errors
    const validationErrors = await fetchData(email, password, isAdmin)

    // update the error state with any errors returned from the backend
    if (validationErrors) {
      setErrors(validationErrors)
    }
  }

  return (
    <div className="registerDiv">
      <h2>rekister öidy :</h2>
      <Box
        component="form" // form type
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate

      >
        <TextField
          required
          id="email"
          label="Email"
          value={email}
          size="small"
          error={!!errors.email} // show error for email if there is one
          helperText={errors.email} // display the error message for email
          sx={{
            input: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "white" }, // styling
            label: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "black" }, // styling
          }}
          onChange={(e) => setEmail(e.target.value)} // when this text field is changed i.e user is typing on it, setEmail to the value which is being written
        />

        <TextField
          className="textField"
          required
          id="password"
          label="Password"
          type="password"
          error={!!errors.password} // show error for password if there is one
          helperText={errors.password} // display the error message for password
          value={password}
          size="small"
          sx={{
            input: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "white" },
            label: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "black" },
          }}
          onChange={(e) => setPassword(e.target.value)} // when this text field is changed i.e user is typing on it, setPassword to the value which is being written
        />

        <TextField
          required
          id="confirm-password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          size="small"
          error={!!errors.confirmPassword} // show error if passwords don't match
          helperText={errors.confirmPassword} // display the error message for confirm password
          sx={{
            input: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "white" },
            label: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "black" },
          }}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>} {/* general error message */}

        <label>are you an admin?</label>
        <Checkbox
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)} // when this text field is changed i.e user presses it, setIsAdmin is set to true
          name="isAdmin"
        />

        <Button
          variant="contained"
          sx={{ width: "10ch", m: 0.5, textTransform: "none", fontFamily: "Courier New, Courier, monospace" }}
          color="primary"
          onClick={handleSubmit} // button to register; runs handleSubmit which runs fetchData
        >
          register
        </Button>
      </Box>
    </div>
  )
}

export default Register
