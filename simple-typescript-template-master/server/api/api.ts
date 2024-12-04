import { Request, Response, Express } from 'express'
import * as bcrypt from 'bcrypt';
import {User} from "../models/user";
import { Database } from '../database';
import {query, body, matchedData, validationResult} from "express-validator"
import jwt from "jsonwebtoken"

export class API {
  // Properties
  app: Express
  db: Database
  jwtSecretKey:string = "SehrGeheimerSchlüssel"
  loggedInUsers: User[] = []

  constructor(app: Express, db:Database) {
    this.app = app
    this.db = db
    this.app.post ('/api/register', body("username").notEmpty().withMessage("Username is empty").custom(async (username) => {if(!await this.usernameExists(username)) throw new Error("Username already exist")}).escape(), body("password").isLength({min: 8}).withMessage("Password must be least 8 characters"), this.register) 
    this.app.post('/api/login', body("username").isString().withMessage("Username must be a string").escape(), body("password").isString().withMessage("Password must be a string"), this.login)
    this.app.post('/api/posts', this.verifyToken, body("content").isString().withMessage("Username must be a string").escape(), this.createPost)
  }

  private register = async(req: Request, res: Response): Promise<any> => {
    const validationRes  = validationResult(req);
    if(!validationRes.isEmpty()) {
      return res.status(400).send(validationRes.array()[0].msg)
    }

      const { username, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const query = `INSERT INTO users (username, password_hash, role) VALUES ("${username}", "${hashedPassword}", "user");`
      await this.db.executeSQL(query)
      return res.sendStatus(200)
  }

  private login = async(req: Request, res: Response): Promise<any> => {
    const validationRes  = validationResult(req);
    if(!validationRes.isEmpty()) {
      return res.status(400).send(validationRes.array()[0].msg)
    }

    const {username, password} = matchedData(req)
    const query = `SELECT id, password_hash, role FROM users WHERE username = "${username}";`
    const result = await this.db.executeSQL(query)
    if(!result[0]) {
      return res.status(401).send("Username or password wrong")
    }
    const userPassword = await result[0].password_hash
    const match = await bcrypt.compare(password, userPassword)
    if(match) {
      const id = result[0].id
      const token = jwt.sign(
        {
          expiresIn: "10d",
          data: {id, username},
        },
        this.jwtSecretKey
      )
      const role = await result[0].role
      const user = new User(id, username, userPassword, role)
      this.loggedInUsers.push(user)

      return res.status(200).send(token)
    }
    return res.status(401).send("Username or password wrong")
  }

  private createPost = async(req: Request, res: Response): Promise<any> => {
    const validationRes  = validationResult(req);
    if(!validationRes.isEmpty()) {
      return res.status(400).send(validationRes.array()[0].msg)
    }

    const {content} = matchedData(req)
    const {userId} = req.body
    const query = `INSERT INTO posts (content, user_id) VALUES ("${content}", ${userId});`
    await this.db.executeSQL(query)


      return res.sendStatus(200)
  }

  private verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.status(403).send("Failed to authenticate token");
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, this.jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send("Failed to authenticate token");
        }
        const { id, username } = decoded.data;
        req.body = { ...req.body, userId: id, username: username };
        next();
    });
};

  private usernameExists = async(username:string): Promise<boolean> => {
    const query  = `SELECT username FROM users WHERE username = "${username}";`
    const response = await this.db.executeSQL(query)
    if(response.length === 0) return true
    return false
  }

  
  
}
