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
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold"
          style={{
            backgroundColor: "var(--avatar-bg)",
            color: "var(--text-secondary)",
          }}
        >
          {profile.displayName[0]?.toUpperCase()}
        </div>
      )}
      <h1
        className="mt-4 text-xl font-bold"
        style={{ color: "var(--text)" }}
      >
        {profile.displayName}
      </h1>
      {profile.bio && (
        <p
          className="mt-2 max-w-sm text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {profile.bio}
        </p>
      )}
    </div>
  );
}
