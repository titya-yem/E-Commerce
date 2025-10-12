import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import app from "../../src/index";
import User from "../../src/models/user.model";

describe ("Auth API", () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        const user = await User.create({
            userName: "Titya Yem",
            email: "titya@gmail.com",
            password: await bcrypt.hash("Lamdouy", 10),
        })

        userId = (user!._id as unknown as string).toString();
        token = jwt.sign({ id: userId, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7h" })
    });

    it('should login sucessfully', async () => {
        const res = await request(app)
        .post("/api/auth/signin")
        .send({ email: "titya@gmail.com", password: "Lamdouy" })

        expect(res.status).toBe(200)
        expect(res.body.message).toBe( "Login successful" )
        expect(res.body.user.email).toBe("titya@gmail.com")
        expect(res.headers["set-cookie"]).toBeDefined()
    });

    it('should fial login with wrong password', async () => {
        const res = await request(app)
        .post("/api/auth/signin")
        .send({ email: "titya@gmail.com", password: "wrongPassword" })

        expect(res.status).toBe(401)
        expect(res.body.message).toBe( "Invalid email or password" )
    });

    it('should fail login with non-exsiting email', async () => {
        const res = await request(app)
        .post("/api/auth/signin")
        .send({ email: "notfound@example.com", password: "Lamdouy" });

        expect(res.status).toBe(404)
        expect(res.body.message).toBe( "User not found" )
    });

    it('should logout sucessfully', async () => {
        const res = await request(app)
        .post("/api/auth/signout")
        .set("Cookie", [`token=${token}`])

        expect(res.status).toBe(200)
        expect(res.body.message).toBe( "Logout successful" )
    });

    it('should get current user when authenticated', async () => {
        const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", [`token=${token}`])

        expect(res.status).toBe(200)
        expect(res.body.isAuthenticated).toBe(true)
        expect(res.body.user.email).toBe("titya@gmail.com")
    });

    it('should update profile', async () => {
        const res = await request(app)
        .put("/api/auth/me")
        .set("Cookie", [`token=${token}`])
        .send({ userName: "Updated User", password: "newpassword123" })
        
        expect(res.status).toBe(200)
        expect(res.body.user.userName).toBe("Updated User")

        const updated = await User.findById(userId)
        expect(await bcrypt.compare("newpassword123", updated!.password)).toBe(true)
    });
})