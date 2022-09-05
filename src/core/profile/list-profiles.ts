import { PrismaClient, Prisma, profiles } from '@prisma/client'

const prismaClient = new PrismaClient()

export default async function listProfiles(
  where?: Prisma.profilesWhereInput
): Promise<profiles[]> {
  return await prismaClient.profiles.findMany({
    where,
  })
}
