import type { SVGProps } from "react";
const SvgTarot = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 19 32"
    className="icon"
    {...props}
  >
    <path d="M2.821 0C1.259 0 0 1.299 0 2.864v26.273c0 1.564 1.259 2.864 2.821 2.864h13.267c1.562 0 2.821-1.299 2.821-2.864V2.864C18.909 1.3 17.65 0 16.088 0zm0 .727h13.267c1.159 0 2.094.961 2.094 2.136v26.273c0 1.176-.935 2.136-2.094 2.136H2.821c-1.159 0-2.094-.96-2.094-2.136V2.863c0-1.176.935-2.136 2.094-2.136m3.388 9.517.439 4.095L2.953 16l3.695 1.661-.439 4.095 3.254-2.433 3.256 2.433-.44-4.095L15.974 16l-3.695-1.661.44-4.095-3.256 2.433zm.9 1.581 2.354 1.76.436-.325 1.918-1.433-.261 2.435-.057.524.482.217 2.22.997-2.702 1.215.057.524.261 2.435-2.354-1.759-2.354 1.76.261-2.436.057-.524-.482-.217-2.22-.997 2.702-1.214-.057-.524-.261-2.436z" />
  </svg>
);
export default SvgTarot;
