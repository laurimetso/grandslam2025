import { useState, useEffect } from "react"
import "../styles/board.css"
import { Button, TextField, Typography } from "@mui/material"
import { jwtDecode } from "jwt-decode"

interface Column {
  _id: string
  title: string
}

interface Player {
  _id: string
  email: string
  points: number
}

interface KanbanCard {
  _id: string
  title: string
  description: string
  columnId: string
}

const registerRedirect = () => {
  window.location.href = "/register"
}

const loginRedirect = () => {
  window.location.href = "/login"
}

const kanban = () => {
  const [jwt, setJwt] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [pointsByPlayer, setPointsByPlayer] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token")
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setIsAdmin(decoded.isAdmin)
        setJwt(token)
      } catch (err) {
        console.error("Virhe JWT:n purkamisessa:", err)
      }
    }
  }, [])

  useEffect(() => {
    if (jwt) {
      fetch("/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setPlayers(data))
        .catch((err) => console.error("Virhe haettaessa pelaajia:", err))
    }
  }, [jwt])

  const savePoints = async (playerId: string, newPoints: number) => {
    try {
      const response = await fetch(`/api/users/${playerId}/points`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ points: newPoints }),
      })

      if (!response.ok) {
        throw new Error("Pisteiden tallennus epäonnistui")
      }

      const updatedPlayer = await response.json()
      setPlayers((prev) =>
        prev.map((p) => (p._id === updatedPlayer._id ? updatedPlayer : p))
      )
    } catch (err) {
      console.error("Virhe pisteiden tallennuksessa:", err)
    }
  }

  return (
    <div>
      <h1>grande slame 2025</h1>
      {jwt ? (
        <div>
          <Typography variant="h5"  sx={{
              width: "10ch",
              m: 0.5,
              textTransform: "none",
              fontFamily: "Courier New, Courier, monospace",
            }}>
            Pistetaulukko
          </Typography>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Pelaaja</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Pisteet</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player._id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{player.email}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {isAdmin ? (
                      <>
                        <TextField
                          type="number"
                          size="small"
                          defaultValue={player.points}
                          onChange={(e) =>
                            setPointsByPlayer((prev) => ({
                              ...prev,
                              [player._id]: parseInt(e.target.value),
                            }))
                          }
                          sx={{ width: "80px", marginRight: "8px" }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            savePoints(player._id, pointsByPlayer[player._id] ?? player.points)
                          }
                        >
                          Tallenna
                        </Button>
                      </>
                    ) : (
                      <Typography>{player.points}</Typography>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h2>jäbä sä et oo kirjautunu sisään</h2>
          <Button
            variant="contained"
            sx={{
              width: "10ch",
              m: 0.5,
              textTransform: "none",
              fontFamily: "Courier New, Courier, monospace",
            }}
            color="primary"
            onClick={loginRedirect}
          >
            kirjaudu
          </Button>
          <p>jos sulla ei oo käyttäjää nii tee semmoi</p>
          <Button
            variant="contained"
            sx={{
              width: "10ch",
              m: 0.5,
              textTransform: "none",
              fontFamily: "Courier New, Courier, monospace",
            }}
            color="primary"
            onClick={registerRedirect}
          >
            rekister
          </Button>
        </div>
      )}
    </div>
  )
}

export default kanban
