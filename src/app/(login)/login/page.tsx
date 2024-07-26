import { LoginForm } from "./_components/login-form";

interface LoginPageProps {
    searchParams: {
        error?: string;
    }
}

export default function Login({ searchParams }: LoginPageProps) {
    return (
        <LoginForm error={searchParams.error} />
    )
}