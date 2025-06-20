import { HandCoins, Home, Megaphone, MicVocal, Settings, Shapes, Tag, Users } from "lucide-react";
import { RouteType } from "../types/common-type";

const adminRoutes : Array<RouteType> = [
    {
        id:1,
        title:"routes.home",
        route:"/dashboard",
        icon: <Home/>
    },
    {
        id:2,
        title:"routes.user_management",
        route:"/dashboard/users",
        icon: <Users/>,
    },
    {
        id:3,
        title:"routes.services",
        route:"/dashboard/services",
        icon: <Tag/>,
    },
    {
        id:4,
        title:"routes.ads",
        route:"/dashboard/ads",
        icon: <Megaphone />,
    },
    {
        id:5,
        title:"routes.offers",
        route:"/dashboard/offers",
        icon: <Shapes />,
    },
    {
        id:6,
        title:"routes.operations",
        route:'',
        icon: <HandCoins />,
        sub:[
            {
                id:61,
                title:"routes.wallet",
                route:"/dashboard/wallet",
            },
            {
                id:62,
                title:"routes.transcations",
                route:"/dashboard/transcations",
            }
        ]
    },
    {
        id:7,
        title:"routes.settings",
        route:'',
        icon: <Settings/>,
        sub:[
            {
                id:71,
                title:"routes.regions_cities",
                route:"/dashboard/regions",
            },
            {
                id:72,
                title:"routes.global_categories",
                route:"/dashboard/categories",
            },
            {
                id:73,
                title:"routes.global_settings",
                route:"/dashboard/settings",
            },
           {
                id:74,
                title:"routes.contact_us",
                route:"/dashboard/contact-us",
            },
            {
                id:75,
                title:"routes.social_media",
                route:"/dashboard/social-media",
            },
            {
                id:76,
                title:"routes.common_questions",
                route:"/dashboard/common-questions",
            },
            {
                id:77,
                title:"routes.about_app",
                route:"/dashboard/about-app",
            }
        ]
    },

];


export default adminRoutes;