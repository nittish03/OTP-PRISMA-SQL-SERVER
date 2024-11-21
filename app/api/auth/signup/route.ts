import connectDb from "@/mongoDb/connectDb";
import * as dotenv from 'dotenv';
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from '../../../../models/userModel'
import { prismaDB } from "@/lib/prismaDB";
dotenv.config();    
connectDb();
export async function POST(request:NextRequest){
try {
    const reqBody = await request.json();
    const {username, email, password} = reqBody;
    console.log(reqBody);

    if (!username || !email || !password) {
        return NextResponse.json("Missing value name, email or password", {
            status: 422
        })
    }


    const userExist = await prismaDB.user.findUnique({
        where: {
            email
        }
    })
    if (userExist) {
        return new NextResponse("User already exists", {
            status: 400
        })
    }
    
    //hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password,salt)
    //save user in database

    await prismaDB.user.create({
        data: {
          name: username,
          email: email,
          hashedPassword: hashedPassword,
        },
      });
      

return NextResponse.json({message:"User created successfully",
    success:true,
});
} catch (error:any) {
   return NextResponse.json({error:error.message},{status:500})
}
}