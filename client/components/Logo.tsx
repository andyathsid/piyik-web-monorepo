import Image from "next/image";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative w-8 h-8 ${className}`}>
      <Image
        src="/piyik.png"
        alt="Piyik Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}; 