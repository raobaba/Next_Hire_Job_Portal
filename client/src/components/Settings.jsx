import { useState } from "react";
import { FaUser, FaLock, FaBell, FaShieldAlt } from "react-icons/fa";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const tabs = [
  { id: "profile", label: "Profile Info", icon: <FaUser /> },
  { id: "password", label: "Change Password", icon: <FaLock /> },
  { id: "notifications", label: "Notifications", icon: <FaBell /> },
  { id: "privacy", label: "Privacy", icon: <FaShieldAlt /> },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <>
      <Navbar />
      <div className='max-w-4xl mx-auto p-4'>
        <h2 className='text-2xl font-bold mb-6'>Settings</h2>

        {/* Tabs */}
        <div className='flex flex-wrap gap-2 md:gap-4 mb-6 border-b pb-2'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
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

        {/* Content */}
        <div className='bg-white shadow p-6 rounded-lg'>
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "password" && <PasswordTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "privacy" && <PrivacyTab />}
        </div>
      </div>
      <Footer />
    </>
  );
}

// ----- TAB COMPONENTS -----

function ProfileTab() {
  return (
    <div className='space-y-4'>
      <div>
        <label className='block font-medium'>Full Name</label>
        <input
          type='text'
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:ring focus:ring-blue-500'
          placeholder='John Doe'
        />
      </div>
      <div>
        <label className='block font-medium'>Email</label>
        <input
          type='email'
          className='mt-1 block w-full rounded border border-gray-300 p-2'
          placeholder='john@example.com'
        />
      </div>
      <div>
        <label className='block font-medium'>Phone</label>
        <input
          type='tel'
          className='mt-1 block w-full rounded border border-gray-300 p-2'
          placeholder='+91-9876543210'
        />
      </div>
      <button className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
        Save Changes
      </button>
    </div>
  );
}

function PasswordTab() {
  return (
    <div className='space-y-4'>
      <div>
        <label className='block font-medium'>Current Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded border border-gray-300 p-2'
        />
      </div>
      <div>
        <label className='block font-medium'>New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded border border-gray-300 p-2'
        />
      </div>
      <div>
        <label className='block font-medium'>Confirm New Password</label>
        <input
          type='password'
          className='mt-1 block w-full rounded border border-gray-300 p-2'
        />
      </div>
      <button className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
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
