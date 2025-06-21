import { HandCoins, Home, Megaphone, Settings, Shapes, Tag, Users } from "lucide-react";
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
        route:"/dashboard/users?paginate=true&page=1&size=50",
        icon: <Users/>,
    },
    {
        id:3,
        title:"routes.services",
        route:"/dashboard/services?paginate=true&page=1&size=50",
        icon: <Tag/>,
    },
    {
        id:4,
        title:"routes.ads",
        route:"/dashboard/ads?paginate=true&page=1&size=50",
        icon: <Megaphone />,
    },
    {
        id:5,
        title:"routes.offers",
        route:"/dashboard/offers?paginate=true&page=1&size=50",
        icon: <Shapes />,
    },
    {
        id:6,
        title:"routes.operations",
        route:"/dashboard/transcations?paginate=true&page=1&size=50",
        icon: <HandCoins />
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
                route:"/dashboard/regions?paginate=true&page=1&size=50",
            },
            {
                id:72,
                title:"routes.global_categories",
                route:"/dashboard/categories?paginate=true&page=1&size=50",
            },
            {
                id:73,
                title:"routes.global_settings",
                route:"/dashboard/settings",
            },
           {
                id:74,
                title:"routes.contact_us",
                route:"/dashboard/contact-us?paginate=true&page=1&size=50",
            },
            {
                id:75,
                title:"routes.social_media",
                route:"/dashboard/social-media?paginate=true&page=1&size=50",
            },
            {
                id:76,
                title:"routes.common_questions",
                route:"/dashboard/common-questions?paginate=true&page=1&size=50",
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