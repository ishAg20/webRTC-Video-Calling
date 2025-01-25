import { useEffect, useRef } from "react";

interface UserFeedProps {
  stream: MediaStream;
}

const UserFeed: React.FC<UserFeedProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
      } else {
        console.warn("No media stream available");
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clean up on unmount
      }
    };
  }, [stream]);

  return (
    <>
      {stream ? (
        <video
          ref={videoRef}
          style={{ width: "100%", maxWidth: "300px", height: "auto" }}
          muted={true}
          autoPlay
        />
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          No stream available.
        </p>
      )}
    </>
  );
};

export default UserFeed;
