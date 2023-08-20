import { LanguageContext } from "../context/LanguageContext"
import { useContext } from "react"

export const useLanguageContext = () => {
  const context = useContext(LanguageContext)

  if(!context) {
    throw Error('useTodosContext must be used inside a LanguageContextProvider')
  }

  return context
}