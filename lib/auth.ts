import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'HOMEOWNER' | 'CONTRACTOR',
  phone?: string
) {
  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      phone,
      subscription: {
        create: {
          status: 'FREE',
        },
      },
    },
  })

  // Create contractor profile if contractor
  if (role === 'CONTRACTOR') {
    await prisma.contractorProfile.create({
      data: {
        userId: user.id,
      },
    })
  }

  return user
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      subscription: true,
      contractorProfile: true,
    },
  })
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null

  // Don't return password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
