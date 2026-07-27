export default function Tabs({ children, className = "" }) {
  return <div className={`tabs tabs-border ${className}`}>{children}</div>;
}

export function Tab({
  name,
  label,
  count,
  defaultChecked = false,
  contentClassName = "pt-5",
  children,
}) {
  return (
    <>
      <input
        type="radio"
        name={name}
        className="tab"
        aria-label={count != null ? `${label} ${count}` : label}
        defaultChecked={defaultChecked}
      />
      <div className={`tab-content ${contentClassName}`}>{children}</div>
    </>
  );
}
