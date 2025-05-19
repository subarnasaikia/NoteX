"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState, useState } from "react"





export default function SignUpPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [username, setUsername] = useState("")
        const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")


    
  
    const handleSubmit = async (_: any, __: FormData) : Promise<string | undefined> => {
  
  
  
      if (!email || !password || !username || !confirmPassword) {
        return "Email, password, username and confirm password are required";
      } 

      if (password !== confirmPassword) {
        return "Passwords do not match";
      }
  
    //   const response = await authService.register({
    //     email,
    //     username,
    //     password,
    //     role,
    //   })
  
    //   if (response.success) {
  
  
    //     redirect(callbackUrl)
  
    
      
     
    //   } else {
    //     return response.error || "Invalid email or password";
    //   }
    };
  
    const [errorMessage, formAction, isPending] = useActionState(
      handleSubmit,
      undefined,
    );
  
  


  return (
    <main>
    <form className={cn("flex flex-col gap-6",)} >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">        Create an Account
        </h1>
      </div>

      {errorMessage && 
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {errorMessage}
        </div>
      }
      <div className="grid gap-4">
   <div className="grid gap-3">
          <Label htmlFor="email">First Name</Label>
          <Input id="firstName"
           type="text"
           name="email"
           placeholder="John" 
             value={email}
             onChange={(e) => setFirstName(e.target.value ?? "")}
             
            required />
        </div>

           <div className="grid gap-3">
          <Label htmlFor="email">Middle Name</Label>
          <Input id="middleName"
           type="text"
           name="middleName"
           placeholder="Samuel" 
             value={email}
             onChange={(e) => setMiddleName(e.target.value ?? "")}
             
            required />
        </div>


           <div className="grid gap-3">
          <Label htmlFor="email">Last Name</Label>
          <Input id="lastName"
           type="text"
           name="lastName"
           placeholder="Doe" 
             value={email}
             onChange={(e) => setLastName(e.target.value ?? "")}
             
            required />
        </div>





        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email"
           type="email"
           name="email"
           placeholder="m@example.com" 
             value={email}
             onChange={(e) => setEmail(e.target.value ?? "")}
             
            required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input 
          id="username"
           type="text"
           value={username}
             onChange={(e) => setUsername(e.target.value ?? "")}
             name="username"
            placeholder="johndoe"
             required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" 

            value={password}
             onChange={(e) => setPassword(e.target.value ?? "")}
             name="password"
          required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Confirm Password</Label>
          <Input 
          id="confirmPassword" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value ?? "")}
          name="confirmPassword"
          required />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing Up..." : "Sign Up"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" type="button" className="w-full"  disabled={isPending}
        >
       <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="50px" height="50px">    <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"/></svg>
    
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
       Already have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Log in
        </a>
      </div>
    </form>
    </main>
  )
}
