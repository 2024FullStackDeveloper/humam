"use client";

import { Link, useRouter } from "@/i18n/routing";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LogOut, UserSquareIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import TextButton from "../common/text-button";
import Image from "next/image";
import useLocalizer from "@/lib/hooks/use-localizer";
import { signOut, useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FormButton from "../common/form-button";
import { Button } from "../ui/button";
import { useToggle } from "@uidotdev/usehooks";
import ApiAction from "@/lib/server/action";
import { toast } from "sonner";

const ProfileButton = () => {
  const { t } = useLocalizer();
  const session = useSession();
  const userDetails = session?.data?.user?.userDetails;
  const router = useRouter();
  const [on, toggle] = useToggle(true);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative h-10 w-10 border border-secondary rounded-full flex items-center justify-center overflow-hidden cursor-pointer select-none">
          {userDetails?.personImg ? (
            <Image
              src={userDetails?.personImg}
              priority
              fill
              objectFit="cover"
              alt="profile"
            />
          ) : (
            <span className="!text-primary">{userDetails?.fullName}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" sticky="always">
        <div className="flex flex-col">
          <Link
            href="/dashboard/profile"
            className="flex flex-row gap-2 !text-sm md:!text-[16px] text-primary items-center transition-all duration-100 hover:font-bold"
          >
            <UserSquareIcon />
            {t("buttons.profile")}
          </Link>
          <Separator className="my-3" />

          <Dialog open={on} onOpenChange={toggle}>
            <DialogTrigger className="order-3" asChild>
              <TextButton className="!text-sm text-primary md:!text-[16px] !font-normal gap-2 !flex !flex-row items-center transition-all duration-100 hover:!font-bold">
                <LogOut />
                {t("buttons.sign_out")}
              </TextButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("titles.sign_out")}</DialogTitle>
                <Separator className="my-3" />
                <DialogDescription>
                  {t("paragraphs.sign_out")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <form action={async () => {
                  const response = await ApiAction<boolean>({
                    method:"POST",
                    controller:"user",
                    url:"logout",
                    authorized:true,
                  });

                  try{
                  if(!response.isServerOn){
                    toast.error(t(response.serverOffMessage));
                  }

                  if(response.result?.code == 0 && response?.result?.data == true){
                    toast.success(response.result.message);
                  }else{
                    toast.error(response.result?.message);
                  }

                  await signOut({redirect:false});
                  router.replace('/sign-in');
                }catch{
                  console.log('Something wrong occured once loging out.');
                }
                router.refresh();

                }}>
                  <FormButton title={t("buttons.ok")} />
                </form>
                <Button onClick={() => {toggle(false)}} variant="secondary">
                  {t("buttons.cancel")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileButton;
