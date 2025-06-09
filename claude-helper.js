const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

// Configuration CORS plus permissive
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Max-Age', '86400')
  
  // Répondre aux requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  
  next()
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Endpoint pour écrire un fichier
app.post('/write-file', (req, res) => {
  try {
    const { filePath, content } = req.body
    
    console.log(`📝 Claude écrit : ${filePath}`)
    
    const fullPath = path.join(process.cwd(), filePath)
    const dir = path.dirname(fullPath)
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(fullPath, content, 'utf8')
    
    console.log(`✅ ${new Date().toLocaleTimeString()} - Fichier écrit avec succès`)
    res.json({ 
      success: true, 
      message: `Fichier ${filePath} écrit avec succès`,
      timestamp: new Date().toISOString(),
      path: fullPath
    })
    
  } catch (error) {
    console.error('❌ Erreur Claude Helper :', error)
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Endpoint pour lire un fichier
app.get('/read-file', (req, res) => {
  try {
    const { filePath } = req.query
    
    if (!filePath) {
      return res.status(400).json({ error: 'filePath requis' })
    }
    
    const fullPath = path.join(process.cwd(), filePath)
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' })
    }
    
    const content = fs.readFileSync(fullPath, 'utf8')
    res.json({ 
      success: true,
      content, 
      filePath,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erreur lecture :', error)
    res.status(500).json({ error: error.message })
  }
})

// Status endpoint avec plus d'infos
app.get('/status', (req, res) => {
  res.json({ 
    status: 'Claude Helper actif',
    timestamp: new Date().toISOString(),
    project: path.basename(process.cwd()),
    port: 3001,
    cors: 'enabled',
    methods: ['GET', 'POST', 'OPTIONS']
  })
})

// Page web simple pour tester
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Claude Helper</title></head>
      <body>
        <h1>🚀 Claude Helper Actif</h1>
        <p>Projet: ${path.basename(process.cwd())}</p>
        <p>Port: 3001</p>
        <p>Status: Opérationnel</p>
        <script>
          // Test CORS depuis le navigateur
          fetch('/status')
            .then(r => r.json())
            .then(data => console.log('Status:', data))
            .catch(err => console.error('Erreur:', err))
        </script>
      </body>
    </html>
  `)
})

const PORT = 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Claude Helper démarré avec CORS amélioré')
  console.log(`📡 URL: http://localhost:${PORT}`)
  console.log(`📁 Projet: ${path.basename(process.cwd())}`)
  console.log(`💻 Machine: ${require('os').hostname()}`)
  console.log('✨ CORS configuré pour Claude')
  console.log('🌐 Interface web: http://localhost:3001')
})