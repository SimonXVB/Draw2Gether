interface ToolbarButtonInterface {
    children: React.ReactNode,
    title: string,
    onclick: () => void,
    style?: string
};

export function ToolbarButton({ children, title, onclick, style }: ToolbarButtonInterface) {
    return (
        <button className={`flex justify-center cursor-pointer bg-red-400 p-3 rounded-md hover:outline-2 hover:outline-white hover:scale-110 active:scale-100 transition-all duration-100 ${style}`} title={title} onClick={onclick}>
            {children}
        </button>
    )
};