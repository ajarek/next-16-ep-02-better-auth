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
import { resetPassword } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // wskaż, które pole ma wyświetlić błąd
    message: "Passwords must be the same",
  })

const ResetPassword = ({ searchParams }: { searchParams: Promise<{token: string}> }) => {

  const { token } = React.use(searchParams)

  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await resetPassword({
        newPassword: data.password,
        token: token ?? undefined,
      })
      if (response) {
        toast("You are logged in:", {
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
         setTimeout(() => {
          router.push("/login");
        }, 2000);
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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id='form-rhf-demo' onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='password'>New Password</FieldLabel>
                    <Input
                      {...field}
                      id='password'
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder='******'
                      autoComplete='off'
                      disabled={!token}
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
                    <FieldLabel htmlFor='password'>Confirm New Password</FieldLabel>
                    <Input
                      {...field}
                      id='confirmPassword'
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder='******'
                      autoComplete='off'
                      disabled={!token}
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
              className='cursor-pointer'
              disabled={!token}
            >
             Reset
            </Button>
            <Button
              type='submit'
              form='form-rhf-demo'
              className='cursor-pointer'
            >
              Reset Password
            </Button>
          </Field>
          <p>
            {" "}
            <Link
              className='text-blue-700 hover:underline'
              href='/login'
            >
              Back to Login
            </Link>
          </p>
          
        </CardFooter>
      </Card>
    </div>
  )
}
export default ResetPassword
