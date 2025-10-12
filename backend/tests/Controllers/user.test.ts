import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import app from "../../src/index";
import User from "../../src/models/user.model";

describe ("User API", () => {
    let userId: string | undefined

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should create a new user and set cookies', async () => {
        const res = await request(app)
        .post("/api/user/signup")
        .send({
            userName: "Titay Yem",
            email: "titya@gmail.com",
            password: "Lamdouy"
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty( "message", "User created and logged in successfully" )
        expect(res.body.user).toHaveProperty("email", "titya@gmail.com")
        expect(res.headers["set-cookie"]).toBeDefined();

        const user = await User.findOne({ email: "titya@gmail.com" })
        expect(user).not.toBeNull();
        expect(await bcrypt.compare("Lamdouy", user!.password)).toBe(true)

        userId = (user!._id as unknown as string).toString();
    })

    it('should get all users for admin', async () => {
        const admin = await User.create({
            userName: "Titya Yem",
            email: "titya@gmail.com",
            password: await bcrypt.hash("Lamdouy", 10),
            role: "admin"
        })

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        )

        const res = await request(app)
        .get("/api/user")
        .set("Cookie", [`token=${token}`])

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    it("should not allow duplicate email", async () => {
    // First signup
    await request(app).post("/api/user/signup").send({
      userName: "Titay Yem",
      email: "titya@gmail.com",
      password: "Lamdouy",
    });

    // Try to signup again with same email
    const res = await request(app)
      .post("/api/user/signup")
      .send({
        userName: "Yem Titay",
        email: "titya@gmail.com",
        password: "TestLamdouy",
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email already in use"); // fixed typo
  });

    it("should update user info", async () => {
    // create a user
    const user = await User.create({
      userName: "Titay Yem",
      email: "titya@gmail.com",
      password: await bcrypt.hash("Lamdouy", 10),
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .put(`/api/user/${user._id}`)
      .set("Cookie", [`token=${token}`])
      .send({ 
        userName: "Yem Titya", 
        email: "titya@gmail.com",
        password: "Lamdouy" 
       });

    expect(res.status).toBe(200);
    expect(res.body.userName).toBe("Yem Titya");
  });

  it('should delete a user', async () => {
    const user = await User.create({
        userName: "Titya Yem",
        email: "titya@gmail.com",
        password: await bcrypt.hash("Lamdouy", 10)
    })

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    )

    const res = await request(app)
    .delete(`/api/user/${user._id}`)
    .set("Cookie", [`token=${token}`])

    expect(res.status).toBe(200)
    expect(res.body.message).toBe( "User deleted successfully" )

    const deletedUser = await User.findById(user._id)
    expect(deletedUser).toBeNull()
  })
})