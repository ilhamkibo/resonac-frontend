export default function Loading()
{
    return (
         <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <div className="text-gray-500">Loading...</div>
            </div>
        </div>
    )
}