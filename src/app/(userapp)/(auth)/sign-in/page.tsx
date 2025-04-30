'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/features/auth/use-auth"
import { useEffect } from "react"
import { redirect } from "next/navigation"
import Loading from "@/components/loading"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

function SignInPage() {
  const { user, signIn, isLoading, error } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    if (!isLoading && user) redirect("/")
  }, [user, isLoading])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signIn(values)
  }

  if (isLoading) {
    return <Loading />;
  }


  return (
    <div className="container flex items-center justify-center min-h-screen py-8 mx-auto">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
          {error && (
            <div className="p-2 mt-4 rounded-2xl bg-red-700 text-white text-sm text-center">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <Link href="/sign-up">
            <Button variant="outline" className="w-full mt-7" disabled={isLoading}>
              Sign Up
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage
