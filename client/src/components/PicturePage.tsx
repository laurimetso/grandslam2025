import { useState, useEffect } from "react"
import { Button, Typography } from "@mui/material"
import { jwtDecode } from "jwt-decode"
import "../styles/board.css"

interface ImageItem {
  _id: string
  imageUrl: string
}

const Kanban = () => {
  const [jwt, setJwt] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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
    fetch("/api/images")
      .then((res) => {
        if (!res.ok) throw new Error("Virhe palvelimelta")
        return res.json()
      })
      .then((data) => setImages(data))
      .catch((err) => console.error("Virhe haettaessa kuvia:", err))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadImage = async () => {
    if (!selectedFile || !jwt) return

    const formData = new FormData()
    formData.append("image", selectedFile) // ✅ korjattu nimi

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Kuvan lähetys epäonnistui")

      const addedImage = await res.json()
      setImages((prev) => [...prev, addedImage])
      setSelectedFile(null)
    } catch (err) {
      console.error("Virhe kuvan latauksessa:", err)
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Granded Salm 2025 - Kuvagalleria</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        {images.map((img) => (
          <img
            key={img._id}
            src={img.imageUrl}
            alt="kuva"
            style={{ width: "200px", height: "auto", borderRadius: "8px", objectFit: "cover" }}
          />
        ))}
      </div>

      {isAdmin && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Typography>Lataa uusi kuva laitteeltasi:</Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button variant="contained" onClick={uploadImage} disabled={!selectedFile}>
            Lisää kuva
          </Button>
        </div>
      )}
    </div>
  )
}

export default Kanban
