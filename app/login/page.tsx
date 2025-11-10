"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Home } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.email("Must be a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
 
})

const LoginPage= ()=> {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await signIn.email({
        email: data.email,
        password: data.password,
      })
      if (response) {
        toast("You are logged in:", {
      description: (
        <pre className="text-primary mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
       form.reset()
       router.push('/dashboard')
      }
    } catch (error) {
      toast.error("Failed to log in" + error)
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
    <Card className="relative w-full sm:max-w-md shadow-xl border-4 border-primary/20">
       <Link className='absolute top-4 right-4 text-blue-700 ' href="/"><Home/></Link>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="your-email@example.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                   Password 
                  </FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">  
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()} className="cursor-pointer">
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo" className="cursor-pointer">
            Submit
          </Button>
        </Field>
        <p> <Link className='text-blue-700 hover:underline' href="/forgot-password">Forgot your password?</Link></p>
        <p>Don&apos;t have an account? <Link className='text-blue-700 hover:underline' href="/signup">Sign up</Link></p>
      </CardFooter>
    </Card>
    </div>
  )
}
export default LoginPage