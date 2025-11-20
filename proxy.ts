import NextAuth from "next-auth";
import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    // Add simple logic if needed, or just let it pass through for now
    // and handle protection in components/pages or a more complex middleware
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
