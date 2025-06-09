import AuthForm from '@/app/components/AuthForm'

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <AuthForm mode="register" />
    </div>
  )
}
