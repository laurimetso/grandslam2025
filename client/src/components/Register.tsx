import { useState } from "react"
import { Box, Button, TextField, Checkbox } from "@mui/material"

// Put your backend API base URL here or use environment variables like import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = "http://localhost:1234" // change this to your deployed backend URL in production

const fetchData = async (email: string, password: string, isAdmin: boolean) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, isAdmin }),
    })

    const data = await response.json()

    console.log(data)

    const errors: { [key: string]: string } = {}

    if (!response.ok && data.errors) {
      data.errors.forEach((error: { path: string; msg: string }) => {
        errors[String(error.path)] = error.msg
      })
    } else if (!response.ok) {
      // If backend sends a general error but no validation errors array
      errors.general = data.message || "Registration failed."
    } else {
      // Successful registration - redirect to login page
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
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({})

  const handleSubmit = async () => {
    setErrors({})

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." })
      return
    }

    const validationErrors = await fetchData(email, password, isAdmin)
    if (validationErrors) {
      setErrors(validationErrors)
    }
  }

  return (
    <div className="registerDiv">
      <h2>rekister öidy :</h2>
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
          id="email"
          label="Email"
          value={email}
          size="small"
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            input: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "white" },
            label: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "black" },
          }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          id="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password}
          value={password}
          size="small"
          sx={{
            input: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "white" },
            label: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "black" },
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          required
          id="confirm-password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          size="small"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          sx={{
            input: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "white" },
            label: { fontFamily: "Courier New, monospace", fontSize: "16px", color: "black" },
          }}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

        <label>are you an admin?</label>
        <Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} name="isAdmin" />

        <Button
          variant="contained"
          sx={{ width: "10ch", m: 0.5, textTransform: "none", fontFamily: "Courier New, monospace" }}
          color="primary"
          onClick={handleSubmit}
        >
          register
        </Button>
      </Box>
    </div>
  )
}

export default Register
