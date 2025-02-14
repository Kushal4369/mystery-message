import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import brcypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {

    await dbConnect();

    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken"
            },
            {
                status: 400
            }
        )

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        if (existingUserByEmail) {
            true //
        }
        else{
            const hashedPassword = brcypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //send verification email
        const res = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
            
        }

    } catch (error) {
        console.error('Error resistering user', error)
        return Response.json(
            {
                success: false,
                message: "Error Registering User"
            },
            {
                status: 500
            }
        )
    }


}