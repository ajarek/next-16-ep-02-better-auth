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
import { forgetPassword } from "@/lib/auth-client"


const formSchema = z.object({
  email: z.email("Must be a valid email address"),
})

const ForgotPasswordPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await forgetPassword({
        email: data.email,
        redirectTo: "/reset-password",
      })
      
      if (response.error ) {
        toast.error("Failed to send reset email" + response.error.message)
      } else {
        toast("You have requested a password reset:", {
          description: (
            <pre className='text-primary mt-2 w-[320px] overflow-x-auto rounded-md p-4'>
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
      }
    } catch (error) {
      toast.error("Failed to log in" + error)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='relative w-full sm:max-w-md shadow-xl border-4 border-primary/20'>
        <Link className='absolute top-4 right-4 text-blue-700 ' href='/'>
          <Home />
        </Link>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
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
            <Link className='text-blue-700 hover:underline' href='/login'>
              Back to Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
export default ForgotPasswordPage
