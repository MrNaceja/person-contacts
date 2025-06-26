import { users } from '@db/schema/user';
import { BaseDAL } from '@dal/index';
import { eq } from 'drizzle-orm';

export type User = typeof users.$inferSelect

class UsersDAL extends BaseDAL {

    async findByEmail(email: User['email']) {
        return await this.db.query.users.findFirst({
            where: eq(users.email, email)
        })
    }

    async create({ email, password }: Omit<User, 'id'>) {
        return await this.db.insert(users).values({
            email, 
            password
        }).returning().then(affected => affected.at(0)) as User
    }
}

export const usersDAL = new UsersDAL();