import { useState } from "react"

export function useDropdown() {
    const [dropdownOpen, setDropdownState] = useState(false)
    const closeDropdown = () => {
        setDropdownState(false)
        document.removeEventListener("click", closeDropdown)
    }

    const openDropdown = () => {
        setDropdownState(true)
        // close the dropdown when document is clicked
        document.addEventListener("click", closeDropdown)
    }

    const toggleDropdown = dropdownOpen ? closeDropdown : openDropdown

    return {
        dropdownOpen,
        toggleDropdown,
    }
}
