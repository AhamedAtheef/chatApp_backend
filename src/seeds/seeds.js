import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import USER from "../models/usermodels.js";

dotenv.config();

const users = [
    {
        fullname: "Emma Thompson",
        email: "emma.thompson@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
        fullname: "Olivia Miller",
        email: "olivia.miller@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
        fullname: "Sophia Davis",
        email: "sophia.davis@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
        fullname: "Liam Johnson",
        email: "liam.johnson@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
        fullname: "Isabella Moore",
        email: "isabella.moore@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
        fullname: "Ethan Taylor",
        email: "ethan.taylor@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/men/8.jpg",
    },
    {
        fullname: "Oliver Anderson",
        email: "oliver.anderson@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/men/9.jpg",
    },
    {
        fullname: "Amelia Thomas",
        email: "amelia.thomas@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/10.jpg",
    },
    {
        fullname: "Lucas Jackson",
        email: "lucas.jackson@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
        fullname: "Charlotte White",
        email: "charlotte.white@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
        fullname: "Harper Harris",
        email: "harper.harris@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/13.jpg",
    },
    {
        fullname: "Mason Martin",
        email: "mason.martin@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/men/14.jpg",
    },
    {
        fullname: "Evelyn Thompson",
        email: "evelyn.thompson@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    {
        fullname: "Logan Garcia",
        email: "logan.garcia@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/men/16.jpg",
    },
    {
        fullname: "Abigail Martinez",
        email: "abigail.martinez@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/17.jpg",
    },
    {
        fullname: "Jackson Robinson",
        email: "jackson.robinson@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/men/18.jpg",
    },
    {
        fullname: "Sofia Clark",
        email: "sofia.clark@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/women/19.jpg",
    },
    {
        fullname: "Aiden Lewis",
        email: "aiden.lewis@example.com",
        password: "123456",
        pic: "https://randomuser.me/api/portraits/men/20.jpg",
    },
    // ... (rest of your users)
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await USER.deleteMany();

        // Hash all passwords before inserting
        const hashedUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword };
            })
        );

        await USER.insertMany(hashedUsers);
        console.log("✅ Users seeded successfully with hashed passwords!");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();

