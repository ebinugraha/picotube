import { SearchIcon } from "lucide-react"

export const SearchInput = () => {
    // TODO: implement search functionality
    return (
        <div className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                 <input
                    type="text"
                    placeholder="Search videos"
                    className="w-full pl-4 py-2.5 pr-12 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-400"
                 />
                 {/* TODO: add remove search button x */}
            </div>
            <button
                type="submit"
                className="rounded-r-full border border-l-0 bg-gray-100 px-4 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SearchIcon className="size-5"/>
            </button>
        </div>
    )
}