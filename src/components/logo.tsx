export default function Logo() {
  return (
    <div className="flex flex-col xs:flex-row gap-2 text-center justify-center items-center">
      <img src={"/icon.png"} alt="jellyhub icon" width={60} height={60} />
      <h1 className="pl-2 font-bold text-4xl">JellyHub</h1>
    </div>
  );
}
