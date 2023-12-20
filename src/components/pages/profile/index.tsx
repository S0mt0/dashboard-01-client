import { ChangeEvent, useEffect, useState } from "react";
import { PencilLine } from "lucide-react";

import { ToolTip } from "@/components";
import { Button } from "@/components/ui/button";

import { useAuth } from "../../../../sdk";
import { convertToBase64, useDragAndDrop } from "./lib";
import { useProfileForm } from "./lib/use-profile-form";

const ProfilePage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    authStore: { authProfile },
  } = useAuth();

  const [imgUrl, setImgUrl] = useState("");
  const { file, getInputProps, getRootProps } = useDragAndDrop();

  useEffect(() => {
    const setDisplayImage = async () => {
      const url = file && (await convertToBase64(file as File));
      setImgUrl(url as string);
    };

    setDisplayImage();
    setCanceled(false);
  }, [file]);

  const [profile, setProfile] = useState<Record<string, any>>({});

  useEffect(() => {
    setProfile(authProfile);
  }, [authProfile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const { name, value } = e.target;
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = useProfileForm();
  const handleCancel = () => {
    setProfile((current) => ({
      ...current,
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
      username: authProfile.username,
      email: authProfile.email,
      avatar: authProfile.avatar,
    }));

    setImgUrl("");
    setCanceled(true);
  };

  if (!isMounted) return null;
  return (
    <div className="p-10 pt-20">
      <div className="mx-auto max-w-[620px] p-2">
        <div className="flex justify-center flex-col gap-y-4 items-center">
          <ToolTip
            description="Click to select or drag and drop a photo here. Tips: Images only, 5MB max size."
            side="right"
          >
            <div
              {...getRootProps()}
              className="rounded-full w-fit relative border-none outline-none focus:ring-2 focus:ring-orange-400/75"
            >
              <input {...getInputProps()} />
              <img
                src={imgUrl || profile.avatar || "/user1.png"}
                alt="avatar"
                className="w-44 h-44 rounded-full object-cover shadow-lg"
                role="button"
              />

              <span className=" bg-orange-500 w-fit absolute right-0 bottom-1/4 transform translate-x-1/2 rounded-full p-1 cursor-pointer">
                <PencilLine className="w- h- text-white" />
              </span>
            </div>
          </ToolTip>

          <div className="text-slate-600 text-xl font-bold">
            <span className="text-orange-400 mr-[3px]">***</span>
            {authProfile.username || "James Bond"}
            <span className="text-orange-400 ml-[3px]">***</span>
          </div>
        </div>

        <form
          className="mt-14 flex flex-col gap-y-10"
          onSubmit={(e) =>
            handleSubmit(e, {
              ...profile,
              avatar: canceled ? profile.avatar : file,
            })
          }
        >
          <div className="flex w-full flex-col sm:flex-row gap-x-14 gap-y-4">
            <p className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-gray-50 border border-gray-300 p-2 text-lg rounded-3xl px-4 text-slate-600 outline-none focus:ring-2 focus:ring-orange-400/75"
                value={profile.username}
                onChange={(e) => handleChange(e)}
                name="username"
                autoComplete="on"
              />
            </p>
            <p className="w-full sm:w-1/2">
              <input
                type="email"
                placeholder="Email@example.com"
                className="w-full bg-gray-50 border border-gray-300 p-2 text-lg rounded-3xl px-4 text-slate-600 outline-none focus:ring-2 focus:ring-orange-400/75"
                value={profile.email}
                onChange={(e) => handleChange(e)}
                name="email"
                autoComplete="on"
              />
            </p>
          </div>
          <div className="flex w-full flex-col sm:flex-row gap-x-14 gap-y-4">
            <p className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Current Password"
                className="w-full bg-gray-50 border border-gray-300 p-2 text-lg rounded-3xl px-4 text-slate-600 outline-none focus:ring-2 focus:ring-orange-400/75"
                value={profile.oldPassword}
                onChange={(e) => handleChange(e)}
                name="oldPassword"
              />
            </p>
            <p className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="New Password"
                className="w-full bg-gray-50 border border-gray-300 p-2 text-lg rounded-3xl px-4 text-slate-600 outline-none focus:ring-2 focus:ring-orange-400/75"
                value={profile.newPassword}
                onChange={(e) => handleChange(e)}
                name="newPassword"
              />
            </p>
          </div>
          <div className="flex w-full flex-col sm:flex-row gap-x-14 gap-y-4">
            <p className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Confirm Password"
                className="w-full bg-gray-50 border border-gray-300 p-2 text-lg rounded-3xl px-4 text-slate-600 outline-none focus:ring-2 focus:ring-orange-400/75"
                value={profile.confirmPassword}
                onChange={(e) => handleChange(e)}
                name="confirmPassword"
              />
            </p>
            <div className="hidden sm:block sm:w-1/2" />
          </div>

          <div />
          <div className="flex flex-col sm:flex-row gap-x-14 gap-y-8">
            <Button
              type="button"
              className="w-full sm:max-w-[300px] sm:mx-auto rounded-full border-none outline-none focus:ring-2 focus:ring-orange-400/75"
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:max-w-[300px] sm:mx-auto bg-orange-600/95 rounded-full disabled:bg-orange-600/75 border-none outline-none focus:ring-2 focus:ring-orange-400/75"
              // disabled
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
