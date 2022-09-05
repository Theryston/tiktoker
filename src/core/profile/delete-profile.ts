import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

export default async function deleteProfile(profileId: string): Promise<void> {
  await prismaClient.profiles.delete({
    where: {
      id: profileId,
    },
  })
}
