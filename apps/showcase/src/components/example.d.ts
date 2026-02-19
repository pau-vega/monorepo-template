declare function ExampleWrapper({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function Example({ title, children, className, containerClassName, ...props }: React.ComponentProps<"div"> & {
    title?: string;
    containerClassName?: string;
}): import("react/jsx-runtime").JSX.Element;
export { ExampleWrapper, Example };
