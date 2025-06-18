import { PrismaClient, User } from '@prisma/client'; // 👈 importe le type User
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Nettoyer les anciennes données
    await prisma.message.deleteMany();
    await prisma.conversationUser.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();

    // Créer des utilisateurs
    const usernames = ['alice', 'bob', 'carol', 'dave', 'eve'];
    const users: User[] = []; // 👈 typage correct ici

    for (let i = 0; i < usernames.length; i++) {
        const username = usernames[i];
        const hashedPassword = await bcrypt.hash('yoyo', 10);
        const user = await prisma.user.create({
            data: {
                email: `${username}@example.com`,
                username,
                firstName: username.charAt(0).toUpperCase() + username.slice(1),
                lastName: 'Test',
                avatar: `https://i.pravatar.cc/150?u=${username}`,
                isOnline: i % 2 === 0,
                lastSeen: new Date(),
                password: hashedPassword,
            },
        });
        users.push(user);
    }

    // Conversation privée : Alice & Bob
    const conversation1 = await prisma.conversation.create({
        data: {
            isGroup: false,
            participants: {
                create: [
                    { userId: users[0].id }, // Alice
                    { userId: users[1].id }, // Bob
                ],
            },
        },
    });

    // Conversation de groupe : Alice, Bob, Carol
    const conversation2 = await prisma.conversation.create({
        data: {
            name: "Group Chat",
            isGroup: true,
            participants: {
                create: users.slice(0, 3).map((u) => ({ userId: u.id })),
            },
        },
    });

    // Messages dans la conversation privée
    await prisma.message.createMany({
        data: [
            {
                content: "Salut Bob, comment ça va ?",
                senderId: users[0].id, // Alice
                conversationId: conversation1.id,
                type: 'TEXT',
            },
            {
                content: "Ça va bien Alice, merci ! Et toi ?",
                senderId: users[1].id, // Bob
                conversationId: conversation1.id,
                type: 'TEXT',
            },
        ],
    });

    // Messages dans la conversation de groupe
    await prisma.message.createMany({
        data: [
            {
                content: "Bienvenue dans le groupe !",
                senderId: users[0].id,
                conversationId: conversation2.id,
                type: 'SYSTEM',
            },
            {
                content: "Hello tout le monde !",
                senderId: users[2].id,
                conversationId: conversation2.id,
                type: 'TEXT',
            },
        ],
    });

    console.log('✅ Base de données remplie avec succès.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
