import Link from "next/link";
import { Button } from "@/components/ui/button";

function VerifyMailsPage() {
    return (
        <div className="text-center dark:text-white">
            <h1 className="text-2xl font-semibold mb-4">Mail envoyé</h1>
            <p className="mb-8">Vérifiez votre boîte mail pour vous connecter</p>
            <Button variant="default">
                <Link href="/login">
                    Retour
                </Link>
            </Button>
        </div>
    )
}

export default VerifyMailsPage;