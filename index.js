const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { getPool } = require("./dbConfig");  
const userRouter = require("./user");
const addJobRouter = require("./addJob");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());  
app.use(cors());         


app.get("/", (req, res) => {
    return res.status(200).send({ message: "This is job portal backend" });
});

app.use("/user",userRouter);

app.use("/addJob",addJobRouter);

async function testDatabaseConnection() {
    const pool = getPool();
    try {
        const connection = await pool.getConnection();
        console.log("DB connected successfully");
        connection.release(); 
    } catch (error) {
        console.error("DB connection failed:", error);
        throw error;  
    }
}


app.listen(PORT, async () => {
    try {
        await testDatabaseConnection();  
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error("Failed to start the server due to database connection issues");
        process.exit(1);  
    }
});
