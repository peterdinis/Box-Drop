import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type Connection = {
  id: string
  requesterId: string
  receiverId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  requester: {
    id: string
    name: string
    email: string
  }
  receiver: {
    id: string
    name: string
    email: string
  }
}

type CreateConnectionInput = {
  requesterId: string
  receiverId: string
}

const fetchConnections = async (userId: string): Promise<Connection[]> => {
  const res = await fetch(`/api/connections?userId=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch connections')
  return res.json()
}

const createConnection = async (data: CreateConnectionInput): Promise<any> => {
  const res = await fetch('/api/connections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create connection')
  }

  return res.json()
}

export function useConnections(userId: string) {
  return useQuery({
    queryKey: ['connections', userId],
    queryFn: () => fetchConnections(userId),
    enabled: !!userId,
  })
}

export function useCreateConnection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createConnection,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['connections', variables.requesterId] })
      queryClient.invalidateQueries({ queryKey: ['connections', variables.receiverId] })
    },
  })
}
