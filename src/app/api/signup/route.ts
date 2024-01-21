import { ConnectToDb } from "../../../../utils"
import prisma from "../../../../prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export const POST=async(req:Request)=>{
try {
    const {name,email,password}=await req.json()
    if(!name&&!email&&!password)
    {
     return NextResponse.json({error:"Invalid Data"},{status:422})
    }
    await ConnectToDb();
    const existinguser=await prisma.user.findFirst({where:{email}})
    if(existinguser)
    {
        return NextResponse.json({message:"User already registered,please login"},{status:403})
    }
    const hashedpassword=await bcrypt.hash(password,10);
    const user=await prisma.user.create({data:{name,email,password:hashedpassword}});
    return NextResponse.json({user},{status:201})
} catch (error:any) {
    console.log(error);
    return NextResponse.json({error:error.message},{status:500})
}finally
{
await prisma.$disconnect();
}
}