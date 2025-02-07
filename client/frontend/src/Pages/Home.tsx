import { useState } from "react";
import CreateRoom from "../Components/CreateRoom";
import JoinRoom from "../Components/JoinRoom";

const Home: React.FC = () => {
  const [name, setName] = useState<string>("");

  return (
    <div className="h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-white"
        />
      </div>
      <div className="p-8 m-4 bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-all">
        <CreateRoom name={name} disabled={!name.trim()} />
      </div>
      <div className="p-8 m-4 bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-all">
        <JoinRoom name={name} disabled={!name.trim()} />
      </div>
    </div>
  );
};

export default Home;
