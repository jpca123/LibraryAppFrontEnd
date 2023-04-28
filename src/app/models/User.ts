import UserLogin from "./Userlogin";

export default class User implements UserLogin{
    _id?: string;
    name?: string;
    lastName?: string;
    userName?: string;
    gender?: "Masculine" | "Femenine" | "Prefer not say";
    email?: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}