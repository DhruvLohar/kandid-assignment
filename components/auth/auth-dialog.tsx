"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, ArrowLeft, Mail, Loader2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

// Form schemas
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

interface AuthDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAuthSuccess?: (session: any) => void
}

export function AuthDialog({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) {
    const [currentView, setCurrentView] = useState<"main" | "login" | "register">("main")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    })

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            // TODO: Implement Google sign-in
            console.log("Google sign-in clicked")
            await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmailLogin = async (form: LoginFormData) => {
        setIsLoading(true)
        try {
            const { data, error } = await authClient.signIn.email({
                email: form.email,
                password: form.password,
            });

            if (data) {
                onAuthSuccess?.(data)
            }
            if (error) {
                console.error("Login error:", error)
                // TODO: Show error message to user
            }
        } catch (error) {
            console.error("Login failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmailRegister = async (form: RegisterFormData) => {
        setIsLoading(true)
        try {
            const { data, error } = await authClient.signUp.email({
                name: `${form.firstName} ${form.lastName}`,
                email: form.email,
                password: form.password,
            });

            if (data) {
                onAuthSuccess?.(data)
            }
            if (error) {
                console.error("Registration error:", error)
                // TODO: Show error message to user
            }
        } catch (error) {
            console.error("Registration failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetToMain = () => {
        setCurrentView("main")
        loginForm.reset()
        registerForm.reset()
        setShowPassword(false)
        setIsLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                {currentView === "main" && (
                    <>
                        <DialogHeader className="text-center space-y-2">
                            <DialogTitle className="text-2xl font-semibold text-center text-foreground">
                                Continue with an account
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground text-center">
                                You must log in or register to continue.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 pt-4">
                            <Button
                                variant="outline"
                                className="w-full h-12 text-base"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                Continue with Google
                            </Button>

                            <Button
                                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                                onClick={() => setCurrentView("login")}
                                disabled={isLoading}
                            >
                                <Mail className="w-5 h-5 mr-3" />
                                Login with Email
                            </Button>

                            <div className="text-center pt-4">
                                <button
                                    className="text-sm text-muted-foreground hover:text-foreground underline"
                                    onClick={() => setCurrentView("register")}
                                >
                                    New User? Create New Account
                                </button>
                            </div>
                        </div>

                        <div className="text-xs text-center text-muted-foreground pt-4">
                            By continuing, you agree to our{" "}
                            <a href="#" className="underline hover:text-foreground">Privacy Policy</a> and{" "}
                            <a href="#" className="underline hover:text-foreground">T&Cs</a>
                        </div>
                    </>
                )}

                {currentView === "login" && (
                    <>
                        <DialogHeader className="space-y-2">
                            <div className="flex items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                                    onClick={resetToMain}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back
                                </Button>
                            </div>
                            <DialogTitle className="text-2xl font-semibold text-foreground">
                                Login with Email
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Enter your email and password to continue.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(handleEmailLogin)} className="space-y-4 pt-4">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Enter your password"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        className="text-sm text-muted-foreground hover:text-foreground underline"
                                        onClick={() => setCurrentView("register")}
                                    >
                                        Don't have an account? Register
                                    </button>
                                </div>
                            </form>
                        </Form>
                    </>
                )}

                {currentView === "register" && (
                    <>
                        <DialogHeader className="space-y-2">
                            <div className="flex items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto text-muted-foreground hover:text-foreground"
                                    onClick={resetToMain}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back
                                </Button>
                            </div>
                            <DialogTitle className="text-2xl font-semibold text-foreground">
                                Register with email
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Register using your email address.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(handleEmailRegister)} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={registerForm.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="First Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={registerForm.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Last Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="bhavya@kandid.ai"
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="••••••••••"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create my account"
                                    )}
                                </Button>

                                <div className="text-center pt-2">
                                    <span className="text-sm text-muted-foreground">
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            className="text-blue-600 hover:text-blue-700 underline"
                                            onClick={() => setCurrentView("login")}
                                        >
                                            Login
                                        </button>
                                    </span>
                                </div>
                            </form>
                        </Form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
