import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    if ("message" in searchParams) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={searchParams} />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-5 flex justify-center items-center">
            <form className="flex-1 flex flex-col min-w-64 rounded-2xl py-8 px-5 bg-neutral-700">
            <h1 className="text-2xl font-bold">Cadastre-se</h1>
                <p className="text-sm text text-neutral-300">
                    Já tem uma conta?{" "}
                    <Link
                        className="text-neutral-300 font-medium underline"
                        href="/sign-in"
                    >
                        Entre por aqui
                    </Link>
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        placeholder="fimaocapitalismo@exemplo.com"
                        required
                    />
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Sua senha"
                        minLength={6}
                        required
                    />
                    <SubmitButton
                        formAction={signUpAction}
                        pendingText="Cadastrando..."
                    >
                        Cadastrar
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </div>
            </form>
        </div>
    );
}
