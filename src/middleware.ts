import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { navigationConfig } from "@/lib/nav-config";
import { Role, User } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const session = getSessionCookie(request);

    // Routes d'authentification
    const authPages = [
        '/login',
        '/register',
        '/forgot-password',
        '/verify-email',
        '/reset-password'
    ];

    // Routes publiques (accessibles sans session)
    const publicRoutes = [...authPages, '/', '/404'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // 1. Redirection si déjà connecté et essaye d'accéder à une page d'authentification
    if (authPages.includes(pathname)) {
        if (session) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Permettre l'accès aux pages d'authentification si pas de session
        return NextResponse.next();
    }

    // 2. Vérification de session pour les utilisateurs inscrits (register)
    if (pathname === '/register') {
        // Bloquer l'accès au dashboard directement après inscription
        if (session) {
            const response = await fetch(`${request.nextUrl.origin}/api/session?token=${session.split(".")[0]}`);
            if (response.ok) {
                const existingSession = await response.json();
                const user = existingSession.session?.user as User;

                // Rediriger vers onboarding si email vérifié mais profil incomplet
                if (user?.emailVerified && !user.profileCompleted) {
                    return NextResponse.redirect(new URL('/onboarding', request.url));
                }
                // Rediriger vers dashboard si profil complet
                if (user?.profileCompleted) {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            }
        }
        // Permettre l'accès à la page register si pas de session
        return NextResponse.next();
    }

    // 3. Gestion de la session existante
    if (session) {
        const response = await fetch(`${request.nextUrl.origin}/api/session?token=${session.split(".")[0]}`);
        if (response.ok) {
            const existingSession = await response.json();
            const user = existingSession.session?.user as User;

            // Vérification onboarding
            if (!user.profileCompleted && pathname !== '/onboarding') {
                return NextResponse.redirect(new URL('/onboarding', request.url));
            }

            // Vérification des permissions
            if (user?.role) {
                const navItems = navigationConfig;
                const pathSegments = pathname.split('/').filter(Boolean);
                const currentPathPattern = pathSegments.map(segment => {
                    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
                        ? '[id]'
                        : segment;
                }).join('/');

                const matchingRoute = navItems.find(item => {
                    const routePath = item.href.startsWith('/') ? item.href.slice(1) : item.href;
                    return currentPathPattern.startsWith(routePath);
                });

                if (matchingRoute) {
                    // Check if the route is admin-only
                  

                    // Check if user's role is allowed for this route
                    if (!matchingRoute.roles.includes(user.role.toString() as Role)) {
                        return NextResponse.redirect(new URL('/not-found', request.url));
                    }
                }
            }
        }
    }

    // 4. Protection des routes privées
    if (!isPublicRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 5. Gestion spécifique de la route onboarding
    if (pathname === '/onboarding') {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // ... (logique onboarding existante)
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..+$).*)'
    ],
};