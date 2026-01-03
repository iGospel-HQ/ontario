"use client";

import type React from "react";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, User, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  gender: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiService.getUserProfile(),
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone || "",
          gender: profile.gender || "",
          bio: profile.bio || "",
          address: profile.address || "",
          country: profile.country || "",
          state: profile.state || "",
        }
      : undefined,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => apiService.updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => apiService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setAvatarFile(null);
      toast.success("Avatar Updated", {
        description: "Your profile picture has been updated.",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to upload avatar. Please try again.",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormData) =>
      apiService.changePassword(
        data.current_password,
        data.new_password,
        data.confirm_password
      ),
    onSuccess: () => {
      resetPasswordForm();
      toast.success("Password Changed", {
        description: "Your password has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description:
          error?.response?.data?.detail ||
          error?.response?.data?.old_password?.[0] ||
          error?.response?.data?.new_password?.[0] ||
          "Failed to change password. Please check your current password.",
      });
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      uploadAvatarMutation.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initials = profile
    ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(
        0
      )}`.toUpperCase()
    : "U";

  return (
    <div className="space-y-6 max-w-4xl m-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Profile Picture
          </CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="size-24 border-2 border-border">
              <AvatarImage
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : profile?.image || undefined
                }
              />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-fit">
                  {uploadAvatarMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      Upload Photo
                    </>
                  )}
                </div>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadAvatarMutation.isPending}
              />
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" {...registerProfile("first_name")} />
                {profileErrors.first_name && (
                  <p className="text-sm text-destructive">
                    {profileErrors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...registerProfile("last_name")} />
                {profileErrors.last_name && (
                  <p className="text-sm text-destructive">
                    {profileErrors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  {...registerProfile("phone")}
                />
                {profileErrors.phone && (
                  <p className="text-sm text-destructive">
                    {profileErrors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={watch("gender") || ""}
                  onValueChange={(value) => setValue("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {profileErrors.gender && (
                  <p className="text-sm text-destructive">
                    {profileErrors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little about yourself..."
                rows={10}
                {...registerProfile("bio")}
              />
              {profileErrors.bio && (
                <p className="text-sm text-destructive">
                  {profileErrors.bio.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter your address"
                {...registerProfile("address")}
              />
              {profileErrors.address && (
                <p className="text-sm text-destructive">
                  {profileErrors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Enter your country"
                  {...registerProfile("country")}
                />
                {profileErrors.country && (
                  <p className="text-sm text-destructive">
                    {profileErrors.country.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="Enter your state"
                  {...registerProfile("state")}
                />
                {profileErrors.state && (
                  <p className="text-sm text-destructive">
                    {profileErrors.state.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Change your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                {...registerPassword("current_password")}
              />
              {passwordErrors.current_password && (
                <p className="text-sm text-destructive">
                  {passwordErrors.current_password.message}
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                {...registerPassword("new_password")}
              />
              {passwordErrors.new_password && (
                <p className="text-sm text-destructive">
                  {passwordErrors.new_password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                {...registerPassword("confirm_password")}
              />
              {passwordErrors.confirm_password && (
                <p className="text-sm text-destructive">
                  {passwordErrors.confirm_password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="destructive"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
