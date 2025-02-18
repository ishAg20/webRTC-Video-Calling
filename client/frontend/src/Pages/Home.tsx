import { useState } from "react";
import CreateRoom from "../Components/CreateRoom";
import JoinRoom from "../Components/JoinRoom";

const Home: React.FC = () => {
  const [name, setName] = useState<string>("");

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-4xl space-y-8">
        <div className="w-full flex flex-col items-center space-y-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center px-4">
            Welcome to Video Chat
          </h1>
          <div className="w-full max-w-md px-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
          <div className="w-full bg-gray-800 rounded-lg p-4 md:p-6">
            <CreateRoom name={name} disabled={!name.trim()} />
          </div>
          <div className="w-full bg-gray-800 rounded-lg p-4 md:p-6">
            <JoinRoom name={name} disabled={!name.trim()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
