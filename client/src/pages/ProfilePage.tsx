import ProfileCard from "../components/ProfileCard";


const Profile = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-emerald-500 z-0">
      <div className="bg-[url('/bg-profile.jpg')] bg-cover bg-no-repeat h-full w-full opacity-80 flex-grow">
        <div className="bg-emerald-500/10 backdrop-blur-xs min-h-screen flex items-center justify-center p-4">
          <ProfileCard />
        </div>

      </div>
    </div>
  );
}

export default Profile;