import { useEffect, useState } from "react";
import { FaUser, FaLock, FaBell, FaShieldAlt } from "react-icons/fa";
import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, updateUserProfile } from "@/redux/slices/user.slice";
import { Avatar, AvatarImage } from "../../ui/avatar";
import Loader from "../../common/Loader";
import { toast } from "react-toastify";
import ReactHelmet from "../../common/ReactHelmet";

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
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      <ReactHelmet
        title='Setting - Next_Hire'
        description='Setting for NextHire'
        canonicalUrl='/settings'
      />
      <div className='flex flex-col min-h-screen'>
        <div className='flex-1 mx-4 pt-24 flex gap-6 max-w-7xl relative z-10'>
          <div className='w-[300px] bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 shadow-lg rounded-2xl px-4 py-6 sticky top-24 h-fit'>
            <h2 className='text-2xl font-extrabold mb-6 bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
              Settings
            </h2>
            <div className='flex flex-col gap-2'>
              {tabs?.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] text-white shadow-lg transform scale-105"
                      : "bg-gray-100/80 text-gray-700 hover:bg-gradient-to-r hover:from-[#6A38C2]/10 hover:to-[#F83002]/10 hover:text-[#6A38C2] hover:border hover:border-[#6A38C2]/20"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex-1 bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 shadow-lg px-6 py-8 rounded-2xl'>
            {activeTab === "settings" && <ProfileTab />}
            {activeTab === "password" && <PasswordTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "privacy" && <PrivacyTab />}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    bio: "",
    skills: "",
    file: null,
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
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

  const avatarHandler = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setInput({ ...input, avatar: file });
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("bio", input.bio);

    const skillsArray = input.skills
      ? input.skills.split(",").map((skill) => skill.trim())
      : [];
    formData.append("skills", skillsArray);

    if (input.file) {
      formData.append("resume", input.file);
    }
    if (input.avatar) {
      formData.append("avatar", input.avatar);
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
          <div className='relative mb-4'>
            <Avatar className='h-24 w-24 ring-4 ring-[#6A38C2]/20'>
              <AvatarImage src={user?.profile?.profilePhoto?.url} alt='profile' />
            </Avatar>
            <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded-full border-2 border-white'></div>
          </div>
          <label className='cursor-pointer bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block'>
            Upload Photo
            <input
              id='avatar'
              name='avatar'
              type='file'
              accept='image/*'
              onChange={avatarHandler}
              className='hidden'
            />
          </label>
        </div>
        <div className='flex-1'>
          <label className='block font-bold mb-2 text-gray-900'>Bio</label>
          <textarea
            name='bio'
            value={input.bio}
            onChange={changeHandler}
            rows='4'
            className='block w-full rounded-xl border-2 border-gray-200/60 p-3 resize-none focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          ></textarea>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block font-bold mb-2 text-gray-900'>Full Name</label>
          <input
            name='fullname'
            value={input.fullname}
            onChange={changeHandler}
            type='text'
            className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          />
        </div>
        <div>
          <label className='block font-bold mb-2 text-gray-900'>Email</label>
          <input
            name='email'
            value={input.email}
            onChange={changeHandler}
            type='email'
            disabled
            className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 bg-gray-100/80 cursor-not-allowed'
          />
        </div>
      </div>

      {user?.role === "student" && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block font-bold mb-2 text-gray-900'>Skills</label>
            <input
              name='skills'
              value={input.skills}
              onChange={changeHandler}
              type='text'
              className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
              placeholder='e.g., React, Node.js, Python'
            />
          </div>
          <div>
            <label className='block font-bold mb-2 text-gray-900'>Upload Resume</label>
            <input
              name='file'
              onChange={fileHandler}
              type='file'
              accept='.pdf,.doc,.docx'
              className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#6A38C2] file:to-[#5b30a6] file:text-white hover:file:from-[#5b30a6] hover:file:to-[#4a2580] file:cursor-pointer transition-all duration-300 bg-white/80 backdrop-blur-sm'
            />
          </div>
        </div>
      )}

      <div>
        <button
          type='submit'
          className='mt-4 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
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
    <div className='space-y-6'>
      <div>
        <label className='block font-bold mb-2 text-gray-900'>Current Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (error) setError("");
          }}
        />
      </div>
      <div>
        <label className='block font-bold mb-2 text-gray-900'>New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label className='block font-bold mb-2 text-gray-900'>Confirm New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-xl p-4'>
          <p className='text-red-700 font-semibold'>{error}</p>
        </div>
      )}

      <button
        onClick={handlePasswordChange}
        className='mt-4 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
      >
        Update Password
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className='space-y-6'>
      <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 rounded-lg p-3 transition-colors duration-200'>
          <input type='checkbox' className='w-5 h-5 text-[#6A38C2] border-gray-300 rounded focus:ring-[#6A38C2] focus:ring-2 cursor-pointer' />
          <span className='font-semibold text-gray-900'>Email me about new applicants</span>
        </label>
      </div>
      <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 rounded-lg p-3 transition-colors duration-200'>
          <input type='checkbox' className='w-5 h-5 text-[#6A38C2] border-gray-300 rounded focus:ring-[#6A38C2] focus:ring-2 cursor-pointer' />
          <span className='font-semibold text-gray-900'>Notify me of interview reminders</span>
        </label>
      </div>
      <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 rounded-lg p-3 transition-colors duration-200'>
          <input type='checkbox' className='w-5 h-5 text-[#6A38C2] border-gray-300 rounded focus:ring-[#6A38C2] focus:ring-2 cursor-pointer' />
          <span className='font-semibold text-gray-900'>Job recommendations</span>
        </label>
      </div>
      <button className='mt-4 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'>
        Save Preferences
      </button>
    </div>
  );
}

function PrivacyTab() {
  return (
    <div className='space-y-6'>
      <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 rounded-lg p-3 transition-colors duration-200'>
          <input type='checkbox' className='w-5 h-5 text-[#6A38C2] border-gray-300 rounded focus:ring-[#6A38C2] focus:ring-2 cursor-pointer' />
          <span className='font-semibold text-gray-900'>Make my profile public</span>
        </label>
      </div>
      <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 rounded-lg p-3 transition-colors duration-200'>
          <input type='checkbox' className='w-5 h-5 text-[#6A38C2] border-gray-300 rounded focus:ring-[#6A38C2] focus:ring-2 cursor-pointer' />
          <span className='font-semibold text-gray-900'>Allow resume downloads</span>
        </label>
      </div>
      <div className='mt-8 border-t-2 border-gray-200 pt-6 space-y-3'>
        <button className='text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200'>
          Deactivate Account
        </button>
        <br />
        <button className='text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200'>
          Delete My Account
        </button>
      </div>
    </div>
  );
}
