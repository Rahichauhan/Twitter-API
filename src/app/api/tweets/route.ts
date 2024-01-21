import { ConnectToDb } from "../../../../utils"
import prisma from "../../../../prisma";
import { NextResponse } from "next/server";

export const GET=async(req:Request)=>{
try {
    await ConnectToDb();
    const tweets=await prisma.tweets.findMany();
    return NextResponse.json({tweets},{status:200})
} catch (error:any) {
    console.log(error);
    return NextResponse.json({error:error.message},{status:500})
}finally
{
await prisma.$disconnect();
}
}

export const POST=async(req:Request)=>{
try {
    const {tweet,userId}=await req.json()
    if(!tweet&&!userId)
    {
     return NextResponse.json({error:"Invalid Data"},{status:422})
    }
    await ConnectToDb();
    const exist=await prisma.user.findFirst({where:{id:userId}})
    if(!exist)
    {
        return NextResponse.json({message:"user not exist"},{status:401})
    }
    const newtweet=await prisma.tweets.create({data:{tweet,userId}})
    return NextResponse.json({tweet:newtweet},{status:201})
} catch (error:any) {
   
    return NextResponse.json({error:error.message},{status:500})
}finally
{
await prisma.$disconnect();
}
}