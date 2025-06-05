import { selectCurrentUser } from '@/slices/auth-slice'
import { useAppSelector } from '@/store'
import { useMemo } from 'react'

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser)

  return useMemo(() => user, [user])
}
