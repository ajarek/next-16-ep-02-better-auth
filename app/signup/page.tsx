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
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-client"

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.email("Must be a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // wskaż, które pole ma wyświetlić błąd
    message: "Passwords must be the same",
  })

const SignupPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  })

  const router = useRouter()

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      // check for an error shape from the auth client
      const maybeError = (response as unknown as { error?: { message?: string } }).error
      if (maybeError) {
        toast.error(maybeError.message || "Sign up failed")
        return
      }

      // success — notify and redirect to dashboard
      toast.success("Account created — redirecting to your dashboard...")
      form.reset()
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      toast.error("Unexpected error. See console.")
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='relative w-full sm:max-w-md shadow-xl border-4 border-primary/20'>
        <Link className='absolute top-4 right-4 text-blue-700 ' href='/'>
          <Home />
        </Link>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create a new account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='name'>Name</FieldLabel>
                    <Input
                      {...field}
                      id='name'
                      type='text'
                      aria-invalid={fieldState.invalid}
                      placeholder='Your Name'
                      autoComplete='off'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='email'>Email Address</FieldLabel>
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      aria-invalid={fieldState.invalid}
                      placeholder='your-email@example.com'
                      autoComplete='off'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='password'>Password</FieldLabel>
                    <Input
                      {...field}
                      id='password'
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder='******'
                      autoComplete='off'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='confirmPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='password'>Password</FieldLabel>
                    <Input
                      {...field}
                      id='confirmPassword'
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder='******'
                      autoComplete='off'
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
        <CardFooter className='flex flex-col gap-4'>
          <Field orientation='horizontal'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type='submit' form='form-rhf-demo'>
              Submit
            </Button>
          </Field>
          <p>
            Already have an account?{" "}
            <Link className='text-blue-700 hover:underline' href='/login'>
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
export default SignupPage
