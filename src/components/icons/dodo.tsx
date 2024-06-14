import type { SVGProps } from "react";
const SvgDodo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 33 32"
    className="icon"
    {...props}
  >
    <path d="M30.449 19.348c-.183-.518-.549-.945-1.037-1.159a9.78 9.78 0 0 0-6.677-6.707 9.97 9.97 0 0 0-8.658 1.555c-.335.244-.579.549-.793.762-.183.213-.457.305-.732.213l-.183-.091-.03-.03a.51.51 0 0 1-.183-.488.71.71 0 0 1 .305-.518c2.043-1.311 2.774-3.933 1.738-6.128a4.83 4.83 0 0 0-6.158-2.409l-.061.03v.091c-.03.213-.183.762-.579 1.159-.335.335-.671.396-1.25.488-.396.061-.854.152-1.494.335-.884.274-1.433.427-1.89.945-.305.335-.976 1.22-.64 2.165.244.701.884 1.006 1.159 1.128l.244.091-.061-.244c-.03-.183-.03-.396.03-.61.03.183.122.335.213.488.213.305.701.701 1.707.701.854 0 1.433-.366 1.982-.701.518-.335 1.037-.671 1.768-.64.274 0 .518.061.793.152a7.75 7.75 0 0 0-3.384 4.146 8.24 8.24 0 0 0 .091 5.671v.03a12.93 12.93 0 0 0 10 6.768l-.213 1.037-3.201-.915 2.134 1.067-3.658.091 3.994.457-2.591 1.616 3.841-1.494 2.226-.549-1.799-.122.244-1.128h.427c1.25 0 2.469-.183 3.597-.518v2.896l-3.415-.213 2.256.823-3.384 1.189 3.994-.457-1.037 1.677 2.561-1.982 3.963-.518-3.811-.335v-3.445c2.805-1.098 5.152-3.171 6.646-5.914.274-.183.61-.274.915-.274h.183zM5.176 9.531a5.3 5.3 0 0 1-1.555.03l.03-.03c.335-.488.915-.579 1.311-.671.335-.061.549-.03.762-.03.244.03.457.03.854-.03.152-.03.305-.061.427-.091a3.9 3.9 0 0 1-1.829.823zm3.201-2.866c-.244 0-.427-.183-.427-.427s.183-.427.427-.427.427.183.427.427c-.03.244-.213.427-.427.427" />
  </svg>
);
export default SvgDodo;