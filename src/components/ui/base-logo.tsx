import Image from "next/image";

export function BaseLogo(
  props: { variant?: "black" | "white"; className?: string }
) {
  const { variant = "black", className = "" } = props;
  
  return (
    <Image
      src={`/base-logo-${variant}.svg`}
      alt="Base"
      width={80}
      height={20}
      className={className}
      priority
    />
  );
}

export function BaseMark(
  props: { variant?: "blue" | "black" | "white"; className?: string }
) {
  const { variant = "blue", className = "" } = props;
  
  return (
    <Image
      src={`/base-mark-${variant}.svg`}
      alt="Base"
      width={20}
      height={20}
      className={className}
      priority
    />
  );
}
