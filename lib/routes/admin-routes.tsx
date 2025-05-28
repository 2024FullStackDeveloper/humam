import { Home, Settings, Users } from "lucide-react";
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
        title:"routes.settings",
        route:'',
        icon: <Settings/>,
        sub:[
            {
                id:31,
                title:"routes.regions_cities",
                route:"/dashboard/regions",
            },
            {
                id:32,
                title:"routes.global_categories",
                route:"/dashboard/categories",
            },
            {
                id:33,
                title:"routes.global_settings",
                route:"/dashboard/settings",
            },
           {
                id:34,
                title:"routes.contact_us",
                route:"/dashboard/contact-us",
            },
            {
                id:35,
                title:"routes.social_media",
                route:"/dashboard/social-media",
            },
            {
                id:36,
                title:"routes.common_questions",
                route:"/dashboard/common-questions",
            },
            {
                id:37,
                title:"routes.about_app",
                route:"/dashboard/about-app",
            }
        ]
    },

];


export default adminRoutes;