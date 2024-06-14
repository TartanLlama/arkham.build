import type { SVGProps } from "react";
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M15.964.016C7.592.036.733 6.489.069 14.693l-.004.057c-.031.374-.049.81-.049 1.25 0 8.168 6.126 14.904 14.034 15.866l.077.008c.562.07 1.213.11 1.873.11 7.948 0 14.541-5.801 15.776-13.399l.012-.092.196-2.492c0-8.607-6.804-15.626-15.327-15.97L16.626.03a15 15 0 0 0-.625-.012h-.039.002zm-3.715 8.451c1.527.002 2.893.782 3.805 2.009l.006.008c.922-1.235 2.291-2.015 3.821-2.016h.009c2.752 0 4.982 2.527 4.982 5.645 0 1.671-.641 3.172-1.659 4.206l-.005.005v.011l-.053.05a6 6 0 0 1-.508.444l-.02.015-6.559 5.685-1.179-1.017-5.379-4.668a8 8 0 0 1-.538-.459l-.053-.05.009-.011c-1.025-1.038-1.667-2.541-1.667-4.213 0-3.117 2.23-5.644 4.981-5.644z" />
  </svg>
);
export default SvgHeart;
