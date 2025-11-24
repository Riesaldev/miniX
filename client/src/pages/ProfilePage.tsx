import ProfileCard from "../components/ProfileCard";

const Profile = () => {
  return (
    <section className="relative flex-1 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(127,90,240,0.15),_transparent_45%)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_right,_rgba(0,225,217,0.22),_transparent_55%)] blur-3xl opacity-70" />
      </div>
      <div className="relative max-w-5xl mx-auto px-6 py-16">
        <ProfileCard />
      </div>
    </section>
  );
};

export default Profile;