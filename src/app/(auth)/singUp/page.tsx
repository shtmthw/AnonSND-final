"use client";
import { useState } from "react";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/singUp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        console.log(data); // Handle success or error messages
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="submit">Sign Up</button>
        </form>
    );
}
