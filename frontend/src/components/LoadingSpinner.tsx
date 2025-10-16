export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
}