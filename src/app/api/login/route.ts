import { ConnectToDb } from "../../../../utils"
import prisma from "../../../../prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export const POST=async(req:Request)=>{
try {
    const {email,password}=await req.json()
    if(!email&&!password)
    {
     return NextResponse.json({error:"Invalid Data"},{status:422})
    }
    await ConnectToDb();
    const existinguser=await prisma.user.findFirst({where:{email}})
    if(!existinguser)
    {
        return NextResponse.json({message:"user not exist"},{status:401})
    }
    const iscorrectpassword=await bcrypt.compare(password,existinguser.password)
    if(!iscorrectpassword)
    {
        return NextResponse.json({message:"Invalid password"},{status:403})
    }
    return NextResponse.json({message:"Logged in"},{status:200})
} catch (error:any) {
    console.log(error);
    return NextResponse.json({error:error.message},{status:500})
}finally
{
await prisma.$disconnect();
}
}