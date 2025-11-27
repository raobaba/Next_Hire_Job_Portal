import { useEffect, useState } from "react";
import { FaUser, FaLock, FaBell, FaShieldAlt } from "react-icons/fa";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, updateUserProfile } from "@/redux/slices/user.slice";
import { Avatar, AvatarImage } from "./ui/avatar";
import Loader from "./shared/Loader";
import { toast } from "react-toastify";
import ReactHelmet from "./shared/ReactHelmet";

const tabs = [
  { id: "settings", label: "Profile Info", icon: <FaUser /> },
  { id: "password", label: "Change Password", icon: <FaLock /> },
  { id: "notifications", label: "Notifications", icon: <FaBell /> },
  { id: "privacy", label: "Privacy", icon: <FaShieldAlt /> },
];

export default function Settings() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");
  const [activeTab, setActiveTab] = useState(page || "settings");
  useEffect(() => {
    setActiveTab(page);
  }, [page]);

  return (
    <>
      <Navbar />
      <ReactHelmet
        title='Setting - Next_Hire'
        description='Setting for NextHire'
        canonicalUrl='http://mysite.com/settings'
      />
      <div className='flex flex-col min-h-screen'>
        <div className='flex-1 mx-4 pt-20 flex gap-6 max-w-7xl'>
          <div className='w-[300px] bg-white shadow-md rounded-lg px-4'>
            <h2 className='text-xl font-semibold mb-4'>Settings</h2>
            <div className='flex flex-col gap-2'>
              {tabs?.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition text-left ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex-1 bg-white shadow px-6 rounded-lg'>
            {activeTab === "settings" && <ProfileTab />}
            {activeTab === "password" && <PasswordTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "privacy" && <PrivacyTab />}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

function ProfileTab() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber ? String(user.phoneNumber) : "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        file: null,
      });
    }
  }, [user]);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email || !input.phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);

    const skillsArray = input.skills
      ? input.skills.split(",").map((skill) => skill.trim())
      : [];
    formData.append("skills", skillsArray);

    if (input.file) {
      formData.append("resume", input.file);
    }
    setLoading(true);
    dispatch(updateUserProfile(formData))
      .then((res) => {
        if (res?.payload?.status === 200) {
          setLoading(false);
          toast.success("Profile updated successfully!");
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to update profile.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={submitHandler} className='space-y-6'>
      {loading && <Loader />}
      <div className='flex items-start gap-6'>
        <div className='flex flex-col items-center'>
          <Avatar className='h-24 w-24'>
            <AvatarImage src={user?.profile?.profilePhoto?.url} alt='profile' />
          </Avatar>
          <label className='cursor-pointer bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 inline-block'>
            Upload
            <input
              id='file'
              name='file'
              type='file'
              accept='image/png'
              className='hidden'
            />
          </label>
        </div>
        <div className='flex-1'>
          <label className='block font-medium mb-1'>Bio</label>
          <textarea
            name='bio'
            value={input.bio}
            onChange={changeHandler}
            rows='4'
            className='block w-full rounded border border-gray-300 p-2 resize-none focus:ring focus:ring-blue-500'
          ></textarea>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div>
          <label className='block font-medium'>Full Name</label>
          <input
            name='fullname'
            value={input.fullname}
            onChange={changeHandler}
            type='text'
            className='mt-1 block w-full rounded border border-gray-300 p-2 focus:ring focus:ring-blue-500'
          />
        </div>
        <div>
          <label className='block font-medium'>Email</label>
          <input
            name='email'
            value={input.email}
            onChange={changeHandler}
            type='email'
            disabled
            className='mt-1 block w-full rounded border border-gray-300 p-2'
          />
        </div>
        <div>
          <label className='block font-medium'>Phone</label>
          <input
            name='phoneNumber'
            value={input.phoneNumber}
            onChange={changeHandler}
            type='tel'
            className='mt-1 block w-full rounded border border-gray-300 p-2'
          />
        </div>
      </div>

      {user?.role === "student" && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block font-medium'>Skills</label>
            <input
              name='skills'
              value={input.skills}
              onChange={changeHandler}
              type='text'
              className='mt-1 block w-full rounded border border-gray-300 p-2'
            />
          </div>
          <div>
            <label className='block font-medium'>Upload Resume</label>
            <input
              name='file'
              onChange={fileHandler}
              type='file'
              accept='.pdf,.doc,.docx'
              className='mt-1 block w-full rounded border border-gray-300 p-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
            />
          </div>
        </div>
      )}

      <div>
        <button
          type='submit'
          className='mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
          disabled={loading}
        >
          {loading ? "Please wait..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function PasswordTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    const data = {
      currentPassword,
      newPassword,
    };

    try {
      const response = await dispatch(changePassword(data));
      if (response?.payload?.status == 200) {
        toast.success(response?.payload?.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response?.payload?.message);
      }
    } catch (err) {
      setError("An error occurred, please try again later");
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <label className='block font-medium'>Current Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded border border-gray-300 p-2'
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (error) setError(""); // Clear error when user types
          }}
        />
      </div>
      <div>
        <label className='block font-medium'>New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded border border-gray-300 p-2'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label className='block font-medium'>Confirm New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded border border-gray-300 p-2'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <div className='text-red-500'>{error}</div>}

      <button
        onClick={handlePasswordChange}
        className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
      >
        Update Password
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className='space-y-4'>
      <label className='flex items-center gap-2'>
        <input type='checkbox' className='accent-blue-600' />
        Email me about new applicants
      </label>
      <label className='flex items-center gap-2'>
        <input type='checkbox' className='accent-blue-600' />
        Notify me of interview reminders
      </label>
      <label className='flex items-center gap-2'>
        <input type='checkbox' className='accent-blue-600' />
        Job recommendations
      </label>
      <button className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
        Save Preferences
      </button>
    </div>
  );
}

function PrivacyTab() {
  return (
    <div className='space-y-4'>
      <label className='flex items-center gap-2'>
        <input type='checkbox' className='accent-blue-600' />
        Make my profile public
      </label>
      <label className='flex items-center gap-2'>
        <input type='checkbox' className='accent-blue-600' />
        Allow resume downloads
      </label>
      <div className='mt-6 border-t pt-4'>
        <button className='text-red-600 hover:underline'>
          Deactivate Account
        </button>
        <br />
        <button className='text-red-600 hover:underline mt-2'>
          Delete My Account
        </button>
      </div>
    </div>
  );
}
