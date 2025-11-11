import { Resend } from "resend"

// Zainicjuj ponowne wysyłanie kluczem API ze zmiennych środowiskowych
export const resend = new Resend(process.env.RESEND_API_KEY)

//Domyślny adres e-mail nadawcy — użyj zweryfikowanej domeny w środowisku produkcyjnym
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
