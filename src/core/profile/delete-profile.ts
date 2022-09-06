import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

export default async function deleteProfile(profileId: string): Promise<void> {
  const videos = await prismaClient.videos.findMany({
    where: {
      profileId,
    },
  })

  for (const video of videos) {
    await prismaClient.videos.delete({
      where: {
        id: video.id,
      },
    })
  }

  await prismaClient.profiles.delete({
    where: {
      id: profileId,
    },
  })
}
