import type { SVGProps } from "react";
const SvgCheckOnCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 4C9.384 4 4 9.384 4 16s5.384 12 12 12 12-5.384 12-12S22.616 4 16 4m0 2c5.535 0 10 4.465 10 10s-4.465 10-10 10S6 21.535 6 16 10.465 6 16 6" />
  </svg>
);
export default SvgCheckOnCircle;
