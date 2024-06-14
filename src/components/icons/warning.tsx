import type { SVGProps } from "react";
const SvgWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 5.228c-1.029 0-2.06.497-2.634 1.497l-7.756 13.5c-1.149 1.999.33 4.575 2.634 4.575h15.513c2.304 0 3.783-2.576 2.634-4.575l-7.756-13.5c-.574-1-1.605-1.497-2.634-1.497zm0 1.544c.479 0 .959.253 1.247.753l7.756 13.5c.575 1.001-.103 2.175-1.247 2.175H8.244c-1.144 0-1.822-1.174-1.247-2.175l7.756-13.5c.287-.5.768-.753 1.247-.753m-.8 3.728v6.75h1.6V10.5z" />
    <path d="M16 18.2c-.985 0-1.8.815-1.8 1.8s.815 1.8 1.8 1.8 1.8-.815 1.8-1.8-.815-1.8-1.8-1.8m0 1.6c.12 0 .2.08.2.2s-.08.2-.2.2-.2-.08-.2-.2.08-.2.2-.2" />
  </svg>
);
export default SvgWarning;
