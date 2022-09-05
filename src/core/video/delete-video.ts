import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

export default async function deleteVideo(videoId: string): Promise<void> {
  await prismaClient.videos.delete({
    where: {
      id: videoId,
    },
  })
}
