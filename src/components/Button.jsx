import { twMerge } from "tailwind-merge";

function Button({
  variant = 0,
  children,
  className,
  colorClassName = "bg-main-bg",
  wrapperClassName,
  as = "button",
  ...props
}) {
  const Component = as;

  if (variant === 0) {
    return (
      <Component
        {...props}
        className={twMerge(
          `flex p-[0.125em] rounded-[3.75em] relative overflow-hidden z-10 group disabled:opacity-60`,
          className
        )}
      >
        <span className="absolute top-0 left-0 w-full h-full primary-gradient -z-10"></span>

        <span
          className={twMerge(
            `flex h-[2.6em] items-center justify-center px-[1.25em] rounded-[3.75em] transition-all duration-200 ${colorClassName} group-hover:bg-transparent w-full`,
            wrapperClassName
          )}
        >
          <span className="text-[1em] font-bold font-ibm text-center w-full">
            {children}
          </span>
        </span>
      </Component>
    );
  }

  if (variant === 1) {
    return (
      <Component
        {...props}
        className={twMerge(
          `text-[1em] border-2 border-main-green flex items-center text-center justify-center font-bold text-white bg-transparent transition-all duration-200 hover:bg-main-green h-[2.8em] rounded-[3.75em] hover:text-black focus:border-white outline-none`,
          className
        )}
      >
        {children}
      </Component>
    );
  }

  if (variant === 2) {
    return (
      <Component
        {...props}
        className={`text-[1em] border-2 border-main-green flex text-center justify-center font-bold text-black bg-main-green transition-all duration-200 hover:bg-transparent items-center h-[2.8em] rounded-[3.75em] hover:text-white focus:border-white outline-none ${className}`}
      >
        {children}
      </Component>
    );
  }
}

export default Button;
