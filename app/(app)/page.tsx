import Link from 'next/link';
import { Cross } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cross className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-serif font-bold text-primary">
                Carnet de grâces & de missions
              </h1>
            </div>
            <nav className="space-x-4">
              <Link href="/login" className="btn-secondary">
                Se connecter
              </Link>
              <Link href="/register" className="btn-primary">
                S'inscrire
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-serif font-bold mb-6 text-primary">
            Gardez mémoire des merveilles de Dieu
          </h2>
          <p className="text-xl text-text-light mb-8 leading-relaxed">
            Un carnet spirituel pour noter vos grâces, prières, rencontres et paroles reçues.
            Relisez votre chemin et découvrez le fil rouge de l'action de Dieu dans votre vie.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Commencer gratuitement
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-3">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-background-cream">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-serif font-bold text-center mb-12 text-primary">
            Un carnet pour accompagner votre vie spirituelle
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Grâces */}
            <div className="card fade-in">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-xl font-serif font-bold mb-2">Grâces reçues</h4>
              <p className="text-text-light">
                Notez les merveilles que Dieu fait dans votre vie, 
                les moments de joie et de consolation.
              </p>
            </div>

            {/* Prières */}
            <div className="card fade-in">
              <div className="text-4xl mb-4">🙏</div>
              <h4 className="text-xl font-serif font-bold mb-2">Prières et intentions</h4>
              <p className="text-text-light">
                Gardez trace des personnes pour qui vous priez 
                et suivez l'évolution de vos intentions.
              </p>
            </div>

            {/* Écritures */}
            <div className="card fade-in">
              <div className="text-4xl mb-4">📖</div>
              <h4 className="text-xl font-serif font-bold mb-2">Paroles de l'Écriture</h4>
              <p className="text-text-light">
                Mémorisez les passages bibliques qui vous touchent,
                avec la traduction liturgique catholique.
              </p>
            </div>

            {/* Paroles */}
            <div className="card fade-in">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-xl font-serif font-bold mb-2">Paroles de connaissance</h4>
              <p className="text-text-light">
                Conservez les paroles reçues en prière 
                et voyez comment elles s'accomplissent.
              </p>
            </div>

            {/* Rencontres */}
            <div className="card fade-in">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-xl font-serif font-bold mb-2">Rencontres missionnaires</h4>
              <p className="text-text-light">
                Notez vos rencontres d'évangélisation 
                et les fruits de vos missions.
              </p>
            </div>

            {/* Relecture */}
            <div className="card fade-in">
              <div className="text-4xl mb-4">🌟</div>
              <h4 className="text-xl font-serif font-bold mb-2">Relecture spirituelle</h4>
              <p className="text-text-light">
                Contemplez le chemin parcouru et découvrez 
                comment Dieu tisse votre histoire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-serif font-bold mb-6 text-primary">
            Commencez votre carnet spirituel aujourd'hui
          </h3>
          <p className="text-xl text-text-light mb-8">
            Gratuit, privé et sécurisé. Vos données vous appartiennent.
          </p>
          <Link href="/register" className="btn-primary text-lg px-8 py-3">
            Créer mon carnet
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-text-muted">
          <p>&copy; 2024 Carnet de grâces & de missions - Fait avec ❤️ et 🙏</p>
        </div>
      </footer>
    </div>
  );
}