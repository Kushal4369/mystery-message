import {z} from 'zod'

export const usernameValidation = z
.string()
.min(3, "Username must be atleast 3 characters")
.max(20,"Username must not be more than 20 characters" )
.regex(/^[a-zA-Z0-9]+$/,"Username must not contain special characters")


export const signUpSchema = z.object({
    user: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least 6 characters"})
})