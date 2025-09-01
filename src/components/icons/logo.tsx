import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 2.66663C8.63636 2.66663 2.66669 8.63629 2.66669 16C2.66669 23.3636 8.63636 29.3333 16 29.3333C23.3637 29.3333 29.3334 23.3636 29.3334 16C29.3334 8.63629 23.3637 2.66663 16 2.66663Z"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.3333 10.6667L10.6666 21.3334"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6666 10.6667H10.68"
        stroke="hsl(var(--primary))"
        strokeWidth="3.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.3333 21.3334H21.3466"
        stroke="hsl(var(--primary))"
        strokeWidth="3.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
