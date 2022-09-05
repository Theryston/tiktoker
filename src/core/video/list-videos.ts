import { PrismaClient, Prisma, videos } from '@prisma/client'

const prismaClient = new PrismaClient()

export default async function listVideos(
  where?: Prisma.videosWhereInput
): Promise<videos[]> {
  return await prismaClient.videos.findMany({
    where,
  })
}
