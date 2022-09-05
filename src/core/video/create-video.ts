import { PrismaClient, Prisma, videos } from '@prisma/client'

const prismaClient = new PrismaClient()

export default async function createVideo(
  video: Prisma.videosCreateInput
): Promise<videos> {
  return await prismaClient.videos.create({
    data: video,
  })
}
