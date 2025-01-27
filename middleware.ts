import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import getServerLocale from './lib/utils/stuff-server';
import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';

const locales = ['ar', 'en'];
const withIntlMiddleware = createMiddleware(routing);


const protectedPaths = ['/dashboard'];
const getProtectedRoutes = (protectedPaths:string[], locales:string[])=>{
let protectedPathsWithLocale = [...protectedPaths];
protectedPaths.forEach(route=>{
    locales.forEach(
        locale=>(
            protectedPathsWithLocale =[
                ...protectedPathsWithLocale,
                `/${locale}${route}`.toLowerCase()
            ]
        )
    )
});
return protectedPathsWithLocale
};


const isProtectedPath = (path:string) : boolean=>{
    return getProtectedRoutes(protectedPaths,locales).includes(path);
};


const secret = process.env.NEXTAUTH_SECREAT!;

const withAuthMiddleware = withAuth(
    function middleware(req){
       return withIntlMiddleware(req);
    },
    {
        secret: secret,
        callbacks: {
            authorized: async ({ token }) => !!token,
        },
        pages: {
            signIn: "/ar/sign-in",
            error:"/"
        }
});



export default async function middleware(req: NextRequest , res:NextResponse) {
    const url = req.nextUrl.clone();
    url.searchParams.set('pathname', req.nextUrl.pathname);
    
    const pathname = req.nextUrl.pathname!;
    const {locale} = await getServerLocale();
    let pathnameWithLocale = pathname;

    if(!pathnameWithLocale?.startsWith(`/${locale}`)){
        pathnameWithLocale = `/${locale}${pathnameWithLocale}`
    }

    const token = await getToken({req , secret});
    const isAuthorized = !!token;




    if (pathname === '/' || pathname === `/${locale}`) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }

    if(isAuthorized && (pathname?.startsWith(`/${locale}/sign-in`)  || pathname?.startsWith(`/${locale}/forget-password`))){
        return NextResponse.redirect(new URL(`/${locale}/dashboard`,req.nextUrl));
    }

    // const isProtected = isProtectedPath(pathnameWithLocale);   
    
    // if(){
    //     return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
    // }

    if(!isAuthorized && pathname?.startsWith(`/${locale}/dashboard`))
        return (withAuthMiddleware as any) (req);
    else 
    return withIntlMiddleware(req);

}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};



//----------------------------------------------------
// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';
 
// export default createMiddleware(routing);
 
// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(ar|en)/:path*']
// };