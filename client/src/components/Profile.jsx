import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import { useSelector } from "react-redux";
import Companies from "./admin/Companies";
import UpdateProfileDialog from "./UpdateProfileDialog";
import ReactHelmet from "./shared/ReactHelmet";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  console.log("user", user);

  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      <Navbar />
      <ReactHelmet
        title="Profile - Next_Hire"
        description="View and edit your profile details, including your resume, job preferences, and application history. Manage your career journey with Next_Hire."
        canonicalUrl="http://mysite.com/profile"
      />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.profile?.profilePhoto?.url}
                alt="profile"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p className="text-gray-600">{user?.profile.bio}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail className="text-gray-600" />
            <span className="text-gray-800">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact className="text-gray-600" />
            <span className="text-gray-800">{user?.phoneNumber}</span>
          </div>
        </div>

        {/* Conditional Rendering for Skills and Resume */}
        {user?.role === "student" && (
          <>
            <div className="my-5">
              <h1 className="text-lg font-semibold">Skills</h1>
              <div className="flex flex-wrap items-center gap-1 mt-2">
                {user?.profile.skills?.length !== 0 ? (
                  user?.profile.skills?.map((item, index) => (
                    <Badge key={index}>{item}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500">NA</span>
                )}
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label className="text-md font-bold">Resume</Label>
              {user?.profile?.resume ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={user?.profile?.resume?.url}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  {user?.profile?.resume?.resumeOriginalName}
                </a>
              ) : (
                <span className="text-gray-500">NA</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Conditional Rendering for Applied Jobs and Companies */}
      {user?.role === "student" && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl my-5 p-6 sm:p-8">
          <h1 className="font-bold text-lg text-center my-5">Applied Jobs</h1>
          <AppliedJobTable />
        </div>
      )}
      {user?.role === "recruiter" && <Companies />}

      <UpdateProfileDialog open={open} setOpen={setOpen} user={user} />
    </div>
  );
};

export default Profile;
