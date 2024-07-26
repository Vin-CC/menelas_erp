import { LoginForm } from "../_components/login-form"

interface LoginPageProps {
    searchParams: {
        error: "CredentialsSignin"
    }
}

export default async function Login({ searchParams }: LoginPageProps) {
    return (
        <LoginForm error={searchParams.error} />
    )
}