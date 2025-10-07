import {User} from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const SignupUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const exsistingUser = await User.findOne({ email });
            if (exsistingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
                const newUser = new User({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                });
                await newUser.save();
                  // Create JWT token
                    const token = await jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
                    expiresIn: "1d",
                    });
                   

                    res.cookie("token", token, {
                        httpOnly: true, // not accessible via JS (more secure)
                        secure:false,
                        sameSite: "lax",
                        maxAge: 24 * 60 * 60 * 1000, // 1 day
                    })
                return  res.status(201).json({message: "User registered successfully",
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                    },
                })

    } 
    catch (err) {
        res.status(500).json({ message: "Server   error" });
    }
};

export const LoginUser = async(req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email});
    if (!user){
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const ismatch = await bcrypt.compare(password,user.password);
    if (!ismatch){
        return res.status(400).json({ message: "Invalid credentials" });
    }
   
      // Create JWT token
    const token = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    res.cookie("token", token, {
        httpOnly: true, // not accessible via JS (more secure)
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    const role = user.role
    console.log(role)
    if(role === "admin"){
        return res.json({ message: "welcome Admin", token, redirect: "/admin"});
    }else{
        return res.json({ message: "Login successful", token, redirect: "/"});
    }

    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// routes/auth.js or wherever you handle auth
export const checktoken = async (req, res) => {
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email");
    if (!user) return res.json({ loggedIn: false });

    res.json({ loggedIn: true, user });
  } catch (err) {
    res.json({ loggedIn: false });
  }
};


