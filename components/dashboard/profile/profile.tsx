"use client";

import ActiveBudge from "@/components/common/active-budge";
import AviatorImageUploader from "@/components/common/aviator-image-uploader";
import DisplayInput from "@/components/common/display-input";
import KeyValueBox from "@/components/common/key-value-box";
import PageWrapper from "@/components/common/page-wrapper";
import TitleHeader from "@/components/common/title-header";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUserInfoStore } from "@/lib/features/info/use-user-info-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { IPatchUserInfoSchema } from "@/lib/schemas/users-schema";
import { validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import dateFormat from "dateformat";
import { Mail, Phone, User } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
const Profile = () => {
  const { t, isRtl } = useLocalizer();
  const session = useSession();

  const [personFile, setPersonFile] = React.useState<string | undefined>(
    undefined
  );
  const permissions = React.useMemo(() => {
    if (!session?.data?.user?.userDetails?.permissions) return [];
    return session?.data?.user?.userDetails?.permissions;
  }, [session?.data?.user?.userDetails?.permissions]);

  const { isPending, getUserInfo, userInfo , patchUserInfo } = useUserInfoStore();

  const [request, setRequest] = React.useState<
    z.infer<typeof IPatchUserInfoSchema>
  >({
    fullName: session?.data?.user?.userDetails?.fullName ?? "",
    email: session?.data?.user?.userDetails?.email ?? "",
  });
  const [errors, setErrors] = React.useState<any | undefined>(undefined);

  const fetchData = async () => {
    await getUserInfo();
  };

  React.useEffect(() => {
    if (session?.status === "authenticated") {
      fetchData();
    }
  }, [session?.status]);

  React.useEffect(() => {
    if (session?.status === "authenticated") {
      setRequest({
        fullName:
          userInfo?.fullName ??
          session?.data?.user?.userDetails?.fullName ??
          "",
        email: userInfo?.email ?? session?.data?.user?.userDetails?.email ?? "",
      });
    }
  }, [userInfo]);


  const handleSubmit = async () => {
    setErrors(undefined);
    const validate = validateData(IPatchUserInfoSchema, request);

    if (!validate.isValid) {
      setErrors(validate.errorsList);
      return;
    }

    let updatedRequest: z.infer<typeof IPatchUserInfoSchema>  = request;
    if(personFile){
      updatedRequest.personFile = {data: personFile};
      console.log("personFile", updatedRequest);
    }
    const response = await patchUserInfo(updatedRequest);
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }

    if(response?.fields) {
      setErrors(validateAPIErrors(response?.fields));
     return; 
    }

    if (response?.code == 0 && response?.data) {
      setPersonFile(undefined);
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
    }
  }

  return (
    <PageWrapper
      stickyButtomControls
      stickyRightButtonOptions={{
        label: t("buttons.save"),
        loading: isPending,
        onClick: handleSubmit,
      }}
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.profile",
        },
      ]}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1 bg-white rounded-md shadow-md p-4 flex flex-col gap-4">
          <div className="flex items-center justify-center">

              <AviatorImageUploader
                imageUrl={userInfo?.personImg ?? session?.data?.user?.userDetails?.personImg}
                onImageUpload={(_, base64String) => {
                  setPersonFile(base64String);
                }}
                onImageRemove={() => {
                  setPersonFile(undefined);
                }}
              />
          </div>
          <h3 className="font-bold text-center">
            {userInfo?.fullName ?? session?.data?.user?.userDetails?.fullName}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <KeyValueBox
              keyTitle={t("labels.role")}
              value={userInfo?.role || session?.data?.user?.userDetails?.role}
            />
            <KeyValueBox
              keyTitle={t("labels.is_super_user")}
              value={
                <ActiveBudge
                  isActive={
                    userInfo?.isSuperUser ||
                    session?.data?.user?.userDetails?.isSuperUser
                  }
                />
              }
            />
          </div>

          <Separator className="my-2" />
          {(userInfo?.crtdAt || session?.data?.user?.userDetails?.crtdAt) && (
            <KeyValueBox
              keyTitle={t("labels.crtd_at")}
              value={dateFormat(
                userInfo?.crtdAt ??
                  session?.data?.user?.userDetails?.crtdAt ??
                  "",
                "dd/mm/yyyy hh:MM TT"
              )}
            />
          )}
          {(userInfo?.lastLogin ||
            session?.data?.user?.userDetails?.lastLogin) && (
            <KeyValueBox
              keyTitle={t("labels.last_log_in")}
              value={dateFormat(
                userInfo?.lastLogin ??
                  session?.data?.user?.userDetails?.lastLogin ??
                  "",
                "dd/mm/yyyy hh:MM TT"
              )}
            />
          )}

          {(userInfo?.lastLogOut ||
            session?.data?.user?.userDetails?.lastLogOut) && (
            <KeyValueBox
              keyTitle={t("labels.last_log_out")}
              value={dateFormat(
                userInfo?.lastLogOut ??
                  session?.data?.user?.userDetails?.lastLogOut ??
                  "",
                "dd/mm/yyyy hh:MM TT"
              )}
            />
          )}
          <Separator className="my-2" />
          <div className="flex flex-col gap-2">
            <DisplayInput
              label={t("labels.phone_number")}
              value={session?.data?.user?.userDetails?.phoneNumber ?? ""}
              prefixicon={<Phone />}
            />
            <Input
              label={t("labels.full_name")}
              placeholder={t("placeholders.full_name")}
              prefixicon={<User />}
              value={request.fullName}
              onChange={(e) =>
                setRequest({ ...request, fullName: e.target.value })
              }
              error={errors?.fullName && t(errors?.fullName?.[0])}
            />
            <Input
              type="email"
              label={t("labels.email")}
              placeholder={t("placeholders.email")}
              prefixicon={<Mail />}
              value={request.email}
              onChange={(e) =>
                setRequest({ ...request, email: e.target.value })
              }
              error={errors?.email && t(errors?.email?.[0])}
            />
          </div>
        </div>
        <div className="xl:col-span-2">
          <TitleHeader title={t("titles.permissions")} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {permissions?.map((permission) => (
              <KeyValueBox
                key={permission.id}
                keyTitle={isRtl ? permission.arDesc : permission.enDesc}
                value={<ActiveBudge isActive={permission.claimValue} />}
              />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
