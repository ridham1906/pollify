export default function NotFoundPage(){
    return(
        <>
            <div className="flex flex-col gap-4 justify-center text-center mt-20">
                <h1 className="text-5xl font-bold text-gray-700"> 404 Not Found !</h1>
                <p className="text-xl font-semibold text-gray-700">Page you try to access is not available</p>
                <a href="/" className="font-bold bg-gray-600 w-fit text-white m-auto px-4 py-2 rounded-lg"> Click here </a>
            </div>
        </>
    )
}