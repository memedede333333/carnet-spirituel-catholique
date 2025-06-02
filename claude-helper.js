const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.json({ limit: '10mb' }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'POST, GET')
  next()
})

app.post('/write-file', (req, res) => {
  try {
    const { filePath, content } = req.body
    
    console.log('Claude écrit :', filePath)
    
    const fullPath = path.join(process.cwd(), filePath)
    const dir = path.dirname(fullPath)
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(fullPath, content, 'utf8')
    
    console.log('Fichier écrit avec succès')
    res.json({ 
      success: true, 
      message: 'Fichier écrit avec succès',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erreur :', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/read-file', (req, res) => {
  try {
    const { filePath } = req.query
    const fullPath = path.join(process.cwd(), filePath)
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' })
    }
    
    const content = fs.readFileSync(fullPath, 'utf8')
    res.json({ content, filePath })
    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/status', (req, res) => {
  res.json({ 
    status: 'Claude Helper actif',
    timestamp: new Date().toISOString(),
    project: path.basename(process.cwd())
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log('Claude Helper démarré sur le port', PORT)
  console.log('Projet :', path.basename(process.cwd()))
  console.log('Claude peut maintenant modifier vos fichiers !')
})
