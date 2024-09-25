import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import ReactHelmet from "./shared/ReactHelmet";

// Sample user data for demonstration purposes
const sampleUser = {
  fullname: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  profile: {
    bio: "A passionate software developer.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    resume: "https://example.com/resume.pdf",
    resumeOriginalName: "John_Doe_Resume.pdf",
  },
};

const isResume = true;

const Profile = () => {
  const [open, setOpen] = useState(false);
  const user = sampleUser; // Use sample user data

  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      <Navbar />
      <ReactHelmet
        title="Profile - Next_Hire"
        description="View and edit your profile details, including your resume, job preferences, and application history. Manage your career journey with Next_Hire."
        canonicalUrl="http://mysite.com/profile"
      />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                alt="profile"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user.fullname}</h1>
              <p className="text-gray-600">{user.profile.bio}</p>
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
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact className="text-gray-600" />
            <span className="text-gray-800">{user.phoneNumber}</span>
          </div>
        </div>
        <div className="my-5">
          <h1 className="text-lg font-semibold">Skills</h1>
          <div className="flex flex-wrap items-center gap-1 mt-2">
            {user.profile.skills.length !== 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span className="text-gray-500">NA</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {isResume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user.profile.resume}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              {user.profile.resumeOriginalName}
            </a>
          ) : (
            <span className="text-gray-500">NA</span>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl my-5 p-6 sm:p-8">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        {/* Applied Job Table */}
        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
