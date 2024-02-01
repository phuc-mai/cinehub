import { options } from "@app/api/auth/[...nextauth]/option"
import { connectToDB } from "@lib/mongoDB"
import User from "@models/User"
import { getServerSession } from "next-auth"

export const fetchMyList = async () => {
  const session = await getServerSession(options)

  if (!session?.user?.email) {
    throw new Error("No user log in")
  }

  await connectToDB()

  const user = await User.findOne({ email: session?.user?.email })

  if (!user) {
    throw new Error("No user found")
  }

  return user.favorites
}