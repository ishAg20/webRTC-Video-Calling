import CreateRoom from "../Components/CreateRoom";

const Home: React.FC = () => {
  return (
    <>
      <div className="h-[100vh] flex items-center justify-center">
        <CreateRoom></CreateRoom>
      </div>
    </>
  );
};
export default Home;
