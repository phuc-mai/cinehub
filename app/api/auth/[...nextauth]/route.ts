import NextAuth from "next-auth"
import { options } from "./option"

const handler = NextAuth(options)

export { handler as GET, handler as POST }