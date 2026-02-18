export function ProfileCard({ profile }) {
  return (
    <div className="flex flex-col items-center text-center">
      {profile.avatarPath ? (
        <img
          src={`/api/uploads/${profile.avatarPath}`}
          alt={profile.displayName}
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-400">
          {profile.displayName[0]?.toUpperCase()}
        </div>
      )}
      <h1 className="mt-4 text-xl font-bold text-gray-900">
        {profile.displayName}
      </h1>
      {profile.bio && (
        <p className="mt-2 max-w-sm text-sm text-gray-600">{profile.bio}</p>
      )}
    </div>
  );
}
