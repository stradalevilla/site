import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
          >
            Sair
          </button>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span>{' '}
              <span className="text-muted-foreground">{user?.email}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">ID:</span>{' '}
              <span className="text-muted-foreground font-mono text-xs">
                {user?.id}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Próximos Passos</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Configuração do Supabase concluída</li>
            <li>✓ Autenticação implementada</li>
            <li>✓ TailwindCSS configurado</li>
            <li>✓ React Query configurado</li>
            <li>• Adicione suas tabelas no Supabase</li>
            <li>• Crie seus componentes customizados</li>
            <li>• Configure suas rotas adicionais</li>
            <li>• Faça o deploy na Vercel</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

