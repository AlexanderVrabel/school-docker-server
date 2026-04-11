const prisma = require("../config/prisma-client");

async function createUser(email) {
    const userCount = await prisma.user.count({
        where: {
            email: email,
        },
    });
    if (userCount > 0) {
        return { message: "User already exists" };
    }
    const fullIdentifier = email.split('@')[0].replace(/\d/g, '');
    const [firstName, lastName] = fullIdentifier.split('.');

    return await prisma.user.create({
        data: {
            email: email,
            name: firstName,
            surname: lastName,
        },
    });
}
module.exports = {createUser};