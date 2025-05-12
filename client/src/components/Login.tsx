import { useState } from "react"
import { Box, Button, TextField } from "@mui/material"

// fetch function to send data to the backend and handle errors
const fetchData = async (email: string, password: string): Promise<string> => {
  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // send email and password to the backend
    })

    const data = await response.json()

    if (!response.ok) { // if login is unsuccessful throw a general error; don't want to be too specific since we are a secure website lololol
      throw new Error("Error when trying to log in. Check your email and password combination.")
    }

    if (data.token) { // check if response has a token, e.g if login is successful
      localStorage.setItem("token", data.token)
      window.location.href = "/"
      return "" // return an empty string if login is successful. spaghetti specialo
    }

    return "" // return an empty string if no token is found, though this case should be rare. a bit spaghetti code sure but here we are

  } catch (error) {
    return error instanceof Error ? error.message : "An unknown error occurred."
  }
}

// function for logging in
const Login = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleSubmit = async () => {
    setError("") // clear previous errors

    const validationError = await fetchData(email, password) // get errors

    if (validationError) {
      setError(validationError) // set the error
    }
  }


  // login form
  return (
    <div className="loginDiv">
      <h2>login:</h2>
      <Box
        component="form"
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
          id="filled-required"
          label="Email"
          size="small"
          sx={{
            input: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "white" },
            label: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "black" },
          }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          id="filled-password-input"
          label="Password"
          type="password"
          size="small"
          sx={{
            input: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "white" },
            label: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "black" },
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>} {/* this is where errors are shown */}
 
        <Button
          variant="contained"
          sx={{
            width: "10ch",
            m: 0.5,
            textTransform: "none",
            fontFamily: "Courier New, Courier, monospace",
          }}
          color="primary"
          onClick={handleSubmit}
        >
          login
        </Button>
      </Box>
    </div>
  )
}
export default Login
