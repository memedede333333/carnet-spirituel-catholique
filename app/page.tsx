import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              <span className="logo-icon">✝️</span>
              <span className="logo-text">Carnet de grâces & de missions</span>
            </Link>
            <div className="flex gap-2">
              <Link href="/login" className="btn btn-secondary">
                Se connecter
              </Link>
              <Link href="/register" className="btn btn-primary">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero container py-12">
          <h1 className="hero-title">
            Gardez mémoire des merveilles de Dieu
          </h1>
          <p className="hero-subtitle">
            Un carnet spirituel pour noter vos grâces, prières, rencontres et paroles reçues. 
            Relisez votre chemin et découvrez le fil rouge de l'action de Dieu dans votre vie.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/register" className="btn btn-primary">
              Commencer gratuitement
            </Link>
            <Link href="#features" className="btn btn-secondary">
              En savoir plus
            </Link>
          </div>
        </section>

        <section id="features" className="container pb-12">
          <h2 className="text-center text-2xl font-bold mb-8">
            Un carnet pour accompagner votre vie spirituelle
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            <div className="card">
              <div className="card-icon bg-yellow-100">
                ✨
              </div>
              <h3 className="card-title">Grâces reçues</h3>
              <p className="card-description">
                Notez les merveilles que Dieu fait dans votre vie, 
                les moments de joie et de consolation.
              </p>
            </div>

            <div className="card">
              <div className="card-icon bg-indigo-100">
                🙏
              </div>
              <h3 className="card-title">Prières d'intercession</h3>
              <p className="card-description">
                Gardez trace de vos intentions de prière et suivez 
                comment Dieu y répond dans le temps.
              </p>
            </div>

            <div className="card">
              <div className="card-icon bg-green-100">
                🤲
              </div>
              <h3 className="card-title">Prières de guérison & des frères</h3>
              <p className="card-description">
                Notez les prières de guérison et les prières des frères,
                suivez les évolutions et les fruits.
              </p>
            </div>

            <div className="card">
              <div className="card-icon bg-red-100">
                📖
              </div>
              <h3 className="card-title">Paroles de l'Écriture</h3>
              <p className="card-description">
                Mémorisez les passages bibliques qui vous touchent,
                avec la traduction liturgique catholique.
              </p>
            </div>

            <div className="card">
              <div className="card-icon bg-blue-100">
                🕊️
              </div>
              <h3 className="card-title">Paroles de connaissance</h3>
              <p className="card-description">
                Conservez les paroles reçues en prière 
                et voyez comment elles s'accomplissent.
              </p>
            </div>

            <div className="card">
              <div className="card-icon bg-purple-100">
                🤝
              </div>
              <h3 className="card-title">Rencontres missionnaires</h3>
              <p className="card-description">
                Notez vos rencontres d'évangélisation 
                et les fruits de vos missions.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface py-12">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">
              Commencez votre carnet spirituel aujourd'hui
            </h2>
            <p className="text-secondary mb-6">
              Gratuit, privé et sécurisé. Vos données vous appartiennent.
            </p>
            <Link href="/register" className="btn btn-primary">
              Créer mon carnet
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-muted">
          <p>&copy; 2024 Carnet de grâces & de missions - Fait avec ❤️ et 🙏</p>
        </div>
      </footer>
    </div>
  );
}
