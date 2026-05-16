import { Pool } from "pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const r = await pool.query(`SELECT email, password, role FROM "User" WHERE email = $1`, ["rhanielmag.xavier@gmail.com"])
console.log("found:", r.rows.length)
if (r.rows[0]) {
  console.log("email:", r.rows[0].email)
  console.log("role:", r.rows[0].role)
  console.log("pass match 123456:", bcrypt.compareSync("123456", r.rows[0].password))
} else {
  console.log("USER NOT FOUND")
}
await pool.end()
