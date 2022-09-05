import { PrismaClient, Prisma, profiles } from '@prisma/client'

const prismaClient = new PrismaClient()

export default async function createProfile(
  profile: Prisma.profilesCreateInput
): Promise<profiles> {
  return await prismaClient.profiles.create({
    data: profile,
  })
}
