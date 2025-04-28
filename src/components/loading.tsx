const Loading = () => {
    return (
        // <div className="w-full h-screen z-40 flex items-center justify-center">
        //     <div className="w-12 h-12 rounded-full border-4 border-foreground border-r-transparent animate-spin">
        //     </div>
        // </div>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-foreground border-r-transparent animate-spin">
            </div>
        </div>
    );
}

export default Loading;