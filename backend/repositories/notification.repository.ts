// Repository des notifications pour FotoLouJay
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class NotificationRepository {
  static async findByUserId(utilisateurId: number) {
    return prisma.notification.findMany({
      where: { utilisateurId },
      orderBy: { dateCreation: 'desc' }
    });
  }

  static async create(data: any) {
    return prisma.notification.create({ data });
  }
}
