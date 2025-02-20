import { useEffect, useRef } from "react";

interface UserFeedProps {
  stream: MediaStream | null;
  name: string;
}

const UserFeed: React.FC<UserFeedProps> = ({ stream, name }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream]);

  // Styles
  const styles = {
    container: {
      position: "relative" as const,
      width: "100%",
      maxWidth: "250px",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      border: "2px solid #fff",
      backgroundColor: "#222",
    },
    video: {
      width: "100%",
      borderRadius: "10px",
    },
    overlay: {
      position: "absolute" as const,
      bottom: 0,
      width: "100%",
      background: "rgba(0, 0, 0, 0.6)",
      padding: "8px",
      textAlign: "center" as const,
    },
    nameText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "14px",
      textTransform: "capitalize" as const,
    },
  };

  return (
    <div style={styles.container}>
      {/* Always render the container, even if the stream is null */}
      {stream ? (
        <video ref={videoRef} style={styles.video} muted autoPlay />
      ) : (
        <div
          style={{
            width: "100%",
            height: "150px",
            backgroundColor: "#444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "16px",
          }}
        >
          No stream available
        </div>
      )}
      <div style={styles.overlay}>
        <p style={styles.nameText}>{name}</p>
      </div>
    </div>
  );
};

export default UserFeed;
