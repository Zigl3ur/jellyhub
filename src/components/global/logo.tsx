import Image from "next/image";

export default function Logo() {
  return (
    <div className="inline-flex text-center items-center">
      <Image
        src={"/icon.png"}
        alt="jellyhub icon"
        width={40}
        height={40}
        priority
      />
      <h1 className="pl-2 font-bold text-3xl">JellyHub</h1>
    </div>
  );
}
