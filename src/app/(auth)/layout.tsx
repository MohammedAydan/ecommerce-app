const Layout = async ({ children }: { children: React.ReactNode }) => {
    // check if user is authenticated
    // const user = useUser();
    // const router = useRouter();
    // if (!user && router.pathname !== "/login") {
    //     router.push("/login");

    // }
    return (
        <div className="">
            {children}
        </div>
    );
};

export default Layout;