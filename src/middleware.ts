import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { navigationConfig } from "@/lib/nav-config";
import { Role, User } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Récupérer la session
    const session = getSessionCookie(request);
    console.log("--------------session--------------", session); // Debugging line
    if (session) {
        const response = await fetch(`${request.nextUrl.origin}/api/session?token=${session.split(".")[0]}`);
        if (response.ok) {
            const existingSession = await response.json();
            const user = existingSession.session?.user as User;

            // Vérifier si l'utilisateur a complété son profil
            if (user && !user.profileCompleted) {
                if (pathname !== '/onboarding') {
                    return NextResponse.redirect(new URL('/onboarding', request.url));
                }
            }

            // Vérifier les permissions basées sur le rôle
            if (user && user.role) {
                const navItems = navigationConfig();
                const pathSegments = pathname.split('/').filter(Boolean);
                const currentPathPattern = pathSegments.map(segment => {
                    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
                        ? '[id]'
                        : segment;
                }).join('/');

                const matchingRoute = navItems.find(item => {
                    const routePath = item.href.startsWith('/') ? item.href.slice(1) : item.href;

                    if (routePath.includes('[id]')) {
                        const routePattern = routePath.split('/');
                        const currentPattern = currentPathPattern.split('/');

                        if (routePattern.length !== currentPattern.length) return false;

                        return routePattern.every((segment, index) => {
                            return segment === '[id]' || segment === currentPattern[index];
                        });
                    }

                    return routePath === currentPathPattern;
                });

                if (matchingRoute && !matchingRoute.roles.includes(user.role as Role)) {
                    return NextResponse.redirect(new URL('/not-found', request.url));
                }
            }
        }
    }

    // Définir les routes publiques
    const publicRoutes = ['/login', '/404', '/', '/reset-password', '/forgot-password'];
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    // Si l'utilisateur est sur la page de login mais est déjà connecté, rediriger vers le dashboard
    if (pathname === '/login' && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Si ce n'est pas une route publique et que l'utilisateur n'est pas connecté, rediriger vers login
    if (!isPublicRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Protection de la route onboarding
    if (pathname === '/onboarding') {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const response = await fetch(`${request.nextUrl.origin}/api/session?token=${session.split(".")[0]}`);
        if (response.ok) {
            const existingSession = await response.json();
            const user = existingSession.session?.user as User;

            if (user?.profileCompleted) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)'],
};