import { connectToDB } from "@lib/mongoDB";
import User from "@models/User";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { email: string } }) => {
  try {
    await connectToDB()

    const { email} = params

    const user = await User.findOne({ email: email })

    if (!user) {
      throw new Error('User not found')
    }

    return new Response(JSON.stringify(user), { status: 200 })
  } catch (err: any) {
    console.log(err)
    throw new Error(`Failed to get user: ${err.message}`)
  }
}

export const POST = async (req: NextRequest, { params }: { params: { email: string } }) => {
  try {
    await connectToDB()

    const { email} = params

    const user = await User.findOne({ email: email })

    if (!user) {
      throw new Error('User not found')
    }

    const { movieId } = await req.json()

    const isFavorite = user.favorites.includes(movieId)

    if (isFavorite) {
      user.favorites = user.favorites.filter((id: number) => id !== movieId)
    } else {
      user.favorites.push(movieId)
    }

    await user.save()

    return new Response(JSON.stringify(user), { status: 200 })
  } catch (err: any) {
    console.log(err)
    throw new Error(`Failed to get user: ${err.message}`)
  }
}