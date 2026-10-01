export function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
      <rect width="32" height="32" rx="6" fill="#1c5c44" />
      <path
        d="M8 10h16M8 16h10M8 22h13"
        stroke="#f4efe6"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
