import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Bem-vindo ao Projeto
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Este é um projeto React com TypeScript, Vite, Supabase e TailwindCSS
        </p>

        <div className="flex gap-4 justify-center">
          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Ir para Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Fazer Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

